-- Migration: Add role field to users table
-- Run this to update existing databases

-- Add role column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
    END IF;
END $$;

-- Update existing users to have appropriate roles based on email
UPDATE users SET role = 'admin' WHERE email LIKE '%@atento5.com' AND email IN (
    'Juan.ampuero@atento5.com',
    'admin@atento5.com'
);

-- Create index on role for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Migration complete
