-- UJRIS + IKENGA AI Database Schema
-- This script creates all tables for the unified justice intelligence platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USER PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro_monthly', 'pro_annual')),
  subscription_expires_at TIMESTAMPTZ,
  total_cases_allowed INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- CASES (Employment Tribunal Cases)
-- =============================================
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_number TEXT,
  case_name TEXT NOT NULL,
  case_type TEXT NOT NULL CHECK (case_type IN ('unfair_dismissal', 'discrimination', 'whistleblowing', 'breach_of_contract', 'redundancy', 'other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'submitted', 'hearing_scheduled', 'won', 'lost', 'settled', 'withdrawn')),
  employer_name TEXT NOT NULL,
  employer_solicitor TEXT,
  employment_start_date DATE,
  employment_end_date DATE,
  dismissal_date DATE,
  annual_salary DECIMAL(12,2),
  weekly_hours DECIMAL(5,2),
  claim_amount DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cases_select_own" ON public.cases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "cases_insert_own" ON public.cases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cases_update_own" ON public.cases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "cases_delete_own" ON public.cases FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- EVIDENCE VAULT
-- =============================================
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('contract', 'email', 'letter', 'policy', 'payslip', 'medical', 'witness_statement', 'et3_response', 'photo', 'recording', 'other')),
  description TEXT,
  date_of_document DATE,
  is_favorable BOOLEAN,
  extracted_text TEXT,
  ai_summary TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "evidence_select_own" ON public.evidence FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "evidence_insert_own" ON public.evidence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "evidence_update_own" ON public.evidence FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "evidence_delete_own" ON public.evidence FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TIMELINE EVENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('employment_start', 'incident', 'grievance', 'meeting', 'disciplinary', 'dismissal', 'appeal', 'acas', 'et1_submission', 'et3_response', 'hearing', 'other')),
  evidence_ids UUID[] DEFAULT '{}',
  is_gap_detected BOOLEAN DEFAULT FALSE,
  gap_days INTEGER,
  ai_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline_select_own" ON public.timeline_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "timeline_insert_own" ON public.timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "timeline_update_own" ON public.timeline_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "timeline_delete_own" ON public.timeline_events FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FORENSIC AUDITS (ET3 Analysis)
-- =============================================
CREATE TABLE IF NOT EXISTS public.forensic_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audit_type TEXT NOT NULL CHECK (audit_type IN ('et3_analysis', 'timeline_gaps', 'evidence_summary', 'full_case_audit')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  input_data JSONB NOT NULL,
  ai_findings JSONB,
  anchor_lies TEXT[],
  contradictions TEXT[],
  timeline_gaps TEXT[],
  recommendations TEXT[],
  confidence_score DECIMAL(3,2),
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.forensic_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audits_select_own" ON public.forensic_audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "audits_insert_own" ON public.forensic_audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "audits_update_own" ON public.forensic_audits FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- GENERATED DOCUMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('grievance_letter', 'sar_request', 'et1_draft', 'witness_statement', 'without_prejudice', 'appeal_letter', 'chronology', 'skeleton_argument')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template_used TEXT,
  variables_used JSONB,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents_select_own" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON public.documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "documents_delete_own" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- COMPENSATION CALCULATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.compensation_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_date DATE DEFAULT CURRENT_DATE,
  
  -- Basic Award
  age_at_dismissal INTEGER,
  years_of_service DECIMAL(4,1),
  weekly_pay DECIMAL(10,2),
  weekly_pay_cap DECIMAL(10,2) DEFAULT 700.00,
  basic_award DECIMAL(12,2),
  
  -- Compensatory Award
  loss_of_earnings DECIMAL(12,2),
  future_loss_weeks INTEGER,
  loss_of_statutory_rights DECIMAL(10,2) DEFAULT 500.00,
  loss_of_pension DECIMAL(12,2),
  expenses DECIMAL(12,2),
  compensatory_award DECIMAL(12,2),
  compensatory_cap DECIMAL(12,2) DEFAULT 115461.00,
  
  -- Injury to Feelings (Vento Bands 2025/26)
  injury_to_feelings_band TEXT CHECK (injury_to_feelings_band IN ('lower', 'middle', 'upper', 'exceptional')),
  injury_to_feelings_amount DECIMAL(12,2),
  
  -- Adjustments
  uplift_percentage DECIMAL(5,2),
  reduction_percentage DECIMAL(5,2),
  polkey_reduction DECIMAL(5,2),
  
  -- Totals
  total_award DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.compensation_calculations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "calc_select_own" ON public.compensation_calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "calc_insert_own" ON public.compensation_calculations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "calc_update_own" ON public.compensation_calculations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "calc_delete_own" ON public.compensation_calculations FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- IKENGA: SOCIAL ACCOUNTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'linkedin', 'facebook', 'instagram')),
  account_name TEXT NOT NULL,
  account_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_select_own" ON public.social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "social_insert_own" ON public.social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "social_update_own" ON public.social_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "social_delete_own" ON public.social_accounts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- IKENGA: CONTENT POSTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.content_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'carousel', 'thread')),
  platforms TEXT[] NOT NULL,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_prompt TEXT,
  media_urls TEXT[],
  hashtags TEXT[],
  engagement_data JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_select_own" ON public.content_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "posts_insert_own" ON public.content_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own" ON public.content_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete_own" ON public.content_posts FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- IKENGA: BRAND VOICES
-- =============================================
CREATE TABLE IF NOT EXISTS public.brand_voices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tone TEXT NOT NULL,
  style_guidelines TEXT,
  sample_content TEXT[],
  keywords TEXT[],
  avoid_words TEXT[],
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.brand_voices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "voices_select_own" ON public.brand_voices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "voices_insert_own" ON public.brand_voices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "voices_update_own" ON public.brand_voices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "voices_delete_own" ON public.brand_voices FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- PAYMENTS & SUBSCRIPTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('subscription', 'one_time_forensic', 'one_time_documents')),
  payment_method TEXT CHECK (payment_method IN ('bank_transfer', 'stripe')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  reference TEXT,
  stripe_payment_intent_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- ACTIVITY LOG (Audit Trail)
-- =============================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "log_select_own" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "log_insert_own" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER: Update timestamps
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_evidence_updated_at BEFORE UPDATE ON public.evidence FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_timeline_updated_at BEFORE UPDATE ON public.timeline_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_calculations_updated_at BEFORE UPDATE ON public.compensation_calculations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_social_updated_at BEFORE UPDATE ON public.social_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.content_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_voices_updated_at BEFORE UPDATE ON public.brand_voices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON public.evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_category ON public.evidence(category);
CREATE INDEX IF NOT EXISTS idx_timeline_case_id ON public.timeline_events(case_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_date ON public.timeline_events(event_date);
CREATE INDEX IF NOT EXISTS idx_audits_case_id ON public.forensic_audits(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.content_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.content_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON public.content_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_case_id ON public.activity_log(case_id);
