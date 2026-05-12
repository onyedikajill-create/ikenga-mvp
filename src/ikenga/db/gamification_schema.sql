-- ============================================================
-- IKENGA GAMIFICATION SCHEMA
-- Chi Ranks, Points Ledger, Badges, Refund Requests
--
-- CHI RANKS (Corrected — per Dr. Remy Ilona's Igbo heritage):
--   Nwa          → Child         (0–99 pts)
--   Odibo        → Apprentice    (100–499 pts)
--   Okenye       → Elder         (500–1,499 pts)
--   Dibia        → Wise One      (1,500–4,999 pts)
--   Di nke Content → Master      (5,000+ pts)
--
-- NOTE: "Eze" is NOT used for rank. Eze = Priest (not King).
-- This platform does not perpetuate colonial misinformation about Igbo culture.
-- ============================================================

-- Points ledger — append-only audit trail
CREATE TABLE IF NOT EXISTS user_points (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL REFERENCES user_profiles(email) ON DELETE CASCADE,
  event      TEXT        NOT NULL,   -- 'signup' | 'generation' | 'referral' | 'streak_7' | etc.
  points     INTEGER     NOT NULL,
  metadata   JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Aggregated totals (denormalised for fast reads)
CREATE TABLE IF NOT EXISTS user_point_totals (
  email          TEXT    PRIMARY KEY REFERENCES user_profiles(email) ON DELETE CASCADE,
  total_points   INTEGER NOT NULL DEFAULT 0,
  chi_rank       TEXT    NOT NULL DEFAULT 'Nwa',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Badges
CREATE TABLE IF NOT EXISTS user_badges (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL REFERENCES user_profiles(email) ON DELETE CASCADE,
  badge_id   TEXT        NOT NULL,   -- 'first_generation' | 'streak_7' | etc.
  badge_name TEXT        NOT NULL,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, badge_id)
);

-- Refund requests
CREATE TABLE IF NOT EXISTS refund_requests (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT        NOT NULL REFERENCES user_profiles(email) ON DELETE CASCADE,
  payment_ref         TEXT,        -- links to payment_requests.unique_ref
  reason              TEXT        NOT NULL,
  status              TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  auto_decision       BOOLEAN     NOT NULL DEFAULT FALSE,
  rejection_reason    TEXT,
  forensic_snapshot   JSONB       NOT NULL DEFAULT '{}',  -- activity at time of request
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_points_email      ON user_points (email);
CREATE INDEX IF NOT EXISTS idx_user_points_event      ON user_points (event);
CREATE INDEX IF NOT EXISTS idx_user_badges_email      ON user_badges (email);
CREATE INDEX IF NOT EXISTS idx_user_point_totals_rank ON user_point_totals (chi_rank);
CREATE INDEX IF NOT EXISTS idx_user_point_totals_pts  ON user_point_totals (total_points DESC);
CREATE INDEX IF NOT EXISTS idx_refund_requests_email  ON refund_requests (email);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests (status);

-- RLS
ALTER TABLE user_points        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_point_totals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_requests    ENABLE ROW LEVEL SECURITY;
