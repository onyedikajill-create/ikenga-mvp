-- =============================================
-- AI LEARNING & SELF-IMPROVEMENT SYSTEM
-- =============================================

-- AI Learning Log - Tracks every AI task and outcome
CREATE TABLE IF NOT EXISTS public.ai_learning_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'forensic_analysis', 'document_generation', 'timeline_analysis', 
    'contradiction_detection', 'compensation_calculation', 'content_generation'
  )),
  ai_model TEXT NOT NULL,
  ai_prediction JSONB NOT NULL,
  actual_outcome JSONB,
  user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
  user_edits_count INTEGER DEFAULT 0,
  confidence_score DECIMAL(3,2),
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  improvements_made JSONB,
  patterns_discovered JSONB,
  is_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- AI Patterns - Learned successful patterns
CREATE TABLE IF NOT EXISTS public.ai_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pattern_type TEXT NOT NULL,
  pattern_name TEXT NOT NULL,
  pattern_description TEXT,
  pattern_data JSONB NOT NULL,
  success_rate DECIMAL(5,2) DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Confidence Weights - Model performance tracking
CREATE TABLE IF NOT EXISTS public.ai_confidence_weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_type TEXT NOT NULL UNIQUE,
  base_confidence DECIMAL(3,2) DEFAULT 0.75,
  current_confidence DECIMAL(3,2) DEFAULT 0.75,
  total_predictions INTEGER DEFAULT 0,
  successful_predictions INTEGER DEFAULT 0,
  weight_adjustments JSONB DEFAULT '[]',
  last_calibrated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Alerts - For admin intervention
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'low_confidence', 'user_dispute', 'legal_risk', 'system_error', 
    'unusual_pattern', 'ai_insight', 'payment_issue', 'security_concern'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical', 'urgent')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Metrics - Real-time dashboard data
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metric_hour INTEGER DEFAULT EXTRACT(HOUR FROM NOW()),
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  cases_created INTEGER DEFAULT 0,
  documents_generated INTEGER DEFAULT 0,
  forensic_audits_run INTEGER DEFAULT 0,
  content_posts_created INTEGER DEFAULT 0,
  revenue_gbp DECIMAL(12,2) DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  avg_confidence_score DECIMAL(3,2),
  error_count INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date, metric_hour)
);

-- Admin Super Users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'support')),
  permissions JSONB DEFAULT '{}',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Case Outcomes - For learning from results
CREATE TABLE IF NOT EXISTS public.case_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL CHECK (outcome_type IN ('won', 'lost', 'settled', 'withdrawn', 'ongoing')),
  award_amount DECIMAL(12,2),
  ai_predicted_amount DECIMAL(12,2),
  prediction_accuracy DECIMAL(5,2),
  successful_strategies JSONB,
  failed_strategies JSONB,
  key_learnings TEXT[],
  employer_response_patterns JSONB,
  tribunal_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.case_outcomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outcomes_select_own" ON public.case_outcomes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "outcomes_insert_own" ON public.case_outcomes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS for admin tables (admin only access)
ALTER TABLE public.ai_learning_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_confidence_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin policies - only super admins can access
CREATE POLICY "learning_admin_only" ON public.ai_learning_log FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "patterns_admin_only" ON public.ai_patterns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "weights_admin_only" ON public.ai_confidence_weights FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "alerts_admin_only" ON public.system_alerts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "metrics_admin_only" ON public.system_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "admin_users_admin_only" ON public.admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Initialize confidence weights
INSERT INTO public.ai_confidence_weights (task_type, base_confidence, current_confidence) VALUES
  ('forensic_analysis', 0.78, 0.78),
  ('document_generation', 0.82, 0.82),
  ('timeline_analysis', 0.85, 0.85),
  ('contradiction_detection', 0.75, 0.75),
  ('compensation_calculation', 0.88, 0.88),
  ('content_generation', 0.80, 0.80)
ON CONFLICT (task_type) DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_task_type ON public.ai_learning_log(task_type);
CREATE INDEX IF NOT EXISTS idx_learning_processed ON public.ai_learning_log(is_processed);
CREATE INDEX IF NOT EXISTS idx_learning_created ON public.ai_learning_log(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON public.system_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON public.system_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_outcomes_case ON public.case_outcomes(case_id);
