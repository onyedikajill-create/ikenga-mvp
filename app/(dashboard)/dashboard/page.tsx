import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Briefcase, 
  FileBox, 
  Clock, 
  Search, 
  FileText, 
  Calculator,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Crown
} from 'lucide-react'
import type { Case, Profile } from '@/lib/types'

async function getDashboardData(userId: string) {
  const supabase = await createClient()
  
  const [casesResult, evidenceResult, timelineResult, documentsResult, profileResult] = await Promise.all([
    supabase.from('cases').select('*').eq('user_id', userId).order('updated_at', { ascending: false }),
    supabase.from('evidence').select('id, case_id').eq('user_id', userId),
    supabase.from('timeline_events').select('id, case_id, is_gap_detected').eq('user_id', userId),
    supabase.from('documents').select('id, case_id').eq('user_id', userId),
    supabase.from('profiles').select('*').eq('id', userId).single()
  ])
  
  return {
    cases: (casesResult.data || []) as Case[],
    evidenceCount: evidenceResult.data?.length || 0,
    timelineCount: timelineResult.data?.length || 0,
    gapsDetected: timelineResult.data?.filter(t => t.is_gap_detected).length || 0,
    documentsCount: documentsResult.data?.length || 0,
    profile: profileResult.data as Profile | null
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  const { cases, evidenceCount, timelineCount, gapsDetected, documentsCount, profile } = await getDashboardData(user.id)
  
  const activeCases = cases.filter(c => c.status === 'active')
  const isPro = profile?.subscription_tier === 'pro_monthly' || profile?.subscription_tier === 'pro_annual'
  const canCreateCase = isPro || cases.length < (profile?.total_cases_allowed || 1)

  // Status counts
  const statusCounts = {
    active: cases.filter(c => c.status === 'active').length,
    submitted: cases.filter(c => c.status === 'submitted').length,
    won: cases.filter(c => c.status === 'won').length,
    settled: cases.filter(c => c.status === 'settled').length,
  }

  const quickActions = [
    { href: '/cases/new', label: 'New Case', icon: Plus, description: 'Start a new tribunal case', disabled: !canCreateCase },
    { href: '/evidence', label: 'Upload Evidence', icon: FileBox, description: 'Add documents to your vault' },
    { href: '/timeline', label: 'Build Timeline', icon: Clock, description: 'Create your case chronology' },
    { href: '/forensic', label: 'AI Analysis', icon: Search, description: 'Analyze ET3 response', premium: true },
    { href: '/documents', label: 'Generate Docs', icon: FileText, description: 'Create legal documents' },
    { href: '/calculator', label: 'Calculate Award', icon: Calculator, description: 'Estimate compensation' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {"Here's an overview of your cases and activity"}
          </p>
        </div>
        {canCreateCase ? (
          <Link
            href="/cases/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm"
          >
            <Plus className="w-5 h-5" />
            New Case
          </Link>
        ) : (
          <Link
            href="/settings/billing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold/20 text-gold font-semibold hover:bg-gold/30 transition-all border border-gold/30"
          >
            <Crown className="w-5 h-5" />
            Upgrade for More Cases
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border card-hover">
          <div className="flex items-center justify-between mb-3">
            <Briefcase className="w-5 h-5 text-gold" />
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gold/10 text-gold">
              {statusCounts.active} active
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">{cases.length}</p>
          <p className="text-sm text-muted-foreground">Total Cases</p>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border card-hover">
          <div className="flex items-center justify-between mb-3">
            <FileBox className="w-5 h-5 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{evidenceCount}</p>
          <p className="text-sm text-muted-foreground">Evidence Items</p>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border card-hover">
          <div className="flex items-center justify-between mb-3">
            <Clock className="w-5 h-5 text-success" />
            {gapsDetected > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                {gapsDetected} gaps
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{timelineCount}</p>
          <p className="text-sm text-muted-foreground">Timeline Events</p>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border card-hover">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{documentsCount}</p>
          <p className="text-sm text-muted-foreground">Documents</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Cases</h2>
            <Link href="/cases" className="text-sm text-gold hover:text-gold-light flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {cases.length === 0 ? (
            <div className="p-8 rounded-xl bg-card border border-border text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No cases yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first employment tribunal case
              </p>
              <Link
                href="/cases/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Your First Case
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.slice(0, 5).map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="block p-4 rounded-xl bg-card border border-border card-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {caseItem.case_name}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full status-${caseItem.status}`}>
                          {caseItem.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        vs {caseItem.employer_name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {caseItem.case_type.replace('_', ' ')} • Updated {new Date(caseItem.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.disabled ? '/settings/billing' : action.href}
                className={`flex items-center gap-3 p-3 rounded-xl bg-card border border-border card-hover ${
                  action.disabled ? 'opacity-60' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${action.premium && !isPro ? 'bg-gold/10' : 'bg-secondary'}`}>
                  <action.icon className={`w-5 h-5 ${action.premium && !isPro ? 'text-gold' : 'text-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{action.label}</p>
                    {action.premium && !isPro && (
                      <Crown className="w-4 h-4 text-gold" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Case Status Summary */}
      {cases.length > 0 && (
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Case Status Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{statusCounts.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <FileText className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{statusCounts.submitted}</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold/10">
                <CheckCircle2 className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{statusCounts.won}</p>
                <p className="text-xs text-muted-foreground">Won</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <AlertTriangle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{statusCounts.settled}</p>
                <p className="text-xs text-muted-foreground">Settled</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
