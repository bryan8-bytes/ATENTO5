import pg from 'pg';
import dotenv from 'dotenv';
import { ImapFlow } from 'imapflow';

dotenv.config();

const { Client } = pg;

async function testIMAPConnection() {
  const pgClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'atento5_mail',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  });

  try {
    await pgClient.connect();
    
    // Get all users with imap_password set
    const res = await pgClient.query('SELECT id, email, name, imap_password FROM users');
    
    if (res.rows.length === 0) {
      console.log('No users found in database.');
      await pgClient.end();
      return;
    }

    console.log(`Found ${res.rows.length} users in the database.`);
    
    for (const user of res.rows) {
      console.log(`\n----------------------------------------`);
      console.log(`Testing IMAP for: ${user.name} (${user.email})`);
      console.log(`IMAP Password length: ${user.imap_password ? user.imap_password.length : 0}`);
      
      if (!user.imap_password) {
        console.log(`⚠️ No IMAP password set for this user. Skipping connection test.`);
        continue;
      }

      console.log(`Connecting to IMAP host: ${process.env.IMAP_HOST || 'mail.atento5.com'}:${process.env.IMAP_PORT || 993}`);
      
      const client = new ImapFlow({
        host: process.env.IMAP_HOST || 'mail.atento5.com',
        port: parseInt(process.env.IMAP_PORT || '993', 10),
        secure: true,
        auth: {
          user: user.email,
          pass: user.imap_password
        },
        logger: false,
        // Bypass certificate errors if there is a self-signed cert on the corporate mail server
        tls: {
          rejectUnauthorized: false
        }
      });

      try {
        await client.connect();
        console.log(`✅ SUCCESS! Successfully connected and authenticated with IMAP server for ${user.email}!`);
        
        // Let's open INBOX and count
        const mailbox = await client.mailboxOpen('INBOX');
        console.log(`📬 INBOX open! Total messages in INBOX: ${mailbox.exists}`);
        
        await client.logout();
      } catch (err) {
        console.error(`❌ IMAP Connection Failed for ${user.email}:`, err.message);
        console.error(`Error details:`, err);
      }
    }

    await pgClient.end();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
}

testIMAPConnection();
