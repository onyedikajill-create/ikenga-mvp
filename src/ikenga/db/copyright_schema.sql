-- ============================================================
-- IKENGA COPYRIGHT PROTECTION SCHEMA
-- Run in Supabase SQL editor
-- ============================================================

CREATE TABLE IF NOT EXISTS copyright_flags (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id          TEXT,                          -- references content_items.id or description
  content_type        TEXT NOT NULL DEFAULT 'generated', -- 'generated' | 'uploaded' | 'user_profile'
  reporter_email      TEXT NOT NULL,
  reporter_name       TEXT,
  description         TEXT NOT NULL,
  ownership_proof_url TEXT,
  sworn               BOOLEAN NOT NULL DEFAULT FALSE, -- "I swear under penalty of perjury"
  status              TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'reviewing' | 'resolved' | 'rejected'
  resolution_notes    TEXT,
  flagged_by_admin    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- RLS: only admins (via service role key) can read flags.
-- Reporters can only insert.
ALTER TABLE copyright_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_copyright_flag"
  ON copyright_flags FOR INSERT
  WITH CHECK (true);

-- Index for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_copyright_flags_status     ON copyright_flags (status);
CREATE INDEX IF NOT EXISTS idx_copyright_flags_created_at ON copyright_flags (created_at DESC);
