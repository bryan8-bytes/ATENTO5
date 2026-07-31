import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function test() {
  try {
    console.log('Logging in as Proyectos@atento5.com...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'Proyectos@atento5.com',
        password: '7ZjFHR#HtwbW53(C'
      })
    });

    if (!loginRes.ok) {
      console.error('Login failed:', await loginRes.text());
      return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful! Token acquired.');

    // Fetch emails for INBOX
    console.log('Fetching INBOX emails...');
    const emailsRes = await fetch(`${API_URL}/email/folder/INBOX?limit=9999&account=Proyectos@atento5.com`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!emailsRes.ok) {
      console.error('Fetch emails failed:', await emailsRes.text());
      return;
    }

    const emailsData = await emailsRes.json();
    console.log(`Fetched ${emailsData.emails?.length} emails.`);
    if (emailsData.emails && emailsData.emails.length > 0) {
      console.log('Sample email:', emailsData.emails[0]);
    }

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
