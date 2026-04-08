import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileBox, 
  Clock, 
  Search, 
  FileText, 
  Calculator,
  Edit,
  Trash2,
  Building2,
  Calendar,
  Pound,
  User,
  ExternalLink,
  MoreHorizontal
} from 'lucide-react'
import type { Case, Evidence, TimelineEvent, Document as Doc } from '@/lib/types'
import { CaseValueMetricsWrapper } from '@/components/case/case-value-metrics-wrapper'

const caseTypeLabels: Record<string, string> = {
  unfair_dismissal: 'Unfair Dismissal',
  discrimination: 'Discrimination',
  whistleblowing: 'Whistleblowing',
  breach_of_contract: 'Breach of Contract',
  redundancy: 'Redundancy',
  other: 'Other'
}

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  submitted: 'bg-info/10 text-info border-info/20',
  hearing_scheduled: 'bg-warning/10 text-warning border-warning/20',
  won: 'bg-gold/10 text-gold border-gold/20',
  lost: 'bg-destructive/10 text-destructive border-destructive/20',
  settled: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  withdrawn: 'bg-muted text-muted-foreground border-border'
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get case with related data
  const [caseResult, evidenceResult, timelineResult, documentsResult] = await Promise.all([
    supabase.from('cases').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('evidence').select('*').eq('case_id', id).eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('timeline_events').select('*').eq('case_id', id).eq('user_id', user.id).order('event_date', { ascending: true }),
    supabase.from('documents').select('*').eq('case_id', id).eq('user_id', user.id).order('created_at', { ascending: false })
  ])

  if (!caseResult.data) {
    notFound()
  }

  const caseData = caseResult.data as Case
  const evidence = (evidenceResult.data || []) as Evidence[]
  const timeline = (timelineResult.data || []) as TimelineEvent[]
  const documents = (documentsResult.data || []) as Doc[]

  const gapsDetected = timeline.filter(t => t.is_gap_detected).length

  const actions = [
    { href: `/evidence?case=${id}`, label: 'Evidence Vault', icon: FileBox, count: evidence.length },
    { href: `/timeline?case=${id}`, label: 'Timeline', icon: Clock, count: timeline.length, alert: gapsDetected > 0 ? `${gapsDetected} gaps` : undefined },
    { href: `/forensic?case=${id}`, label: 'AI Analysis', icon: Search },
    { href: `/documents?case=${id}`, label: 'Documents', icon: FileText, count: documents.length },
    { href: `/calculator?case=${id}`, label: 'Calculate Award', icon: Calculator },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link
        href="/cases"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to cases
      </Link>

      {/* Case Header */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{caseData.case_name}</h1>
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${statusColors[caseData.status]}`}>
                {caseData.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                vs {caseData.employer_name}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {caseTypeLabels[caseData.case_type]}
              </span>
              {caseData.case_number && (
                <span className="font-mono">#{caseData.case_number}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href={`/cases/${id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-foreground">{evidence.length}</p>
          <p className="text-sm text-muted-foreground">Evidence Items</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-foreground">{timeline.length}</p>
          <p className="text-sm text-muted-foreground">Timeline Events</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <p className="text-2xl font-bold text-foreground">{documents.length}</p>
          <p className="text-sm text-muted-foreground">Documents</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          {caseData.claim_amount ? (
            <>
              <p className="text-2xl font-bold text-gold">£{caseData.claim_amount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Claim Amount</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-muted-foreground">-</p>
              <p className="text-sm text-muted-foreground">Claim Amount</p>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employment Details */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Employment Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {caseData.employment_start_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(caseData.employment_start_date).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
              {caseData.employment_end_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(caseData.employment_end_date).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
              {caseData.dismissal_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dismissal Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(caseData.dismissal_date).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              )}
              {caseData.annual_salary && (
                <div className="flex items-start gap-3">
                  <Pound className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Salary</p>
                    <p className="font-medium text-foreground">£{caseData.annual_salary.toLocaleString()}</p>
                  </div>
                </div>
              )}
              {caseData.weekly_hours && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Hours</p>
                    <p className="font-medium text-foreground">{caseData.weekly_hours} hours</p>
                  </div>
                </div>
              )}
              {caseData.employer_solicitor && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">{"Employer's Solicitor"}</p>
                    <p className="font-medium text-foreground">{caseData.employer_solicitor}</p>
                  </div>
                </div>
              )}
            </div>
            
            {caseData.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-foreground whitespace-pre-wrap">{caseData.notes}</p>
              </div>
            )}
          </div>

          {/* Recent Evidence */}
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Evidence</h2>
              <Link href={`/evidence?case=${id}`} className="text-sm text-gold hover:text-gold-light flex items-center gap-1">
                View all <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            {evidence.length === 0 ? (
              <div className="text-center py-8">
                <FileBox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No evidence uploaded yet</p>
                <Link
                  href={`/evidence?case=${id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all text-sm"
                >
                  Upload Evidence
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {evidence.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                    <FileBox className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.file_name}</p>
                      <p className="text-xs text-muted-foreground">{item.category} • {(item.file_size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          {/* Case Value Metrics - The IKENGA Guarantee */}
          <CaseValueMetricsWrapper caseId={id} />

          <h2 className="text-lg font-semibold text-foreground">Case Actions</h2>
          <div className="space-y-2">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border card-hover"
              >
                <div className="p-2 rounded-lg bg-gold/10">
                  <action.icon className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{action.label}</p>
                  {action.count !== undefined && (
                    <p className="text-xs text-muted-foreground">{action.count} items</p>
                  )}
                </div>
                {action.alert && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                    {action.alert}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Case Timeline Preview */}
          {timeline.length > 0 && (
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold text-foreground mb-3">Timeline Preview</h3>
              <div className="space-y-3">
                {timeline.slice(0, 4).map((event, i) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${i === 0 ? 'bg-gold' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.event_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
