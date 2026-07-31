import express from 'express';
import { connectToIMAP, getFolderList, syncFolder, syncSingleAccountFolder, classifyEmailsForUser } from '../services/imapService.js';
import pool from '../config/database.js';

const router = express.Router();

router.post('/connect', async (req, res) => {
  try {
    const { email, password } = req.body;

    const _connection = await connectToIMAP(email, password);

    res.json({ 
      message: 'IMAP connection successful',
      connected: true 
    });
  } catch (error) {
    console.error('IMAP connection error:', error);
    res.status(500).json({ 
      error: 'Failed to connect to IMAP server',
      details: error.message 
    });
  }
});

router.post('/sync/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    const userId = req.user.userId;
    const userEmail = req.user.email;

    console.log(`[IMAP] Starting sync for user ${userId}, folder ${folder}, account ${userEmail}`);
    const result = await syncFolder(userId, folder, userEmail);

    res.json({ 
      message: 'Folder synced successfully',
      emailsAdded: result.added,
      emailsUpdated: result.updated
    });
  } catch (error) {
    console.error('Sync folder error:', error);
    res.status(500).json({ 
      error: 'Failed to sync folder',
      details: error.message 
    });
  }
});

router.get('/accounts', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const primaryResult = await pool.query(
      'SELECT email, imap_password FROM users WHERE id = $1',
      [userId]
    );

    const secondaryResult = await pool.query(
      'SELECT email, imap_password FROM email_accounts WHERE user_id = $1',
      [userId]
    );

    const accounts = [];

    if (primaryResult.rows.length > 0) {
      accounts.push({ 
        email: primaryResult.rows[0].email, 
        isPrimary: true,
        hasPassword: !!primaryResult.rows[0].imap_password
      });
    }

    for (const acc of secondaryResult.rows) {
      if (accounts.some(a => a.email === acc.email)) continue;
      accounts.push({ 
        email: acc.email, 
        isPrimary: false,
        hasPassword: !!acc.imap_password
      });
    }

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Failed to get accounts' });
  }
});

router.get('/folders', async (req, res) => {
  try {
    const userId = req.user.userId;
    const userEmail = req.user.email;

    let imapPassword = null;
    const userResult = await pool.query(
      'SELECT imap_password FROM users WHERE id = $1 AND email = $2',
      [userId, userEmail]
    );

    if (userResult.rows.length > 0) {
      imapPassword = userResult.rows[0].imap_password;
    } else {
      const accountResult = await pool.query(
        'SELECT imap_password FROM email_accounts WHERE user_id = $1 AND email = $2',
        [userId, userEmail]
      );
      if (accountResult.rows.length > 0) {
        imapPassword = accountResult.rows[0].imap_password;
      }
    }

    if (!imapPassword) {
      const syncStatus = await pool.query(
        `SELECT folder, last_sync, total_count FROM folder_sync WHERE user_id = $1 AND folder LIKE $2`,
        [userId, `${userEmail}:%`]
      );

      const folders = syncStatus.rows.map(row => ({
        name: row.folder.replace(`${userEmail}:`, ''),
        lastSync: row.last_sync,
        totalCount: row.total_count
      }));

      return res.json({ folders });
    }

    const client = await connectToIMAP(userEmail, imapPassword);
    const imapFolders = await getFolderList(client);

    const syncStatusPromises = imapFolders.map(async (folderInfo) => {
      const folderKey = `${userEmail}:${folderInfo.name}`;
      const result = await pool.query(
        'SELECT last_sync, total_count FROM folder_sync WHERE user_id = $1 AND folder = $2',
        [userId, folderKey]
      );
      return {
        name: folderInfo.name,
        attributes: folderInfo.attributes,
        lastSync: result.rows[0]?.last_sync || null,
        totalCount: result.rows[0]?.total_count || 0
      };
    });

    const syncStatus = await Promise.all(syncStatusPromises);

    await client.logout();

    res.json({ folders: syncStatus });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ error: 'Failed to get folders', details: error.message });
  }
});

router.post('/sync-all', async (req, res) => {
  try {
    const userId = req.user.userId;
    const _userEmail = req.user.email;

    const userResult = await pool.query(
      'SELECT email, imap_password FROM users WHERE id = $1',
      [userId]
    );

    const accounts = [];
    if (userResult.rows.length > 0 && userResult.rows[0].imap_password) {
      accounts.push({ email: userResult.rows[0].email, password: userResult.rows[0].imap_password });
    }

    const secondaryAccounts = await pool.query(
      'SELECT email, imap_password FROM email_accounts WHERE user_id = $1 AND imap_password IS NOT NULL',
      [userId]
    );

    for (const acc of secondaryAccounts.rows) {
      if (!accounts.some(a => a.email === acc.email)) {
        accounts.push({ email: acc.email, password: acc.imap_password });
      }
    }

    if (accounts.length === 0) {
      return res.json({ message: 'No accounts configured', results: {} });
    }

    const results = {};
    
    for (const account of accounts) {
      try {
        const client = await connectToIMAP(account.email, account.password);
        const folders = await getFolderList(client);
        await client.logout();

        const accountResults = {};
        for (const folderInfo of folders) {
          try {
            const result = await syncSingleAccountFolder(userId, account.email, account.password, folderInfo.name);
            accountResults[folderInfo.name] = {
              success: true,
              added: result.added,
              updated: result.updated
            };
          } catch (folderErr) {
            accountResults[folderInfo.name] = {
              success: false,
              error: folderErr.message
            };
          }
        }

        results[account.email] = accountResults;
      } catch (accountErr) {
        results[account.email] = { error: accountErr.message };
      }
    }

    res.json({ 
      message: 'Sync completed for all accounts and folders',
      results 
    });
  } catch (error) {
    console.error('Sync all error:', error);
    res.status(500).json({ 
      error: 'Failed to sync all folders',
      details: error.message 
    });
  }
});

router.post('/classify-all', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { accountEmail } = req.body;

    const result = await classifyEmailsForUser(userId, accountEmail);

    res.json({ 
      message: 'Classification completed',
      ...result
    });
  } catch (error) {
    console.error('Classify all error:', error);
    res.status(500).json({ 
      error: 'Failed to classify emails',
      details: error.message 
    });
  }
});

export default router;
