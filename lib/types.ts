// UJRIS + IKENGA AI Type Definitions

export type SubscriptionTier = 'free' | 'pro_monthly' | 'pro_annual'

export type CaseType = 
  | 'unfair_dismissal' 
  | 'discrimination' 
  | 'whistleblowing' 
  | 'breach_of_contract' 
  | 'redundancy' 
  | 'other'

export type CaseStatus = 
  | 'active' 
  | 'submitted' 
  | 'hearing_scheduled' 
  | 'won' 
  | 'lost' 
  | 'settled' 
  | 'withdrawn'

export type EvidenceCategory = 
  | 'contract' 
  | 'email' 
  | 'letter' 
  | 'policy' 
  | 'payslip' 
  | 'medical' 
  | 'witness_statement' 
  | 'et3_response' 
  | 'photo' 
  | 'recording' 
  | 'other'

export type TimelineEventType = 
  | 'employment_start' 
  | 'incident' 
  | 'grievance' 
  | 'meeting' 
  | 'disciplinary' 
  | 'dismissal' 
  | 'appeal' 
  | 'acas' 
  | 'et1_submission' 
  | 'et3_response' 
  | 'hearing' 
  | 'other'

export type DocumentType = 
  | 'grievance_letter' 
  | 'sar_request' 
  | 'et1_draft' 
  | 'witness_statement' 
  | 'without_prejudice' 
  | 'appeal_letter' 
  | 'chronology' 
  | 'skeleton_argument'

export type AuditType = 
  | 'et3_analysis' 
  | 'timeline_gaps' 
  | 'evidence_summary' 
  | 'full_case_audit'

export type VentoBand = 'lower' | 'middle' | 'upper' | 'exceptional'

export type SocialPlatform = 'twitter' | 'linkedin' | 'facebook' | 'instagram'

export type ContentType = 'text' | 'image' | 'video' | 'carousel' | 'thread'

export type PostStatus = 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed'

// Database Models
export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  subscription_tier: SubscriptionTier
  subscription_expires_at: string | null
  total_cases_allowed: number
  created_at: string
  updated_at: string
}

export interface Case {
  id: string
  user_id: string
  case_number: string | null
  case_name: string
  case_type: CaseType
  status: CaseStatus
  employer_name: string
  employer_solicitor: string | null
  employment_start_date: string | null
  employment_end_date: string | null
  dismissal_date: string | null
  annual_salary: number | null
  weekly_hours: number | null
  claim_amount: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Evidence {
  id: string
  case_id: string
  user_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  storage_path: string
  category: EvidenceCategory
  description: string | null
  date_of_document: string | null
  is_favorable: boolean | null
  extracted_text: string | null
  ai_summary: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TimelineEvent {
  id: string
  case_id: string
  user_id: string
  event_date: string
  event_title: string
  event_description: string | null
  event_type: TimelineEventType
  evidence_ids: string[]
  is_gap_detected: boolean
  gap_days: number | null
  ai_analysis: string | null
  created_at: string
  updated_at: string
}

export interface ForensicAudit {
  id: string
  case_id: string
  user_id: string
  audit_type: AuditType
  status: 'pending' | 'processing' | 'completed' | 'failed'
  input_data: Record<string, unknown>
  ai_findings: Record<string, unknown> | null
  anchor_lies: string[] | null
  contradictions: string[] | null
  timeline_gaps: string[] | null
  recommendations: string[] | null
  confidence_score: number | null
  tokens_used: number | null
  processing_time_ms: number | null
  created_at: string
  completed_at: string | null
}

export interface Document {
  id: string
  case_id: string
  user_id: string
  document_type: DocumentType
  title: string
  content: string
  template_used: string | null
  variables_used: Record<string, unknown> | null
  file_url: string | null
  version: number
  created_at: string
  updated_at: string
}

export interface CompensationCalculation {
  id: string
  case_id: string
  user_id: string
  calculation_date: string
  age_at_dismissal: number | null
  years_of_service: number | null
  weekly_pay: number | null
  weekly_pay_cap: number
  basic_award: number | null
  loss_of_earnings: number | null
  future_loss_weeks: number | null
  loss_of_statutory_rights: number
  loss_of_pension: number | null
  expenses: number | null
  compensatory_award: number | null
  compensatory_cap: number
  injury_to_feelings_band: VentoBand | null
  injury_to_feelings_amount: number | null
  uplift_percentage: number | null
  reduction_percentage: number | null
  polkey_reduction: number | null
  total_award: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SocialAccount {
  id: string
  user_id: string
  platform: SocialPlatform
  account_name: string
  account_id: string
  access_token: string | null
  refresh_token: string | null
  token_expires_at: string | null
  profile_image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentPost {
  id: string
  user_id: string
  title: string | null
  content: string
  content_type: ContentType
  platforms: SocialPlatform[]
  scheduled_for: string | null
  published_at: string | null
  status: PostStatus
  ai_generated: boolean
  ai_prompt: string | null
  media_urls: string[] | null
  hashtags: string[] | null
  engagement_data: Record<string, unknown>
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface BrandVoice {
  id: string
  user_id: string
  name: string
  description: string | null
  tone: string
  style_guidelines: string | null
  sample_content: string[] | null
  keywords: string[] | null
  avoid_words: string[] | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  payment_type: 'subscription' | 'one_time_forensic' | 'one_time_documents'
  payment_method: 'bank_transfer' | 'stripe' | null
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  reference: string | null
  stripe_payment_intent_id: string | null
  description: string | null
  created_at: string
  completed_at: string | null
}

export interface ActivityLog {
  id: string
  user_id: string
  case_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// Vento Bands 2025/26 (Updated annually)
export const VENTO_BANDS = {
  lower: { min: 1200, max: 11700, description: 'Less serious cases' },
  middle: { min: 11700, max: 35200, description: 'Serious cases' },
  upper: { min: 35200, max: 58700, description: 'Most serious cases' },
  exceptional: { min: 58700, max: null, description: 'Exceptional circumstances only' }
} as const

// Compensation Caps 2025/26
export const COMPENSATION_CAPS = {
  weekly_pay_cap: 700,
  basic_award_cap: 21000, // 30 weeks x £700
  compensatory_cap: 115461, // Updated annually
  compensatory_cap_yearly: 52 // Or 52 weeks' pay if lower
} as const

// Pricing
export const PRICING = {
  pro_monthly: 9.99,
  pro_annual: 79,
  one_time_forensic: 49,
  one_time_documents: 29
} as const
