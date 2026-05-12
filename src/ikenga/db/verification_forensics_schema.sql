-- ============================================================
-- EMAIL VERIFICATION + USER FORENSICS SCHEMA
-- Run this in Supabase SQL editor.
-- ============================================================

-- Email OTPs — one row per email, refreshed on each send.
CREATE TABLE IF NOT EXISTS email_verifications (
  email        TEXT PRIMARY KEY,
  otp          TEXT NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  attempts     INT NOT NULL DEFAULT 0,
  verified_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User forensics — IP history, ban status, warning trail.
CREATE TABLE IF NOT EXISTS user_forensics (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT NOT NULL UNIQUE,
  ip_addresses       TEXT[] NOT NULL DEFAULT '{}',
  topic_fingerprint  TEXT,             -- SHA-256 of first brand+goals
  warning_count      INT NOT NULL DEFAULT 0,
  warning_issued_at  TIMESTAMPTZ,
  banned_at          TIMESTAMPTZ,
  ban_reason         TEXT,
  forensic_evidence  JSONB NOT NULL DEFAULT '{}',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_forensics_email_idx ON user_forensics(email);

-- RLS: service role only (no client-side access).
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_forensics      ENABLE ROW LEVEL SECURITY;
