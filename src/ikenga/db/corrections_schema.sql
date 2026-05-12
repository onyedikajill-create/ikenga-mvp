-- ============================================================
-- IKENGA CORRECTION ENGINE SCHEMA
-- User-suggested corrections → auto-vetting → points reward
-- ============================================================

CREATE TABLE IF NOT EXISTS correction_suggestions (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email          TEXT        NOT NULL REFERENCES user_profiles(email) ON DELETE CASCADE,
  content_id          TEXT,                    -- card ID or content item ID
  content_type        TEXT        NOT NULL DEFAULT 'library',  -- 'library' | 'generated' | 'pronunciation'
  original_text       TEXT        NOT NULL,
  suggested_text      TEXT        NOT NULL,
  reason              TEXT,
  correction_type     TEXT        NOT NULL DEFAULT 'typo',     -- 'typo'|'pronunciation'|'cultural'|'translation'|'new_content'
  status              TEXT        NOT NULL DEFAULT 'pending',  -- 'pending'|'verified'|'flagged'|'rejected'|'applied'
  verification_score  FLOAT,                   -- 0.0–1.0 from AI vetting
  rejection_reason    TEXT,
  points_awarded      INTEGER     NOT NULL DEFAULT 0,
  applied_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- Admin activity log (forensic, append-only)
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email   TEXT        NOT NULL,
  admin_role    TEXT        NOT NULL,
  action        TEXT        NOT NULL,   -- 'view'|'edit'|'delete'|'approve'|'reject'|'login'
  target_type   TEXT,                   -- 'user'|'content'|'correction'|'system'
  target_id     TEXT,
  changes       JSONB,                  -- before/after for edits
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_corrections_user    ON correction_suggestions (user_email);
CREATE INDEX IF NOT EXISTS idx_corrections_status  ON correction_suggestions (status);
CREATE INDEX IF NOT EXISTS idx_corrections_type    ON correction_suggestions (correction_type);
CREATE INDEX IF NOT EXISTS idx_admin_log_admin     ON admin_activity_log (admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_log_created   ON admin_activity_log (created_at DESC);

-- RLS
ALTER TABLE correction_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log     ENABLE ROW LEVEL SECURITY;
