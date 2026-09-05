import express from 'express';
import { sendEmail } from '../services/smtpService.js';
import pool from '../config/database.js';

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { from, to, cc, bcc, subject, body, attachments, signature, replyTo, replyToMessageId, forwardHeaders, _inReplyTo, references } = req.body;
    const userId = req.user.userId;

    if (!to || !subject || !body) {
      return res.status(400).json({ 
        error: 'To, subject, and body are required' 
      });
    }

    let activeFrom = from;
    let activePassword;

    if (activeFrom) {
      const primaryRes = await pool.query(
        'SELECT email, imap_password FROM users WHERE id = $1 AND email = $2',
        [userId, activeFrom]
      );
      
      if (primaryRes.rows.length > 0) {
        activePassword = primaryRes.rows[0].imap_password;
      } else {
        const secondaryRes = await pool.query(
          'SELECT email, imap_password FROM email_accounts WHERE user_id = $1 AND email = $2',
          [userId, activeFrom]
        );
        if (secondaryRes.rows.length > 0) {
          activePassword = secondaryRes.rows[0].imap_password;
        } else {
          return res.status(400).json({ error: `No tienes permisos para enviar desde ${activeFrom}` });
        }
      }
    } else {
      const userResult = await pool.query(
        'SELECT email, imap_password FROM users WHERE id = $1',
        [userId]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      activeFrom = userResult.rows[0].email;
      activePassword = userResult.rows[0].imap_password;
    }

    const extraHeaders = {};
    if (replyToMessageId) {
      extraHeaders['In-Reply-To'] = replyToMessageId;
      extraHeaders['References'] = references || replyToMessageId;
    }

    if (forwardHeaders && Array.isArray(forwardHeaders)) {
      forwardHeaders.forEach(h => {
        if (h.key && h.value) {
          extraHeaders[h.key] = h.value;
        }
      });
    }

    const result = await sendEmail({
      from: activeFrom,
      to,
      cc,
      bcc,
      subject,
      body,
      attachments,
      password: activePassword,
      signature,
      replyTo,
      headers: Object.keys(extraHeaders).length > 0 ? extraHeaders : undefined
    });

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: result.error,
        errorType: result.errorType
      });
    }

    const insertResult = await pool.query(
      `INSERT INTO email_cache 
       (user_id, account_email, folder, message_id, subject, from_email, from_name, to_email, cc, bcc, body, date, is_read, has_attachments, size)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), true, $12, $13)
       RETURNING id`,
      [
        userId, 
        activeFrom,
        'Sent', 
        result.messageId, 
        subject, 
        activeFrom, 
        activeFrom, 
        to, 
        cc || null, 
        bcc || null, 
        body,
        result.attachmentsCount > 0,
        result.attachmentsCount > 0 ? JSON.stringify(attachments || []).length : 0
      ]
    );

    if (typeof global !== 'undefined' && global.notifyUser) {
      global.notifyUser(userId, {
        type: 'new_email',
        email: {
          id: insertResult.rows[0]?.id || null,
          message_id: result.messageId,
          subject,
          from_email: activeFrom,
          from_name: activeFrom,
          to_email: to,
          to_name: to,
          folder: 'Sent',
          date: new Date(),
          account_email: activeFrom,
          has_attachments: result.attachmentsCount > 0,
          priority: 'Normal',
          size: result.attachmentsCount > 0 ? JSON.stringify(attachments || []).length : 0
        }
      });
    }

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      const emailResult = await pool.query(
        `SELECT id FROM email_cache WHERE message_id = $1 AND user_id = $2 AND folder = 'Sent'`,
        [result.messageId, userId]
      );

      if (emailResult.rows.length > 0) {
        const emailCacheId = emailResult.rows[0].id;
        for (const attachment of attachments) {
          await pool.query(
            `INSERT INTO attachments (email_id, filename, mimetype, size, data)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              emailCacheId,
              attachment.filename,
              attachment.contentType || 'application/octet-stream',
              attachment.size || 0,
              attachment.content ? Buffer.from(attachment.content, 'base64') : null
            ]
          );
        }
      }
    }

    res.json({ 
      message: 'Email sent successfully',
      messageId: result.messageId,
      status: result.status,
      attachmentsCount: result.attachmentsCount,
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

router.post('/draft', async (req, res) => {
  try {
    const { to, cc, bcc, subject, body, _from, replyToMessageId, inReplyTo, references, folder = 'Drafts', attachments } = req.body;
    const userId = req.user.userId;

    const draftBody = body || '';
    const draftSubject = subject || '';
    const draftFolder = folder || 'Drafts';

    const result = await pool.query(
      `INSERT INTO drafts 
       (user_id, to_email, cc, bcc, subject, body, created_at, folder, reply_to_message_id, in_reply_to, references)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10)
       RETURNING id`,
      [userId, to, cc, bcc, draftSubject, draftBody, draftFolder, replyToMessageId || null, inReplyTo || null, references || null]
    );

    const draftId = result.rows[0].id;

    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      for (const attachment of attachments) {
        await pool.query(
          `INSERT INTO attachments (email_id, filename, mimetype, size, data)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            draftId,
            attachment.filename,
            attachment.contentType || 'application/octet-stream',
            attachment.size || 0,
            attachment.content ? Buffer.from(attachment.content, 'base64') : null
          ]
        );
      }
    }

    res.json({ 
      message: 'Draft saved successfully',
      draftId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ error: 'Failed to save draft' });
  }
});

router.get('/drafts', async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      'SELECT * FROM drafts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const draftsWithAttachments = await Promise.all(
      result.rows.map(async (draft) => {
        const attResult = await pool.query(
          'SELECT id, filename, mimetype, size, created_at FROM attachments WHERE email_id = $1',
          [draft.id]
        );
        return { ...draft, attachments: attResult.rows };
      })
    );

    res.json({ drafts: draftsWithAttachments });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({ error: 'Failed to get drafts' });
  }
});

router.put('/draft/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { to, cc, bcc, subject, body, replyToMessageId, inReplyTo, references } = req.body;
    const userId = req.user.userId;

    const result = await pool.query(
      `UPDATE drafts SET 
       to_email = $1, cc = $2, bcc = $3, subject = $4, body = $5, 
       reply_to_message_id = $6, in_reply_to = $7, references = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [to, cc, bcc, subject, body, replyToMessageId || null, inReplyTo || null, references || null, id, userId]
    );

    res.json({ 
      message: 'Draft updated successfully',
      draft: result.rows[0] 
    });
  } catch (error) {
    console.error('Update draft error:', error);
    res.status(500).json({ error: 'Failed to update draft' });
  }
});

router.delete('/draft/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await pool.query(
      'DELETE FROM attachments WHERE email_id = $1',
      [id]
    );

    await pool.query(
      'DELETE FROM drafts WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Delete draft error:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});

router.post('/reply/:messageId', async (req, res) => {
  res.status(501).json({ error: 'Endpoint not yet implemented' });
});

router.post('/forward/:messageId', async (req, res) => {
  res.status(501).json({ error: 'Endpoint not yet implemented' });
});

export default router;
