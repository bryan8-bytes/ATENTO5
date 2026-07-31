import pool from '../../config/database.js';

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando migración: Agregar campo role a users...');
    
    // Check if role column exists
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'role'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add role column
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN role VARCHAR(50) DEFAULT 'user'
      `);
      console.log('✓ Campo role agregado a la tabla users');
    } else {
      console.log('✓ Campo role ya existe en la tabla users');
    }
    
    // Update existing users to have appropriate roles
    const updateResult = await client.query(`
      UPDATE users 
      SET role = 'admin' 
      WHERE email LIKE '%@atento5.com' 
      AND email IN (
        'Juan.ampuero@atento5.com',
        'admin@atento5.com'
      )
      RETURNING email, role
    `);
    
    if (updateResult.rows.length > 0) {
      console.log('✓ Usuarios actualizados a rol admin:');
      updateResult.rows.forEach(row => {
        console.log(`  - ${row.email} -> ${row.role}`);
      });
    } else {
      console.log('✓ No se encontraron usuarios para actualizar a admin');
    }
    
    // Create index on role
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
    `);
    console.log('✓ Índice idx_users_role creado o ya existe');
    
    console.log('\n✅ Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
