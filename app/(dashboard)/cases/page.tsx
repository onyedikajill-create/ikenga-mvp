import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  Briefcase,
  Calendar,
  Building2,
  Crown,
  MoreHorizontal
} from 'lucide-react'
import type { Case, Profile } from '@/lib/types'

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

export default async function CasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  const [casesResult, profileResult] = await Promise.all([
    supabase.from('cases').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
    supabase.from('profiles').select('*').eq('id', user.id).single()
  ])
  
  const cases = (casesResult.data || []) as Case[]
  const profile = profileResult.data as Profile | null
  
  const isPro = profile?.subscription_tier && ['pro_monthly', 'pro_annual', 'pro_lifetime', 'pro_one_time'].includes(profile.subscription_tier)
  const activeCases = cases.filter(c => !['closed', 'archived', 'withdrawn'].includes(c.status))
  const canCreateCase = isPro || activeCases.length < 1

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage your employment tribunal cases
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
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold/20 text-gold font-semibold hover:bg-gold/30 transition-all border border-gold/30"
          >
            <Crown className="w-5 h-5" />
            Upgrade for Unlimited Cases - £49
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cases..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-foreground hover:bg-secondary transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No cases yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first employment tribunal case to start organizing your evidence, 
            building your timeline, and preparing your documents.
          </p>
          <Link
            href="/cases/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Your First Case
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases.map((caseItem) => (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.id}`}
              className="block p-5 rounded-xl bg-card border border-border card-hover group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Case Icon */}
                <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gold/10 items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-gold" />
                </div>
                
                {/* Case Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {caseItem.case_name}
                    </h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[caseItem.status]}`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {caseItem.employer_name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {caseTypeLabels[caseItem.case_type]}
                    </span>
                    {caseItem.case_number && (
                      <span className="font-mono text-xs">
                        #{caseItem.case_number}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Created {new Date(caseItem.created_at).toLocaleDateString()}
                    </span>
                    {caseItem.claim_amount && (
                      <span className="font-semibold text-gold">
                        £{caseItem.claim_amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  <div className="p-2 rounded-lg text-muted-foreground group-hover:text-gold group-hover:bg-gold/10 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Case Limit Info - Free Tier Upgrade Prompt */}
      {!isPro && activeCases.length > 0 && (
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-gold" />
              <div>
                <p className="font-medium text-foreground">
                  Free tier: {activeCases.length} of 1 active case used
                </p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for unlimited cases + AI Forensic Finder + Document Export
                </p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all text-sm gold-glow-sm"
            >
              Get Pro - £49 One-Time
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
