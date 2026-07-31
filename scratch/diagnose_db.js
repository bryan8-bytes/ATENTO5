import pool from './server/config/database.js';

async function diagnose() {
  try {
    const res = await pool.query(
      "SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'email_cache'"
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

diagnose();
