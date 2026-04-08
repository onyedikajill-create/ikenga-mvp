-- UJRIS + IKENGA AI: Refund Guarantee System
-- The Truth Engine - Mathematical proof of value delivered

-- Case Quality Metrics (AI Self-Assessment)
CREATE TABLE IF NOT EXISTS case_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- INPUT METRICS
  documents_uploaded INT DEFAULT 0,
  total_pages INT DEFAULT 0,
  document_types TEXT[] DEFAULT '{}',
  
  -- AI PROCESSING METRICS
  processing_confidence INT DEFAULT 0 CHECK (processing_confidence BETWEEN 0 AND 100),
  contradictions_found INT DEFAULT 0,
  gaps_detected INT DEFAULT 0,
  timeline_completeness INT DEFAULT 0 CHECK (timeline_completeness BETWEEN 0 AND 100),
  
  -- OUTPUT METRICS
  documents_generated TEXT[] DEFAULT '{}',
  estimated_compensation_low DECIMAL(10,2) DEFAULT 0,
  estimated_compensation_likely DECIMAL(10,2) DEFAULT 0,
  estimated_compensation_high DECIMAL(10,2) DEFAULT 0,
  
  -- QUALITY SCORES (AI self-assesses)
  timeline_quality INT DEFAULT 0 CHECK (timeline_quality BETWEEN 0 AND 100),
  letter_quality INT DEFAULT 0 CHECK (letter_quality BETWEEN 0 AND 100),
  legal_accuracy INT DEFAULT 0 CHECK (legal_accuracy BETWEEN 0 AND 100),
  overall_value_score INT DEFAULT 0 CHECK (overall_value_score BETWEEN 0 AND 100),
  
  -- TIMESTAMPS
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Truth Chain (Cryptographic Verification)
CREATE TABLE IF NOT EXISTS case_truth_chain (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  processing_hash TEXT UNIQUE NOT NULL,
  previous_hash TEXT,
  metadata JSONB NOT NULL,
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refund Guarantee Records
CREATE TABLE IF NOT EXISTS refund_guarantees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Metrics at time of refund request
  value_score INT NOT NULL CHECK (value_score BETWEEN 0 AND 100),
  timeline_score INT NOT NULL CHECK (timeline_score BETWEEN 0 AND 100),
  quality_score INT NOT NULL CHECK (quality_score BETWEEN 0 AND 100),
  legal_accuracy_score INT NOT NULL CHECK (legal_accuracy_score BETWEEN 0 AND 100),
  
  -- Refund decision
  refund_triggered BOOLEAN DEFAULT false,
  refund_reason TEXT,
  refund_amount DECIMAL(10,2),
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'processed', 'denied')),
  processed_at TIMESTAMPTZ,
  stripe_refund_id TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dispute History (for learning)
CREATE TABLE IF NOT EXISTS dispute_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  refund_id UUID REFERENCES refund_guarantees(id),
  
  -- Dispute details
  dispute_type TEXT NOT NULL CHECK (dispute_type IN (
    'low_value', 'incomplete_timeline', 'inaccurate_analysis',
    'missing_contradictions', 'unusable_documents', 'system_error', 'user_dissatisfied'
  )),
  user_feedback TEXT,
  
  -- Resolution
  resolution TEXT CHECK (resolution IN ('auto_refunded', 'manual_review', 'denied', 'partial_refund')),
  resolution_notes TEXT,
  
  -- AI Learning
  learning_extracted BOOLEAN DEFAULT false,
  improvement_applied TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Refund Thresholds Configuration
CREATE TABLE IF NOT EXISTS refund_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT UNIQUE NOT NULL,
  threshold_value INT NOT NULL,
  refund_percentage INT DEFAULT 100,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default thresholds
INSERT INTO refund_thresholds (metric_name, threshold_value, refund_percentage, description) VALUES
  ('overall_value_score', 50, 100, 'Full refund if overall value below 50%'),
  ('timeline_completeness', 60, 100, 'Full refund if timeline less than 60% complete'),
  ('legal_accuracy', 40, 100, 'Full refund if legal accuracy below 40%'),
  ('processing_confidence', 30, 100, 'Full refund if AI confidence below 30%'),
  ('letter_quality', 50, 100, 'Full refund if document quality below 50%')
ON CONFLICT (metric_name) DO NOTHING;

-- Enable RLS
ALTER TABLE case_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_truth_chain ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispute_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE refund_thresholds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_quality_metrics
CREATE POLICY "Users can view their own case metrics"
  ON case_quality_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert case metrics"
  ON case_quality_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update case metrics"
  ON case_quality_metrics FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for case_truth_chain
CREATE POLICY "Users can view their case truth chain"
  ON case_truth_chain FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_truth_chain.case_id AND cases.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert truth chain"
  ON case_truth_chain FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases WHERE cases.id = case_truth_chain.case_id AND cases.user_id = auth.uid()
    )
  );

-- RLS Policies for refund_guarantees
CREATE POLICY "Users can view their refund requests"
  ON refund_guarantees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can request refunds"
  ON refund_guarantees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for dispute_history
CREATE POLICY "Users can view their disputes"
  ON dispute_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create disputes"
  ON dispute_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Thresholds are public read
CREATE POLICY "Anyone can view refund thresholds"
  ON refund_thresholds FOR SELECT
  USING (true);

-- Admin policies (for super dashboard)
CREATE POLICY "Admins can view all metrics"
  ON case_quality_metrics FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can view all refunds"
  ON refund_guarantees FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage disputes"
  ON dispute_history FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage thresholds"
  ON refund_thresholds FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Indexes for performance
CREATE INDEX idx_case_metrics_case_id ON case_quality_metrics(case_id);
CREATE INDEX idx_case_metrics_user_id ON case_quality_metrics(user_id);
CREATE INDEX idx_case_metrics_value_score ON case_quality_metrics(overall_value_score);
CREATE INDEX idx_truth_chain_case_id ON case_truth_chain(case_id);
CREATE INDEX idx_truth_chain_hash ON case_truth_chain(processing_hash);
CREATE INDEX idx_refunds_case_id ON refund_guarantees(case_id);
CREATE INDEX idx_refunds_status ON refund_guarantees(status);
CREATE INDEX idx_disputes_case_id ON dispute_history(case_id);

-- Function to calculate hash for truth chain
CREATE OR REPLACE FUNCTION calculate_truth_hash(p_metadata JSONB)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(sha256(p_metadata::text::bytea), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to check refund eligibility
CREATE OR REPLACE FUNCTION check_refund_eligibility(p_case_id UUID)
RETURNS TABLE (
  eligible BOOLEAN,
  reason TEXT,
  refund_percentage INT
) AS $$
DECLARE
  v_metrics case_quality_metrics%ROWTYPE;
  v_threshold refund_thresholds%ROWTYPE;
BEGIN
  -- Get case metrics
  SELECT * INTO v_metrics FROM case_quality_metrics WHERE case_id = p_case_id ORDER BY created_at DESC LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT true, 'No metrics found - automatic refund', 100;
    RETURN;
  END IF;
  
  -- Check each threshold
  FOR v_threshold IN SELECT * FROM refund_thresholds WHERE is_active = true LOOP
    CASE v_threshold.metric_name
      WHEN 'overall_value_score' THEN
        IF v_metrics.overall_value_score < v_threshold.threshold_value THEN
          RETURN QUERY SELECT true, format('Overall value score %s%% below %s%% threshold', v_metrics.overall_value_score, v_threshold.threshold_value), v_threshold.refund_percentage;
          RETURN;
        END IF;
      WHEN 'timeline_completeness' THEN
        IF v_metrics.timeline_completeness < v_threshold.threshold_value THEN
          RETURN QUERY SELECT true, format('Timeline completeness %s%% below %s%% threshold', v_metrics.timeline_completeness, v_threshold.threshold_value), v_threshold.refund_percentage;
          RETURN;
        END IF;
      WHEN 'legal_accuracy' THEN
        IF v_metrics.legal_accuracy < v_threshold.threshold_value THEN
          RETURN QUERY SELECT true, format('Legal accuracy %s%% below %s%% threshold', v_metrics.legal_accuracy, v_threshold.threshold_value), v_threshold.refund_percentage;
          RETURN;
        END IF;
      WHEN 'processing_confidence' THEN
        IF v_metrics.processing_confidence < v_threshold.threshold_value THEN
          RETURN QUERY SELECT true, format('Processing confidence %s%% below %s%% threshold', v_metrics.processing_confidence, v_threshold.threshold_value), v_threshold.refund_percentage;
          RETURN;
        END IF;
      WHEN 'letter_quality' THEN
        IF v_metrics.letter_quality < v_threshold.threshold_value THEN
          RETURN QUERY SELECT true, format('Letter quality %s%% below %s%% threshold', v_metrics.letter_quality, v_threshold.threshold_value), v_threshold.refund_percentage;
          RETURN;
        END IF;
    END CASE;
  END LOOP;
  
  -- All metrics above threshold
  RETURN QUERY SELECT false, format('All metrics above threshold (value: %s%%)', v_metrics.overall_value_score), 0;
END;
$$ LANGUAGE plpgsql;
