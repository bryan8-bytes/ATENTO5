import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'atento5_mail',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function check() {
  try {
    const res = await pool.query('SELECT MIN(date) as min_date, MAX(date) as max_date, COUNT(*) FROM email_cache');
    console.log('Overall Date Range:', res.rows[0]);

    const resFuture = await pool.query('SELECT COUNT(*), user_id FROM email_cache WHERE date > NOW() GROUP BY user_id');
    console.log('Future emails count by user_id:', resFuture.rows);

    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
