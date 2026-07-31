import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

const getTodayBoundary = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day} 23:59:59.999`;
};

const baseSelect = `
  SELECT id, folder, message_id, subject, from_email, from_name, to_name, to_email,
         cc, bcc, body, html_body, text_body, date, is_read, is_starred,
         is_replied, is_forwarded, has_attachments, priority, labels, size, account_email
`;

router.get('/folder/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    const userId = req.user.userId;
    const userEmail = req.user.email;
    const { limit = 100, offset = 0 } = req.query;
    const maxDateStr = getTodayBoundary();

    let where = 'WHERE user_id = $1 AND folder = $2 AND date <= $3 AND account_email = $4';
    const params = [userId, folder, maxDateStr, userEmail];

    const countResult = await pool.query(`SELECT COUNT(*) FROM email_cache ${where}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const orderLimit = `ORDER BY date DESC LIMIT $5 OFFSET $6`;
    const result = await pool.query(`${baseSelect} FROM email_cache ${where} ${orderLimit}`, [...params, parseInt(limit, 10), parseInt(offset, 10)]);

    res.json({
      emails: result.rows,
      total: result.rows.length,
      server_total: total,
      has_more: total > parseInt(offset, 10) + result.rows.length
    });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ error: 'Failed to get emails' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const maxDateStr = getTodayBoundary();

    const result = await pool.query(
      `${baseSelect} FROM email_cache WHERE id = $1 AND user_id = $2 AND date <= $3`,
      [id, userId, maxDateStr]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    await pool.query('UPDATE email_cache SET is_read = true WHERE id = $1 AND user_id = $2', [id, userId]);

    res.json({ email: result.rows[0] });
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({ error: 'Failed to get email' });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const userId = req.user.userId;

    await pool.query('UPDATE email_cache SET is_read = $1 WHERE id = $2 AND user_id = $3', [isRead, id, userId]);
    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

router.patch('/:id/star', async (req, res) => {
  try {
    const { id } = req.params;
    const { isStarred } = req.body;
    const userId = req.user.userId;

    await pool.query('UPDATE email_cache SET is_starred = $1 WHERE id = $2 AND user_id = $3', [isStarred, id, userId]);
    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

router.patch('/:id/labels', async (req, res) => {
  try {
    const { id } = req.params;
    const { labels } = req.body;
    const userId = req.user.userId;

    await pool.query('UPDATE email_cache SET labels = $1 WHERE id = $2 AND user_id = $3', [labels, id, userId]);
    res.json({ message: 'Labels updated successfully' });
  } catch (error) {
    console.error('Update labels error:', error);
    res.status(500).json({ error: 'Failed to update labels' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query('UPDATE email_cache SET folder = $1 WHERE id = $2 AND user_id = $3', ['Trash', id, userId]);
    res.json({ message: 'Email moved to trash' });
  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({ error: 'Failed to delete email' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const userId = req.user.userId;
    const userEmail = req.user.email;
    const { folder, priority, has_attachments, start_date, end_date } = req.query;
    const maxDateStr = getTodayBoundary();

    const q = `%${query.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`;
    let sql = `
      SELECT id, folder, message_id, subject, from_email, from_name, to_name, to_email,
             date, is_read, is_starred, has_attachments, priority, labels, account_email,
             ts_rank(
               to_tsvector('spanish', COALESCE(subject, '') || ' ' || COALESCE(body, '') || ' ' || COALESCE(from_email, '') || ' ' || COALESCE(to_email, '')),
               plainto_tsquery('spanish', $1)
             ) AS rank
      FROM email_cache
      WHERE user_id = $2
        AND account_email = $3
        AND date <= $4
        AND (
          subject ILIKE $1
          OR body ILIKE $1
          OR from_email ILIKE $1
          OR from_name ILIKE $1
          OR to_email ILIKE $1
          OR EXISTS (
            SELECT 1 FROM attachments a
            WHERE a.email_id = email_cache.id AND a.filename ILIKE $1
          )
        )
    `;
    const params = [q, userId, userEmail, maxDateStr];

    if (folder) {
      sql += ` AND folder = $${params.length + 1}`;
      params.push(folder);
    }
    if (priority) {
      sql += ` AND priority = $${params.length + 1}`;
      params.push(priority);
    }
    if (has_attachments === 'true') {
      sql += ` AND has_attachments = true`;
    }
    if (start_date) {
      sql += ` AND date >= $${params.length + 1}`;
      params.push(start_date);
    }
    if (end_date) {
      sql += ` AND date <= $${params.length + 1}`;
      params.push(end_date);
    }

    sql += ` ORDER BY rank DESC, date DESC LIMIT 100`;
    const result = await pool.query(sql, params);
    res.json({ emails: result.rows });
  } catch (error) {
    console.error('Search emails error:', error);
    res.status(500).json({ error: 'Failed to search emails' });
  }
});

router.post('/classify', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { folder, accountEmail } = req.body;

    let query = 'SELECT id, subject, from_email, body, priority, has_attachments FROM email_cache WHERE user_id = $1';
    const params = [userId];

    if (folder) {
      query += ' AND folder = $2';
      params.push(folder);
    }
    if (accountEmail && accountEmail !== 'all') {
      query += ` AND account_email = $${params.length + 1}`;
      params.push(accountEmail);
    }

    const result = await pool.query(query, params);
    let classified = 0;

    for (const email of result.rows) {
      const labels = [];
      const subject = (email.subject || '').toLowerCase();
      const fromEmail = (email.from_email || '').toLowerCase();
      const body = (email.body || '').toLowerCase();
      const priority = (email.priority || 'Normal').toLowerCase();

      if (priority === 'urgente' || /urgente|inmediato|resoluci[oó]n/.test(subject)) labels.push('Urgentes');
      if (priority === 'alta' || /alta|prioridad|atenci[oó]n/.test(subject)) labels.push('Alta');
      if (/gob|gov|dian|ministerio|sena|sunat|superintendencia|municipalidad|essalud/.test(fromEmail)) labels.push('Gobierno');
      if (/cliente|clientes|proyecto/.test(subject)) labels.push('Clientes');
      if (/proveedor|proveedores|factura|facturaci[oó]n|compra|orden de compra|purchase order|cotizaci[oó]n/.test(subject)) labels.push('Proveedores/Facturas');
      if (/banco|bancos|transferencia|pago|retiro|dep[oó]sito/.test(subject)) labels.push('Bancos');
      if (/adjunto|archivo|pdf|word|excel|zip|rar/.test(subject) || email.has_attachments) labels.push('Con adjuntos');
      if (/newsletter|bolet[ií]n|publicidad|promo|oferta|descuento/.test(subject) || /marketing/.test(fromEmail)) labels.push('Publicidad');
      if (/security|verify|confirmaci[oó]n|alerta|notificaci[oó]n/i.test(subject) || /security|verify/.test(fromEmail)) labels.push('Seguridad');
      if (/personal|casa|familia|vacaciones|permiso/.test(subject)) labels.push('Personal');

      if (labels.length > 0) {
        await pool.query('UPDATE email_cache SET labels = $1 WHERE id = $2', [labels, email.id]);
        classified++;
      }
    }

    res.json({ classified, total: result.rows.length });
  } catch (error) {
    console.error('Classify emails error:', error);
    res.status(500).json({ error: 'Failed to classify emails' });
  }
});

router.get('/:id/attachments', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT id, filename, mimetype, size, created_at FROM attachments WHERE email_id = $1',
      [id]
    );

    const emailResult = await pool.query(
      'SELECT user_id FROM email_cache WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (emailResult.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.json({ attachments: result.rows });
  } catch (error) {
    console.error('Get attachments error:', error);
    res.status(500).json({ error: 'Failed to get attachments' });
  }
});

router.get('/attachment/:attachmentId', async (req, res) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user.userId;

    const attachmentResult = await pool.query(
      'SELECT a.* FROM attachments a JOIN email_cache e ON a.email_id = e.id WHERE a.id = $1 AND e.user_id = $2',
      [attachmentId, userId]
    );

    if (attachmentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const attachment = attachmentResult.rows[0];
    res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(attachment.filename)}"`);
    res.set('Content-Type', attachment.mimetype || 'application/octet-stream');
    res.send(attachment.data);
  } catch (error) {
    console.error('Download attachment error:', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
});

export default router;
