-- Migration: 002_email_extended_schema.sql
-- Description: Extend email system schema for professional IMAP client
-- Date: 2026-07-23

BEGIN;

-- Extend email_cache with full message metadata
ALTER TABLE IF EXISTS email_cache
  ADD COLUMN IF NOT EXISTS html_body TEXT,
  ADD COLUMN IF NOT EXISTS text_body TEXT,
  ADD COLUMN IF NOT EXISTS to_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Normal',
  ADD COLUMN IF NOT EXISTS labels TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_replied BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_forwarded BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS size INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_email VARCHAR(255) NOT NULL DEFAULT '';

-- Ensure email_cache.account_email is not null after backfill
UPDATE email_cache SET account_email = '' WHERE account_email IS NULL;

-- Labels table
CREATE TABLE IF NOT EXISTS email_labels (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_id INTEGER NOT NULL REFERENCES email_cache(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT 'blue',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, email_id, name)
);

-- Extend folder_sync with IMAP sync markers
ALTER TABLE IF EXISTS folder_sync
  ADD COLUMN IF NOT EXISTS imap_uidvalidity VARCHAR(255),
  ADD COLUMN IF NOT EXISTS imap_uidnext INTEGER;

-- Indexes for extended schema
CREATE INDEX IF NOT EXISTS idx_email_cache_to_email ON email_cache(to_email);
CREATE INDEX IF NOT EXISTS idx_email_cache_subject ON email_cache(subject);
CREATE INDEX IF NOT EXISTS idx_email_cache_priority ON email_cache(priority);
CREATE INDEX IF NOT EXISTS idx_email_accounts_email ON email_accounts(email);
CREATE INDEX IF NOT EXISTS idx_email_labels_email_id ON email_labels(email_id);

-- Full-text search index for subject, body, addresses
CREATE INDEX IF NOT EXISTS idx_email_cache_fts ON email_cache USING GIN (
  to_tsvector('spanish', COALESCE(subject, '') || ' ' || COALESCE(body, '') || ' ' || COALESCE(from_email, '') || ' ' || COALESCE(to_email, ''))
);

COMMIT;
