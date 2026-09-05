import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const AUTHORIZED_USERS = [
  {
    email: 'Juan.ampuero@atento5.com',
    password: process.env.USER_PASSWORD_JUAN,
    imapPassword: process.env.USER_IMAP_PASSWORD_JUAN,
    name: 'Juan Ampuero',
    role: 'admin'
  },
  {
    email: 'Corina.anorga@atento5.com',
    password: process.env.USER_PASSWORD_CORINA,
    imapPassword: process.env.USER_IMAP_PASSWORD_CORINA,
    name: 'Corina Anorga',
    role: 'user'
  },
  {
    email: 'Proyectos@atento5.com',
    password: process.env.USER_PASSWORD_PROYECTOS,
    imapPassword: process.env.USER_IMAP_PASSWORD_PROYECTOS,
    name: 'Proyectos',
    role: 'user'
  },
  {
    email: 'Ventas@atento5.com',
    password: process.env.USER_PASSWORD_VENTAS,
    imapPassword: process.env.USER_IMAP_PASSWORD_VENTAS,
    name: 'Ventas',
    role: 'user'
  },
  {
    email: 'Operaciones@atento5.com',
    password: process.env.USER_PASSWORD_OPERACIONES,
    imapPassword: process.env.USER_IMAP_PASSWORD_OPERACIONES,
    name: 'Operaciones',
    role: 'user'
  }
];

async function seedUsers() {
  try {
    console.log('Starting user seed...');
    
    for (const user of AUTHORIZED_USERS) {
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(user.password, salt);

      // Insert user
      await pool.query(
        'INSERT INTO users (email, password_hash, name, imap_password, role) VALUES ($1, $2, $3, $4, $5)',
        [user.email, passwordHash, user.name, user.imapPassword, user.role]
      );

      console.log(`✓ Created user: ${user.email}`);
    }

    console.log('User seed completed successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedUsers();
