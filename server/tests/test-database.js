/**
 * Test script for PostgreSQL database connection and schema
 * Run with: node server/tests/test-database.js
 */

import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: '.env' });

const { Pool } = pg;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'atento5_mail';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD;

async function testDatabaseConnection() {
  console.log('='.repeat(60));
  console.log('TEST DE CONEXIÓN POSTGRESQL');
  console.log('='.repeat(60));
  console.log(`Host: ${DB_HOST}`);
  console.log(`Port: ${DB_PORT}`);
  console.log(`Database: ${DB_NAME}`);
  console.log(`User: ${DB_USER}`);
  console.log('='.repeat(60));

  const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
  });

  try {
    console.log('\n📡 Conectando a PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Conexión exitosa');

    console.log('\n📊 Verificando schema...');
    
    // Check if tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log(`✅ Encontradas ${tablesResult.rows.length} tablas:`);
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    // Check users table
    console.log('\n👤 Verificando tabla users...');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    console.log(`✅ Tabla users: ${usersCount.rows[0].count} registros`);

    // Check email_cache table
    console.log('\n📧 Verificando tabla email_cache...');
    const emailsCount = await client.query('SELECT COUNT(*) FROM email_cache');
    console.log(`✅ Tabla email_cache: ${emailsCount.rows[0].count} registros`);

    // Check attachments table
    console.log('\n📎 Verificando tabla attachments...');
    const attachmentsCount = await client.query('SELECT COUNT(*) FROM attachments');
    console.log(`✅ Tabla attachments: ${attachmentsCount.rows[0].count} registros`);

    // Check drafts table
    console.log('\n📝 Verificando tabla drafts...');
    const draftsCount = await client.query('SELECT COUNT(*) FROM drafts');
    console.log(`✅ Tabla drafts: ${draftsCount.rows[0].count} registros`);

    // Check folder_sync table
    console.log('\n📂 Verificando tabla folder_sync...');
    const syncCount = await client.query('SELECT COUNT(*) FROM folder_sync');
    console.log(`✅ Tabla folder_sync: ${syncCount.rows[0].count} registros`);

    // Check email_accounts table
    console.log('\n🔐 Verificando tabla email_accounts...');
    const accountsCount = await client.query('SELECT COUNT(*) FROM email_accounts');
    console.log(`✅ Tabla email_accounts: ${accountsCount.rows[0].count} registros`);

    // Test insert
    console.log('\n➕ Test de inserción...');
    const insertTest = await client.query(
      `INSERT INTO users (email, password_hash, imap_password, name) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      [`test${Date.now()}@atento5.com`, 'test_hash', 'test_imap_pass', 'Test User']
    );
    if (insertTest.rows.length > 0) {
      console.log('✅ Inserción exitosa');
      console.log(`   User ID: ${insertTest.rows[0].id}`);
      
      // Clean up test user
      await client.query('DELETE FROM users WHERE id = $1', [insertTest.rows[0].id]);
      console.log('✅ Test user eliminado');
    } else {
      console.log('⚠️  Inserción omitida (posiblemente duplicado)');
    }

    console.log('\n🔒 Cerrando conexión...');
    client.release();
    await pool.end();
    console.log('✅ Conexión cerrada');

    console.log('\n' + '='.repeat(60));
    console.log('✅ TEST POSTGRESQL COMPLETADO EXITOSAMENTE');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ ERROR EN TEST POSTGRESQL:');
    console.error(`   ${error.message}`);
    console.error('\nPosibles causas:');
    console.error('   1. PostgreSQL no está ejecutándose');
    console.error('   2. Credenciales incorrectas');
    console.error('   3. Base de datos no existe');
    console.error('   4. Schema no inicializado');
    console.error('\nSoluciones:');
    console.error('   1. Inicia PostgreSQL: sudo service postgresql start');
    console.error('   2. Crea la base de datos: createdb atento5_mail');
    console.error('   3. Ejecuta el schema: node server/database/init.js');
    console.error('\n' + '='.repeat(60));
    process.exit(1);
  }
}

testDatabaseConnection();
