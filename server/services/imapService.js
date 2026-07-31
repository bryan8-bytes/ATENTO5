import { ImapFlow } from 'imapflow';
import pool from '../config/database.js';
import { simpleParser } from 'mailparser';

const IMAP_HOST = process.env.IMAP_HOST || 'mail.atento5.com';
const IMAP_PORT = process.env.IMAP_PORT || 993;

export async function connectToIMAP(email, password) {
  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: { user: email, pass: password },
    logger: false,
    tls: { rejectUnauthorized: false }
  });

  await client.connect();
  return client;
}

export async function getFolderList(client) {
  const folders = [];
  for await (const entry of client.folders) {
    folders.push(entry);
  }

  const filtered = folders.filter(name => {
    const upper = name.toUpperCase();
    return !upper.includes('NOSE') &&
           !upper.includes('NO SELECT') &&
           !['TRASH', 'JUNK'].every(part => !upper.includes(part));
  });

  const aliases = {
    'INBOX': 'INBOX',
    '[GMAIL]/SENT MAIL': 'Sent',
    '[GMAIL]/DRAFTS': 'Drafts',
    '[GMAIL]/SPAM': 'Spam',
    '[GMAIL]/TRASH': 'Trash'
  };

  return filtered.map(name => ({
    originalName: name,
    displayName: aliases[name.toUpperCase()] || name
  }));
}

function extractPriority(envelope) {
  const headers = envelope.headers || {};
  const xPriority = headers['x-priority'] || headers['X-Priority'];
  const importance = headers['importance'] || headers['Importance'];

  if (xPriority === '1' || (xPriority && Number(xPriority) === 1) || String(importance).toLowerCase() === 'high') {
    return 'Alta';
  }
  if (xPriority === '5' || (xPriority && Number(xPriority) === 5) || String(importance).toLowerCase() === 'low') {
    return 'Baja';
  }
  if (String(envelope.subject || '').toLowerCase().includes('urgente')) {
    return 'Urgente';
  }

  return 'Normal';
}

function extractAddresses(prop) {
  if (!prop) return { name: '', email: '' };
  const address = prop?.[0];
  if (!address) return { name: '', email: '' };
  return {
    name: address.name || '',
    email: address.address || ''
  };
}

export async function syncSingleAccountFolder(userId, email, imapPassword, folderMeta) {
  if (!imapPassword) return { added: 0, updated: 0, folder: folderMeta.originalName };

  console.log(`[IMAP] Syncing ${folderMeta.originalName} for ${email}...`);
  let client;
  try {
    client = await connectToIMAP(email, imapPassword);
  } catch (err) {
    console.error(`[IMAP] Connection failed for ${email}:`, err.message);
    return { added: 0, updated: 0, folder: folderMeta.originalName };
  }

  try {
    await client.mailboxOpen(folderMeta.originalName);
    const mailbox = await client.mailboxOpen(folderMeta.originalName);
    const allUids = await client.search({ all: true });

    const cachedResult = await pool.query(
      'SELECT id, uid, message_id FROM email_cache WHERE user_id = $1 AND account_email = $2 AND folder = $3',
      [userId, email, folderMeta.displayName]
    );

    const cachedUidsSet = new Set(cachedResult.rows.filter(r => r.uid !== null).map(r => r.uid));
    const cachedMessageIds = new Map(cachedResult.rows.filter(r => r.message_id !== null).map(r => [r.message_id, r.id]));
    const missingUids = allUids.filter(uid => !cachedUidsSet.has(uid));

    console.log(`[IMAP] ${folderMeta.originalName}: ${allUids.length} on server, ${cachedUidsSet.size} cached, ${missingUids.length} missing.`);

    const sortedMissing = missingUids.sort((a, b) => b - a);
    const BATCH_SIZE = 50;
    let added = 0;
    let updated = 0;

    for (let i = 0; i < sortedMissing.length; i += BATCH_SIZE) {
      const batch = sortedMissing.slice(i, i + BATCH_SIZE);
      console.log(`[IMAP] ${folderMeta.originalName}: batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sortedMissing.length / BATCH_SIZE)} for ${email}...`);

      for await (const message of client.fetch(batch, { envelope: true, source: true, bodyStructure: true })) {
        try {
          const parsed = await simpleParser(message.source);
          const envelope = message.envelope;

          const from = extractAddresses(envelope.from);
          const to = extractAddresses(envelope.to);
          const cc = extractAddresses(envelope.cc);
          const bcc = extractAddresses(envelope.bcc);

          const htmlBody = parsed.html || '';
          const textBody = parsed.text || parsed.textAsHtml || '';
          const body = htmlBody || textBody;
          const priority = extractPriority(envelope);
          const messageId = envelope.messageId || `uid-${message.uid}`;

          const cachedDbId = cachedMessageIds.get(messageId);
          let emailCacheId;

          if (!cachedDbId) {
            const existing = await pool.query(
              'SELECT id FROM email_cache WHERE message_id = $1 AND user_id = $2 AND account_email = $3',
              [messageId, userId, email]
            );

            if (existing.rows.length === 0) {
              const insertRes = await pool.query(
                `INSERT INTO email_cache 
                (user_id, account_email, folder, message_id, subject, from_email, from_name, to_name, to_email, cc, bcc, body, html_body, text_body, date, is_read, has_attachments, uid, priority, size)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
                RETURNING id`,
                [
                  userId,
                  email,
                  folderMeta.displayName,
                  messageId,
                  envelope.subject || '(No Subject)',
                  from.email,
                  from.name,
                  to.name,
                  to.email,
                  cc.email || null,
                  bcc.email || null,
                  body,
                  htmlBody,
                  textBody,
                  envelope.date || new Date(),
                  true,
                  (parsed.attachments && parsed.attachments.length > 0),
                  message.uid,
                  priority,
                  message.size || 0
                ]
              );
              emailCacheId = insertRes.rows[0].id;
              added++;
            } else {
              emailCacheId = existing.rows[0].id;
              await pool.query(
                `UPDATE email_cache 
                SET body = $1, html_body = $2, text_body = $3, date = $4, has_attachments = $5, uid = $6, priority = $7, size = $8
                WHERE id = $9`,
                [body, htmlBody, textBody, envelope.date || new Date(), (parsed.attachments && parsed.attachments.length > 0), message.uid, priority, message.size || 0, emailCacheId]
              );
              updated++;
            }
          } else {
            emailCacheId = cachedDbId;
            await pool.query(
              `UPDATE email_cache 
              SET body = $1, html_body = $2, text_body = $3, date = $4, has_attachments = $5, uid = $6, priority = $7, size = $8
              WHERE id = $9`,
              [body, htmlBody, textBody, envelope.date || new Date(), (parsed.attachments && parsed.attachments.length > 0), message.uid, priority, message.size || 0, emailCacheId]
            );
            updated++;
          }

          if (parsed.attachments && parsed.attachments.length > 0) {
            for (const att of parsed.attachments) {
              const existingAtt = await pool.query(
                'SELECT id FROM attachments WHERE email_id = $1 AND filename = $2',
                [emailCacheId, att.filename || 'attachment']
              );

              if (existingAtt.rows.length === 0) {
                await pool.query(
                  `INSERT INTO attachments (email_id, filename, mimetype, size, data)
                  VALUES ($1, $2, $3, $4, $5)`,
                  [emailCacheId, att.filename || 'attachment', att.contentType, att.size, att.content]
                );
              }
            }
          }
        } catch (messageErr) {
          console.error(`[IMAP] Error parsing message ${message.uid} in ${email}/${folderMeta.originalName}:`, messageErr.message);
        }
      }
    }

    await pool.query(
      `INSERT INTO folder_sync (user_id, folder, last_sync, total_count, imap_uidvalidity, imap_uidnext)
      VALUES ($1, $2, NOW(), $3, $4, $5)
      ON CONFLICT (user_id, folder) 
      DO UPDATE SET last_sync = NOW(), total_count = $3, imap_uidvalidity = $4, imap_uidnext = $5`,
      [userId, `${email}:${folderMeta.displayName}`, mailbox.exists, mailbox.uidValidity, mailbox.uidNext]
    );

    return { added, updated, folder: folderMeta.displayName };
  } finally {
    try {
      await client.logout();
    } catch (logoutErr) {
      console.error(`[IMAP] Logout error for ${email}/${folderMeta.originalName}:`, logoutErr.message);
    }
  }
}

export async function syncFolder(userId, folder, accountEmail = null) {
  try {
    let added = 0;
    let updated = 0;
    let syncedFolders = [];
    const createDefault = (name) => ({ originalName: name, displayName: name });

    if (accountEmail && accountEmail !== 'all') {
      let account;
      const userResult = await pool.query('SELECT email, imap_password FROM users WHERE id = $1 AND email = $2', [userId, accountEmail]);
      if (userResult.rows.length > 0) {
        account = userResult.rows[0];
      } else {
        const accountResult = await pool.query('SELECT email, imap_password FROM email_accounts WHERE user_id = $1 AND email = $2', [userId, accountEmail]);
        if (accountResult.rows.length === 0) throw new Error(`Account ${accountEmail} not found`);
        account = accountResult.rows[0];
      }

      const client = await connectToIMAP(account.email, account.imap_password);
      const folders = await getFolderList(client);
      syncedFolders = folder
        ? folders.filter(f => f.displayName.toLowerCase() === folder.toLowerCase())
        : folders;
      syncedFolders = syncedFolders.map(f => ({ ...f, accountEmail: account.email, imapPassword: account.imap_password }));
      await client.logout();
    } else {
      const userResult = await pool.query('SELECT email, imap_password FROM users WHERE id = $1', [userId]);
      let primaryFolders = [];
      let secondaryFolders = [];

      if (userResult.rows.length > 0 && userResult.rows[0].imap_password) {
        const client = await connectToIMAP(userResult.rows[0].email, userResult.rows[0].imap_password);
        primaryFolders = folder
          ? [createDefault(folder)]
          : await getFolderList(client);
        primaryFolders = primaryFolders.map(f => ({ ...f, accountEmail: userResult.rows[0].email, imapPassword: userResult.rows[0].imap_password }));
        await client.logout();
      }

      const accountsResult = await pool.query('SELECT email, imap_password FROM email_accounts WHERE user_id = $1', [userId]);
      for (const account of accountsResult.rows) {
        if (userResult.rows.length > 0 && account.email === userResult.rows[0].email) continue;
        try {
          const client = await connectToIMAP(account.email, account.imap_password);
          const secFolders = folder
            ? [createDefault(folder)]
            : await getFolderList(client);
          secondaryFolders.push({ account, folders: secFolders.map(f => ({ ...f, accountEmail: account.email, imapPassword: account.imap_password })) });
          await client.logout();
        } catch (err) {
          console.error(`Failed to list folders for ${account.email}:`, err);
        }
      }

      if (accountEmail === 'all' || !accountEmail) {
        syncedFolders = [
          ...primaryFolders,
          ...secondaryFolders.flatMap(sf => sf.folders)
        ];
      }
    }

    for (const folderMeta of syncedFolders) {
      if (!folderMeta.accountEmail || !folderMeta.imapPassword) continue;
      try {
        const res = await syncSingleAccountFolder(userId, folderMeta.accountEmail, folderMeta.imapPassword, folderMeta);
        added += res.added;
        updated += res.updated;
      } catch (err) {
        console.error(`Failed to sync folder ${folderMeta.displayName} for ${folderMeta.accountEmail}:`, err);
      }
    }

    return { added, updated };
  } catch (error) {
    console.error(`Error syncing folder ${folder}:`, error);
    throw error;
  }
}

export async function getEmailBody(userId, emailId) {
  try {
    const result = await pool.query('SELECT body FROM email_cache WHERE id = $1 AND user_id = $2', [emailId, userId]);
    if (result.rows.length === 0) throw new Error('Email not found');
    return result.rows[0].body;
  } catch (error) {
    console.error('Error getting email body:', error);
    throw error;
  }
}

export async function autoSyncAllUsers() {
  try {
    const usersResult = await pool.query('SELECT id, email, imap_password FROM users WHERE imap_password IS NOT NULL');

    for (const user of usersResult.rows) {
      try {
        let allFolders = [];
        try {
          const client = await connectToIMAP(user.email, user.imap_password);
          allFolders = await getFolderList(client);
          await client.logout();
        } catch (err) {
          console.error(`[autoSync] Failed to list folders for ${user.email}:`, err.message);
          continue;
        }

        for (const folder of allFolders) {
          try {
            await syncSingleAccountFolder(user.id, user.email, user.imap_password, folder);
          } catch (folderErr) {
            console.error(`[autoSync] Failed syncing ${folder.displayName} for ${user.email}:`, folderErr.message);
          }
        }

        console.log(`Auto-sync completed for user ${user.email}`);
      } catch (error) {
        console.error(`Auto-sync failed for user ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Auto-sync error:', error);
  }
}

export async function classifyEmailsForUser(userId, accountEmail = null) {
  let query = 'SELECT id, subject, from_email, body, priority, has_attachments FROM email_cache WHERE user_id = $1';
  const params = [userId];

  if (accountEmail && accountEmail !== 'all') {
    query += ' AND account_email = $2';
    params.push(accountEmail);
  }

  const result = await pool.query(query, params);
  let classified = 0;

  for (const email of result.rows) {
    const labels = classifyEmailAutomatically(email);
    if (labels.length > 0) {
      await pool.query(
        'UPDATE email_cache SET labels = $1 WHERE id = $2',
        [labels, email.id]
      );
      classified++;
    }
  }

  return { classified, total: result.rows.length };
}

export function classifyEmailAutomatically(email) {
  const subject = (email.subject || '').toLowerCase();
  const fromEmail = (email.from_email || '').toLowerCase();
  const body = (email.body || '').toLowerCase();
  const priority = (email.priority || 'Normal').toLowerCase();
  const labels = [];

  if (
    priority === 'urgente' ||
    /urgente|inmediato|resoluci[oó]n/.test(subject)
  ) {
    labels.push('Urgentes');
  }
  if (
    priority === 'alta' ||
    /alta|prioridad|atenci[oó]n/.test(subject)
  ) {
    labels.push('Alta');
  }
  if (
    /gob|gov|dian|ministerio|sena|sunat|superintendencia|municipalidad|essalud|sunarp|lima|mesa de partes|registro|notaria|osce|pcm|presidencia|congreso|defensor[íi]a|minjus|minem|minagri|minsa|minedu|mtc|mimp|produce|mincetur|vivienda|trabajo|energia|petroperu/.test(fromEmail) ||
    /sunarp|lima|mesa de partes|gobierno|ministerio|superintendencia|registro p[úu]blico|notar[íi]a|osce|pcm|dian|sunat|municipalidad/.test(subject)
  ) {
    labels.push('Gobierno');
  }
  if (/cliente|clientes|proyecto/.test(subject)) {
    labels.push('Clientes');
  }
  if (/proveedor|proveedores|factura|facturaci[oó]n|compra|orden de compra|purchase order|cotizaci[oó]n/.test(subject)) {
    labels.push('Proveedores/Facturas');
  }
  if (/banco|bancos|transferencia|pago|retiro|dep[oó]sito/.test(subject)) {
    labels.push('Bancos');
  }
  if (/adjunto|archivo|pdf|word|excel|zip|rar/.test(subject) || (email.has_attachments)) {
    labels.push('Con adjuntos');
  }
  if (/newsletter|bolet[ií]n|publicidad|promo|oferta|descuento/.test(subject) || /marketing/.test(fromEmail)) {
    labels.push('Publicidad');
  }
  if (/security|verify|confirmaci[oó]n|alerta|notificaci[oó]n/i.test(subject) || /security|verify/.test(fromEmail)) {
    labels.push('Seguridad');
  }
  if (/personal|casa|familia|vacaciones|permiso/.test(subject)) {
    labels.push('Personal');
  }

  return labels;
}
