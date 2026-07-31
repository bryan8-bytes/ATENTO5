import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool, Client } = pg;

const AUTHORIZED_USERS = [
  {
    email: 'Juan.ampuero@atento5.com',
    password: '4B@}K?3DmgR!Nuq@',
    imapPassword: '4B@}K?3DmgR!Nuq@',
    name: 'Juan Ampuero',
    role: 'admin'
  },
  {
    email: 'Corina.anorga@atento5.com',
    password: '5VWwcTyp3iB8PY7',
    imapPassword: '5VWwcTyp3iB8PY7',
    name: 'Corina Anorga',
    role: 'user'
  },
  {
    email: 'Proyectos@atento5.com',
    password: '7ZjFHR#HtwbW53(C',
    imapPassword: '7ZjFHR#HtwbW53(C',
    name: 'Proyectos',
    role: 'user'
  },
  {
    email: 'Ventas@atento5.com',
    password: 'MV}FgL4xmGkt4cav',
    imapPassword: 'MV}FgL4xmGkt4cav',
    name: 'Ventas',
    role: 'user'
  },
  {
    email: 'Operaciones@atento5.com',
    password: 'rHxl.dgL&!tNgSeT',
    imapPassword: 'rHxl.dgL&!tNgSeT',
    name: 'Operaciones',
    role: 'user'
  }
];

export async function verifyAndMigrate() {
  const dbName = process.env.DB_NAME || 'atento5_mail';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || 'postgres';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432', 10);

  console.log(`🔄 [DB] Verifying PostgreSQL connection to ${dbHost}:${dbPort}...`);

  // 1. Try to connect to the postgres database to check credentials
  const defaultClient = new Client({
    host: dbHost,
    port: dbPort,
    database: 'postgres',
    user: dbUser,
    password: dbPassword,
    connectionTimeoutMillis: 5000,
  });

  try {
    await defaultClient.connect();
    console.log('✅ [DB] Successfully connected to PostgreSQL server');
  } catch (error) {
    console.error('❌ [DB] Connection to PostgreSQL server failed!');
    if (error.code === '28P01') {
      console.error(`👉 Error 28P01: Password authentication failed for user "${dbUser}". Please check that DB_PASSWORD is correct in your .env file (current value is "${dbPassword}").`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`👉 Error ECONNREFUSED: Could not connect to PostgreSQL on ${dbHost}:${dbPort}. Please ensure PostgreSQL is running.`);
    } else {
      console.error(`👉 Database error detail:`, error.message);
    }
    throw error;
  }

  // 2. Check if the target database exists
  let dbExists = false;
  try {
    const res = await defaultClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    dbExists = res.rows.length > 0;
  } catch (err) {
    console.error('❌ [DB] Failed to query existing databases:', err.message);
    await defaultClient.end();
    throw err;
  }

  // 3. Create target database if it doesn't exist
  if (!dbExists) {
    console.log(`🔄 [DB] Database "${dbName}" does not exist. Creating it...`);
    try {
      await defaultClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ [DB] Created database "${dbName}"`);
    } catch (err) {
      console.error(`❌ [DB] Failed to create database "${dbName}":`, err.message);
      await defaultClient.end();
      throw err;
    }
  } else {
    console.log(`✅ [DB] Database "${dbName}" already exists`);
  }

  // Close connection to default db
  await defaultClient.end();

  // 4. Connect to target database and execute migrations
  console.log(`🔄 [DB] Applying migrations/schema to "${dbName}"...`);
  const targetPool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await targetPool.query(schemaSql);
    console.log('✅ [DB] Schema and migration tables successfully verified/created');

    // 5. Automatically seed users if table is empty
    const usersCountRes = await targetPool.query('SELECT COUNT(*) FROM users');
    const usersCount = parseInt(usersCountRes.rows[0].count, 10);

    if (usersCount === 0) {
      console.log('🔄 [DB] Users table is empty. Seeding default authorized users...');
      for (const user of AUTHORIZED_USERS) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(user.password, salt);

        await targetPool.query(
          'INSERT INTO users (email, password_hash, name, imap_password, role) VALUES ($1, $2, $3, $4, $5)',
          [user.email, passwordHash, user.name, user.imapPassword, user.role]
        );
        console.log(`  ✓ Seeded user: ${user.email}`);
      }
      console.log('✅ [DB] Default authorized users successfully seeded');
    } else {
      console.log(`✅ [DB] Users table already has ${usersCount} users. Seeding skipped.`);
    }

    // 6. Run migrations for multi-account support on existing databases
    console.log('🔄 [DB] Running column migrations for multi-account...');
    await targetPool.query('ALTER TABLE email_cache ADD COLUMN IF NOT EXISTS account_email VARCHAR(255)');
    console.log('✅ [DB] Verified/added column "account_email" in table "email_cache"');

    // Make email_account column nullable to prevent NOT NULL violations (since it was renamed to account_email)
    console.log('🔄 [DB] Checking/making column "email_account" nullable...');
    await targetPool.query('ALTER TABLE email_cache ALTER COLUMN email_account DROP NOT NULL');
    console.log('✅ [DB] Column "email_account" is now nullable');

    // Run migrations for UID support on email_cache table
    console.log('🔄 [DB] Running column migrations for IMAP UID support...');
    await targetPool.query('ALTER TABLE email_cache ADD COLUMN IF NOT EXISTS uid INTEGER');
    await targetPool.query('CREATE INDEX IF NOT EXISTS idx_email_cache_uid ON email_cache(uid)');
    console.log('✅ [DB] Verified/added column "uid" and index "idx_email_cache_uid" in table "email_cache"');

    // Run extended email schema migration
    console.log('🔄 [DB] Running extended email schema migration...');
    const extendedSchemaPath = path.join(__dirname, 'migrations', '002_email_extended_schema.sql');
    if (fs.existsSync(extendedSchemaPath)) {
      const extendedSchemaSql = fs.readFileSync(extendedSchemaPath, 'utf8');
      await targetPool.query(extendedSchemaSql);
      console.log('✅ [DB] Extended email schema migration applied');
    } else {
      console.log('⚠️ [DB] Extended email schema migration file not found, skipping');
    }

    // 7. Seed email_accounts for user Juan.ampuero@atento5.com
    const juanRes = await targetPool.query("SELECT id FROM users WHERE email = 'Juan.ampuero@atento5.com'");
    if (juanRes.rows.length > 0) {
      const juanId = juanRes.rows[0].id;
      console.log(`🔄 [DB] Seeding email_accounts for user ${juanId} (Juan)...`);
      for (const account of AUTHORIZED_USERS) {
        await targetPool.query(
          `INSERT INTO email_accounts (user_id, email, imap_password, is_primary)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO NOTHING`,
          [juanId, account.email, account.imapPassword, account.email === 'Juan.ampuero@atento5.com']
        );
      }
      console.log('✅ [DB] email_accounts successfully seeded');
    }

  } catch (error) {
    console.error('❌ [DB] Migration or seeding failed:', error.message);
    throw error;
  } finally {
    await targetPool.end();
  }

  console.log('🎉 [DB] Database is fully synchronized and ready for Express backend!');
}

// Support running directly from CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyAndMigrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
