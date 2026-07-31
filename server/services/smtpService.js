import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SMTP_HOST = process.env.SMTP_HOST || 'mail.atento5.com';
const SMTP_PORT = process.env.SMTP_PORT || 465;

const SIGNATURE_IMAGE_PATH = path.join(__dirname, '../../src/assets/firmad.jpeg');
const SIGNATURE_CID = 'signatureImage';

let cachedSignatureBuffer = null;

function getSignatureBuffer() {
  if (cachedSignatureBuffer) return cachedSignatureBuffer;
  try {
    if (fs.existsSync(SIGNATURE_IMAGE_PATH)) {
      cachedSignatureBuffer = fs.readFileSync(SIGNATURE_IMAGE_PATH);
      return cachedSignatureBuffer;
    }
  } catch (err) {
    console.error('Error reading signature image:', err);
  }
  return null;
}

function createTransporter(email, password) {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: email,
      pass: password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

export async function sendEmail({ from, to, cc, bcc, subject, body, attachments, password, signature, replyTo, headers }) {
  try {
    const transporter = createTransporter(from, password);

    const processedAttachments = [];
    if (attachments && Array.isArray(attachments)) {
      for (const attachment of attachments) {
        if (attachment.content) {
          processedAttachments.push({
            filename: attachment.filename || 'attachment',
            content: Buffer.from(attachment.content, 'base64'),
            contentType: attachment.contentType || 'application/octet-stream'
          });
        } else if (attachment.path) {
          processedAttachments.push({
            filename: attachment.filename,
            path: attachment.path
          });
        } else if (attachment.buffer) {
          processedAttachments.push({
            filename: attachment.filename || 'attachment',
            content: attachment.buffer,
            contentType: attachment.contentType || 'application/octet-stream'
          });
        }
      }
    }

    const signatureBuffer = getSignatureBuffer();
    if (signatureBuffer) {
      processedAttachments.push({
        filename: signature?.filename || 'firmad.jpeg',
        content: signatureBuffer,
        cid: SIGNATURE_CID,
        contentType: 'image/jpeg',
        disposition: 'inline'
      });
    }

    const mailOptions = {
      from: replyTo || from,
      to,
      cc,
      bcc,
      subject,
      html: body,
      attachments: processedAttachments,
      headers: headers || {}
    };

    if (replyTo && replyTo !== from) {
      mailOptions.replyTo = replyTo;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      status: 'sent',
      attachmentsCount: processedAttachments.length
    };
  } catch (error) {
    console.error('SMTP send error:', error);
    
    let errorType = 'error';
    if (error.code === 'EENVELOPE') {
      errorType = 'invalid_recipient';
    } else if (error.code === 'EAUTH') {
      errorType = 'authentication_failed';
    } else if (error.responseCode === 550) {
      errorType = 'bounce';
    } else if (error.responseCode === 552) {
      errorType = 'size_exceeded';
    }

    return {
      success: false,
      error: error.message,
      errorType,
      status: 'failed'
    };
  }
}

export async function testSMTPConnection(email, password) {
  try {
    const transporter = createTransporter(email, password);
    
    await transporter.verify();
    
    return {
      success: true,
      message: 'SMTP connection successful'
    };
  } catch (error) {
    console.error('SMTP connection test failed:', error);
    throw error;
  }
}

export async function replyToEmail({ from, to, cc, bcc, subject, body, password, originalMessageId, inReplyTo, references, attachments, signature }) {
  const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
  
  return sendEmail({
    from,
    to,
    cc,
    bcc,
    subject: replySubject,
    body,
    password,
    signature,
    replyTo: from,
    headers: {
      'In-Reply-To': inReplyTo || originalMessageId,
      'References': references || originalMessageId
    },
    attachments
  });
}

export async function forwardEmail({ from, to, cc, bcc, subject, body, password, forwardHeaders, attachments, signature }) {
  const forwardSubject = subject.startsWith('Fwd:') ? subject : `Fwd: ${subject}`;
  
  return sendEmail({
    from,
    to,
    cc,
    bcc,
    subject: forwardSubject,
    body,
    password,
    signature,
    replyTo: from,
    headers: forwardHeaders || {},
    attachments
  });
}
