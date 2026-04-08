'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Pound,
  FileText,
  Check
} from 'lucide-react'
import type { CaseType } from '@/lib/types'

const caseTypes: { value: CaseType; label: string; description: string }[] = [
  { value: 'unfair_dismissal', label: 'Unfair Dismissal', description: 'Terminated without fair reason or process' },
  { value: 'discrimination', label: 'Discrimination', description: 'Based on protected characteristics' },
  { value: 'whistleblowing', label: 'Whistleblowing', description: 'Retaliation for reporting wrongdoing' },
  { value: 'breach_of_contract', label: 'Breach of Contract', description: 'Employer violated employment terms' },
  { value: 'redundancy', label: 'Redundancy', description: 'Unfair redundancy selection or process' },
  { value: 'other', label: 'Other', description: 'Other employment tribunal claims' },
]

export default function NewCasePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    case_name: '',
    case_type: '' as CaseType | '',
    employer_name: '',
    employer_solicitor: '',
    employment_start_date: '',
    employment_end_date: '',
    dismissal_date: '',
    annual_salary: '',
    weekly_hours: '',
    notes: ''
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be logged in to create a case')
      setLoading(false)
      return
    }

    const { data, error: insertError } = await supabase
      .from('cases')
      .insert({
        user_id: user.id,
        case_name: formData.case_name,
        case_type: formData.case_type,
        employer_name: formData.employer_name,
        employer_solicitor: formData.employer_solicitor || null,
        employment_start_date: formData.employment_start_date || null,
        employment_end_date: formData.employment_end_date || null,
        dismissal_date: formData.dismissal_date || null,
        annual_salary: formData.annual_salary ? parseFloat(formData.annual_salary) : null,
        weekly_hours: formData.weekly_hours ? parseFloat(formData.weekly_hours) : null,
        notes: formData.notes || null
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/cases/${data.id}`)
  }

  const canProceed = () => {
    if (step === 1) return formData.case_name && formData.case_type
    if (step === 2) return formData.employer_name
    return true
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Link
        href="/cases"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to cases
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create New Case</h1>
        <p className="text-muted-foreground mt-1">
          Set up your employment tribunal case
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step > s 
                  ? 'bg-gold text-black' 
                  : step === s 
                    ? 'bg-gold/20 text-gold border-2 border-gold' 
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? 'bg-gold' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Steps */}
      <div className="p-6 rounded-xl bg-card border border-border">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Case Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <Briefcase className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Case Details</h2>
                <p className="text-sm text-muted-foreground">What type of case are you bringing?</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Case Name</label>
              <input
                type="text"
                value={formData.case_name}
                onChange={(e) => updateField('case_name', e.target.value)}
                placeholder="e.g., Smith v Acme Corp - Unfair Dismissal"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Case Type</label>
              <div className="grid gap-3">
                {caseTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => updateField('case_type', type.value)}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all ${
                      formData.case_type === type.value
                        ? 'bg-gold/10 border-gold/50 ring-2 ring-gold/20'
                        : 'bg-secondary border-border hover:border-gold/30'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.case_type === type.value
                        ? 'border-gold bg-gold'
                        : 'border-muted-foreground'
                    }`}>
                      {formData.case_type === type.value && (
                        <Check className="w-3 h-3 text-black" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{type.label}</p>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employer */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <Building2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Employer Information</h2>
                <p className="text-sm text-muted-foreground">Details about your employer</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Employer Name *</label>
              <input
                type="text"
                value={formData.employer_name}
                onChange={(e) => updateField('employer_name', e.target.value)}
                placeholder="e.g., Acme Corporation Ltd"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{"Employer's Solicitor (if known)"}</label>
              <input
                type="text"
                value={formData.employer_solicitor}
                onChange={(e) => updateField('employer_solicitor', e.target.value)}
                placeholder="e.g., Smith & Partners LLP"
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Step 3: Employment Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold/10">
                <Calendar className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Employment Details</h2>
                <p className="text-sm text-muted-foreground">Information for compensation calculation</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Employment Start Date</label>
                <input
                  type="date"
                  value={formData.employment_start_date}
                  onChange={(e) => updateField('employment_start_date', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Employment End Date</label>
                <input
                  type="date"
                  value={formData.employment_end_date}
                  onChange={(e) => updateField('employment_end_date', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dismissal Date (if applicable)</label>
              <input
                type="date"
                value={formData.dismissal_date}
                onChange={(e) => updateField('dismissal_date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Annual Salary (£)</label>
                <div className="relative">
                  <Pound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    value={formData.annual_salary}
                    onChange={(e) => updateField('annual_salary', e.target.value)}
                    placeholder="35000"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Weekly Hours</label>
                <input
                  type="number"
                  value={formData.weekly_hours}
                  onChange={(e) => updateField('weekly_hours', e.target.value)}
                  placeholder="37.5"
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Any additional information about your case..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all gold-glow-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Create Case
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
