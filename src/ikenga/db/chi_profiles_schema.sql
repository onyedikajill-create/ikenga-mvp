-- ============================================================
-- IKENGA SELF-IMPROVEMENT SCHEMA
-- Run in Supabase SQL editor
-- ============================================================

-- Chi Profiles: per-user learned preferences
CREATE TABLE IF NOT EXISTS chi_profiles (
  email              TEXT PRIMARY KEY REFERENCES user_profiles(email) ON DELETE CASCADE,
  preferred_tone     TEXT    NOT NULL DEFAULT 'bold',
  preferred_length   TEXT    NOT NULL DEFAULT 'medium',  -- 'short' | 'medium' | 'long'
  favorite_engine    TEXT    NOT NULL DEFAULT 'IKENGA',
  thumbs_up_count    INTEGER NOT NULL DEFAULT 0,
  thumbs_down_count  INTEGER NOT NULL DEFAULT 0,
  -- Tone weight adjustments (positive = performing well, negative = underperforming)
  tone_weights       JSONB   NOT NULL DEFAULT '{}',
  -- Last 5 feedback signals for rule-based adjustment
  recent_signals     JSONB   NOT NULL DEFAULT '[]',
  learning_streak    INTEGER NOT NULL DEFAULT 0,
  last_learning_at   TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Learning insights: aggregated pattern data
CREATE TABLE IF NOT EXISTS learning_insights (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type     TEXT        NOT NULL, -- 'tone_performance' | 'template_success' | 'user_pattern' | 'global_pattern'
  engine           TEXT,
  insight_data     JSONB       NOT NULL DEFAULT '{}',
  confidence_score FLOAT       NOT NULL DEFAULT 0.0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chi_profiles_engine     ON chi_profiles (favorite_engine);
CREATE INDEX IF NOT EXISTS idx_learning_insights_type  ON learning_insights (insight_type);
CREATE INDEX IF NOT EXISTS idx_learning_insights_time  ON learning_insights (created_at DESC);

-- RLS
ALTER TABLE chi_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_insights ENABLE ROW LEVEL SECURITY;
