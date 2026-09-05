import { ImapFlow } from 'imapflow';
import pool from '../config/database.js';
import { simpleParser } from 'mailparser';

const IMAP_HOST = process.env.IMAP_HOST || 'mail.atento5.com';
const IMAP_PORT = process.env.IMAP_PORT || 993;
const IMAP_MAX_RETRIES = parseInt(process.env.IMAP_MAX_RETRIES || '3', 10);
const IMAP_BASE_DELAY_MS = parseInt(process.env.IMAP_BASE_DELAY_MS || '2000', 10);
// Max simultaneous IMAP connections across all accounts
const IMAP_MAX_CONCURRENT = parseInt(process.env.IMAP_MAX_CONCURRENT || '5', 10);
// Per-account concurrent connection cap
const IMAP_MAX_PER_ACCOUNT = parseInt(process.env.IMAP_MAX_PER_ACCOUNT || '2', 10);

// ---------------------------------------------------------------------------
// Logging helper
// ---------------------------------------------------------------------------
const log = (level, email, msg, ...args) => {
  const ts = new Date().toISOString();
  const tag = `[IMAP][${ts}]${(email ? '(' + email + ') ' : ' ')}`;
  if (level === 'error') console.error(tag + msg, ...args);
  else if (level === 'warn') console.warn(tag + msg, ...args);
  else console.log(tag + msg, ...args);
};

// ---------------------------------------------------------------------------
// Connection registry + concurrency control
// ---------------------------------------------------------------------------
// Active connections keyed by internal connection id -> { client, email }
const activeConnections = new Map();
const connectionsByAccount = new Map(); // email -> count

let activeCount = 0;
const waiters = [];

function releaseSlot() {
  activeCount = Math.max(0, activeCount - 1);
  if (waiters.length > 0) {
    const next = waiters.shift();
    next();
  }
}

function acquireSlot() {
  if (activeCount < IMAP_MAX_CONCURRENT) {
    activeCount++;
    return Promise.resolve();
  }
  return new Promise((resolve) => waiters.push(resolve));
}

function acquireAccountSlot(email) {
  const current = connectionsByAccount.get(email) || 0;
  if (current < IMAP_MAX_PER_ACCOUNT) {
    connectionsByAccount.set(email, current + 1);
    return true;
  }
  return false;
}

function releaseAccountSlot(email) {
  const current = connectionsByAccount.get(email) || 0;
  if (current > 0) connectionsByAccount.set(email, current - 1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function logConnectionStats(email) {
  log('log', email, `active connections=${activeCount}/${IMAP_MAX_CONCURRENT}, account=${email}:${connectionsByAccount.get(email) || 0}/${IMAP_MAX_PER_ACCOUNT}`);
}

// ---------------------------------------------------------------------------
// Safe connection teardown (never throws)
// ---------------------------------------------------------------------------
export async function closeClient(client) {
  if (!client) return;
  const email = client._email || 'unknown';
  try {
    if (!client._closed) {
      await client.logout();
    }
  } catch (err) {
    log('warn', email, `logout error: ${err.message}`);
  } finally {
    if (typeof client._release === 'function') client._release();
    if (client._connId) activeConnections.delete(client._connId);
    if (client._email) releaseAccountSlot(client._email);
    client._closed = true;
  }
}

// ---------------------------------------------------------------------------
// Connection factory with per-account isolation, retries and backoff
// ---------------------------------------------------------------------------
export async function connectToIMAP(email, password, options = {}) {
  const maxRetries = options.maxRetries ?? IMAP_MAX_RETRIES;
  const baseDelay = options.baseDelay ?? IMAP_BASE_DELAY_MS;

  // Global concurrency limit (released on close)
  await acquireSlot();
  if (!acquireAccountSlot(email)) {
    releaseSlot();
    throw new Error(`Concurrent IMAP connection limit reached for ${email}`);
  }

  let lastErr;
  let authFailed = false;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const client = new ImapFlow({
      host: IMAP_HOST,
      port: IMAP_PORT,
      secure: true,
      auth: { user: email, pass: password },
      logger: false,
      tls: { rejectUnauthorized: false }
    });

    const connId = `${email}#${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    client._email = email;
    client._connId = connId;
    client._closed = false;

    // idempotent slot release wrapper
    let slotReleased = false;
    client._release = () => {
      if (!slotReleased) {
        slotReleased = true;
        releaseSlot();
      }
    };

    // Named handlers so we can reason about lifecycle and avoid leaks
    const onError = (err) => {
      log('error', email, `connection error: ${err && err.message ? err.message : err}`);
    };
    const onClose = () => {
      log('log', email, `connection closed (${connId})`);
      client._closed = true;
      activeConnections.delete(connId);
      if (client._release) client._release();
      releaseAccountSlot(email);
    };
    const onEnd = () => {
      log('log', email, `connection ended (${connId})`);
      client._closed = true;
      if (client._release) client._release();
      releaseAccountSlot(email);
    };
    const onAuthFailed = (info) => {
      authFailed = true;
      log('error', email, `authentication failed: ${info && info.message ? info.message : 'invalid credentials'}`);
    };

    client.on('error', onError);
    client.on('close', onClose);
    client.on('end', onEnd);
    client.on('authenticationFailed', onAuthFailed);

    activeConnections.set(connId, { client, email });
    logConnectionStats(email);

    try {
      await client.connect();
      log('log', email, `connected successfully (attempt ${attempt + 1}/${maxRetries + 1})`);
      return client;
    } catch (err) {
      lastErr = err;
      // Clean up this failed attempt
      try {
        if (!client._closed) await client.logout();
      } catch (_) { /* ignore */ }
      activeConnections.delete(connId);
      releaseAccountSlot(email);

      // Authentication failures will not succeed on retry
      if (authFailed || (err && (err.authenticationFailed || /authentication/i.test(err.message || '')))) {
        if (client._release) client._release();
        throw err;
      }

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        log('warn', email, `connect attempt ${attempt + 1} failed, retrying in ${delay}ms: ${err.message}`);
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  throw lastErr || new Error(`Unable to connect to IMAP for ${email}`);
}

export function getActiveConnectionCount() {
  return activeCount;
}

export async function getFolderList(client) {
  let folders = [];
  try {
    folders = await client.list();
  } catch (err) {
    log('error', '', `getFolderList list error: ${err.message}`);
  }

  const filtered = folders.filter(folder => {
    const upper = (folder.path || folder.name || '').toUpperCase();
    return !upper.includes('NOSE') &&
           !upper.includes('NO SELECT') &&
           !upper.includes('TRASH') &&
           !upper.includes('JUNK');
  });

  const aliases = {
    'INBOX': 'INBOX',
    '[GMAIL]/SENT MAIL': 'Sent',
    '[GMAIL]/DRAFTS': 'Drafts',
    '[GMAIL]/SPAM': 'Spam',
    '[GMAIL]/TRASH': 'Trash'
  };

  return filtered.map(folder => ({
    originalName: folder.path || folder.name,
    displayName: aliases[(folder.path || folder.name || '').toUpperCase()] || (folder.path || folder.name)
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

  log('log', email, `Syncing ${folderMeta.originalName}...`);
  let client;
  try {
    client = await connectToIMAP(email, imapPassword);
  } catch (err) {
    log('error', email, `Connection failed: ${err.message}`);
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

    const sortedMissing = missingUids.sort((a, b) => b - a);
    const BATCH_SIZE = 50;
    let added = 0;
    let updated = 0;

    for (let i = 0; i < sortedMissing.length; i += BATCH_SIZE) {
      const batch = sortedMissing.slice(i, i + BATCH_SIZE);

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
              if (typeof global !== 'undefined' && global.notifyUser) {
                global.notifyUser(userId, {
                  type: 'new_email',
                  email: {
                    id: emailCacheId,
                    uid: message.uid,
                    message_id: messageId,
                    subject: envelope.subject || '(No Subject)',
                    from_email: from.email,
                    from_name: from.name,
                    to_email: to.email,
                    to_name: to.name,
                    folder: folderMeta.displayName,
                    date: envelope.date || new Date(),
                    account_email: email,
                    has_attachments: (parsed.attachments && parsed.attachments.length > 0),
                    priority,
                    size: message.size || 0
                  }
                });
              }
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
          log('error', email, `Error parsing message ${message.uid} in ${folderMeta.originalName}: ${messageErr.message}`);
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
    await closeClient(client);
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

      let client;
      try {
        client = await connectToIMAP(account.email, account.imap_password);
        const folders = await getFolderList(client);
        syncedFolders = folder
          ? folders.filter(f => f.displayName.toLowerCase() === folder.toLowerCase())
          : folders;
        syncedFolders = syncedFolders.map(f => ({ ...f, accountEmail: account.email, imapPassword: account.imap_password }));
      } catch (err) {
        log('error', account.email, `Failed to list folders: ${err.message}`);
        return { added: 0, updated: 0 };
      } finally {
        if (client) await closeClient(client);
      }
    } else {
      const userResult = await pool.query('SELECT email, imap_password FROM users WHERE id = $1', [userId]);
      let primaryFolders = [];
      let secondaryFolders = [];

      if (userResult.rows.length > 0 && userResult.rows[0].imap_password) {
        let client;
        try {
          client = await connectToIMAP(userResult.rows[0].email, userResult.rows[0].imap_password);
          primaryFolders = folder
            ? [createDefault(folder)]
            : await getFolderList(client);
          primaryFolders = primaryFolders.map(f => ({ ...f, accountEmail: userResult.rows[0].email, imapPassword: userResult.rows[0].imap_password }));
        } catch (err) {
          log('error', userResult.rows[0].email, `Failed to list primary folders: ${err.message}`);
        } finally {
          if (client) await closeClient(client);
        }
      }

      const accountsResult = await pool.query('SELECT email, imap_password FROM email_accounts WHERE user_id = $1', [userId]);
      for (const account of accountsResult.rows) {
        if (userResult.rows.length > 0 && account.email === userResult.rows[0].email) continue;
        let client;
        try {
          client = await connectToIMAP(account.email, account.imap_password);
          const secFolders = folder
            ? [createDefault(folder)]
            : await getFolderList(client);
          secondaryFolders.push({ account, folders: secFolders.map(f => ({ ...f, accountEmail: account.email, imapPassword: account.imap_password })) });
        } catch (err) {
          log('error', account.email, `Failed to list folders: ${err.message}`);
        } finally {
          if (client) await closeClient(client);
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
        log('error', folderMeta.accountEmail, `Failed to sync folder ${folderMeta.displayName}: ${err.message}`);
      }
    }

    return { added, updated };
  } catch (error) {
    log('error', '', `Error syncing folder ${folder}: ${error.message}`);
    throw error;
  }
}

export async function getEmailBody(userId, emailId) {
  try {
    const result = await pool.query('SELECT body FROM email_cache WHERE id = $1 AND user_id = $2', [emailId, userId]);
    if (result.rows.length === 0) throw new Error('Email not found');
    return result.rows[0].body;
  } catch (error) {
    log('error', '', `Error getting email body: ${error.message}`);
    throw error;
  }
}

export async function autoSyncAllUsers() {
  try {
    const usersResult = await pool.query('SELECT id, email, imap_password FROM users WHERE imap_password IS NOT NULL');

    for (const user of usersResult.rows) {
      try {
        let allFolders = [];
        let client;
        try {
          client = await connectToIMAP(user.email, user.imap_password);
          allFolders = await getFolderList(client);
        } catch (err) {
          log('error', user.email, `[autoSync] Failed to list folders: ${err.message}`);
          continue;
        } finally {
          if (client) await closeClient(client);
        }

        for (const folder of allFolders) {
          try {
            await syncSingleAccountFolder(user.id, user.email, user.imap_password, folder);
          } catch (folderErr) {
            log('error', user.email, `[autoSync] Failed syncing ${folder.displayName}: ${folderErr.message}`);
          }
        }

        log('log', user.email, `Auto-sync completed`);
      } catch (error) {
        log('error', user.email, `Auto-sync failed: ${error.message}`);
      }
    }
  } catch (error) {
    log('error', '', `Auto-sync error: ${error.message}`);
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
