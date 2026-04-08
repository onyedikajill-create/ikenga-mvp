'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  Crown,
  Clock,
  Target,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Copy,
  Download
} from 'lucide-react'
import type { Case, ForensicAudit, Profile } from '@/lib/types'

export default function ForensicAuditorPage() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('case')
  
  const [cases, setCases] = useState<Case[]>([])
  const [audits, setAudits] = useState<ForensicAudit[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState(caseId || '')
  const [selectedAudit, setSelectedAudit] = useState<ForensicAudit | null>(null)
  
  // Analysis form state
  const [showAnalysisForm, setShowAnalysisForm] = useState(false)
  const [et3Text, setEt3Text] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [expandedSections, setExpandedSections] = useState<string[]>(['anchor_lies', 'contradictions', 'recommendations'])

  const isPro = profile?.subscription_tier === 'pro_monthly' || profile?.subscription_tier === 'pro_annual'

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const [casesResult, auditsResult, profileResult] = await Promise.all([
      supabase.from('cases').select('*').eq('user_id', user.id).order('case_name'),
      selectedCase
        ? supabase.from('forensic_audits').select('*').eq('user_id', user.id).eq('case_id', selectedCase).order('created_at', { ascending: false })
        : supabase.from('forensic_audits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').eq('id', user.id).single()
    ])

    setCases((casesResult.data || []) as Case[])
    setAudits((auditsResult.data || []) as ForensicAudit[])
    setProfile(profileResult.data as Profile | null)
    setLoading(false)
  }, [selectedCase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const runAnalysis = async () => {
    if (!et3Text.trim() || !selectedCase) return

    setAnalyzing(true)
    setAnalysisProgress(0)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setAnalyzing(false)
      return
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 5, 90))
    }, 500)

    try {
      // Call AI analysis API
      const response = await fetch('/api/forensic/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: selectedCase,
          et3_text: et3Text,
          audit_type: 'et3_analysis'
        })
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (response.ok) {
        const result = await response.json()
        
        // Refresh audits
        await loadData()
        
        // Show the new audit
        if (result.audit) {
          setSelectedAudit(result.audit)
        }
        
        setShowAnalysisForm(false)
        setEt3Text('')
      }
    } catch (error) {
      console.error('Analysis error:', error)
    }

    clearInterval(progressInterval)
    setAnalyzing(false)
    setAnalysisProgress(0)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  // Show upgrade prompt for non-pro users
  if (!isPro) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Forensic AI Auditor</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered analysis of ET3 responses to expose contradictions
            </p>
          </div>
        </div>

        <div className="p-12 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 text-center">
          <div className="p-4 rounded-full bg-gold/20 w-fit mx-auto mb-6">
            <Crown className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Unlock Forensic AI Auditor</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {"Our AI forensic auditor analyzes your employer's ET3 response to identify anchor lies, "} 
            contradictions, timeline gaps, and strategic weaknesses. This powerful tool can help you 
            build a winning case.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            <div className="p-4 rounded-lg bg-card border border-border">
              <Target className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-semibold text-foreground">Anchor Lies</p>
              <p className="text-sm text-muted-foreground">Identify central false claims</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <AlertTriangle className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-semibold text-foreground">Contradictions</p>
              <p className="text-sm text-muted-foreground">Find internal inconsistencies</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <Lightbulb className="w-8 h-8 text-gold mx-auto mb-2" />
              <p className="font-semibold text-foreground">Recommendations</p>
              <p className="text-sm text-muted-foreground">Get strategic advice</p>
            </div>
          </div>

          <Link
            href="/settings/billing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-black font-semibold text-lg hover:bg-gold-light transition-all gold-glow"
          >
            <Crown className="w-5 h-5" />
            Upgrade to Pro - £9.99/month
          </Link>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Or get a one-time forensic audit for £49
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Forensic AI Auditor</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered analysis of ET3 responses to expose contradictions
          </p>
        </div>
        <button
          onClick={() => setShowAnalysisForm(true)}
          disabled={!selectedCase}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all gold-glow-sm"
        >
          <Sparkles className="w-5 h-5" />
          New Analysis
        </button>
      </div>

      {/* Case Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedCase}
          onChange={(e) => {
            setSelectedCase(e.target.value)
            setSelectedAudit(null)
          }}
          className="flex-1 px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <option value="">Select a case</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>{c.case_name}</option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Audits List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Previous Audits</h2>
          
          {audits.length === 0 ? (
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No audits yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedCase ? 'Run your first analysis' : 'Select a case to start'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {audits.map((audit) => (
                <button
                  key={audit.id}
                  onClick={() => setSelectedAudit(audit)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedAudit?.id === audit.id
                      ? 'bg-gold/10 border-gold/50'
                      : 'bg-card border-border hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      audit.status === 'completed' ? 'bg-success/10 text-success' :
                      audit.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {audit.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(audit.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{audit.audit_type.replace('_', ' ')}</p>
                  {audit.anchor_lies && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {audit.anchor_lies.length} anchor lies found
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Audit Results */}
        <div className="lg:col-span-2">
          {selectedAudit ? (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Analysis Results</h2>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {selectedAudit.confidence_score && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Confidence Score</span>
                        <span className="font-semibold text-gold">{Math.round(selectedAudit.confidence_score * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className="h-full bg-gold transition-all"
                          style={{ width: `${selectedAudit.confidence_score * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Anchor Lies */}
              {selectedAudit.anchor_lies && selectedAudit.anchor_lies.length > 0 && (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection('anchor_lies')}
                    className="w-full p-4 flex items-center justify-between bg-destructive/5 border-b border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-destructive" />
                      <span className="font-semibold text-foreground">Anchor Lies</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                        {selectedAudit.anchor_lies.length}
                      </span>
                    </div>
                    {expandedSections.includes('anchor_lies') ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSections.includes('anchor_lies') && (
                    <div className="p-4 space-y-3">
                      {selectedAudit.anchor_lies.map((lie, i) => (
                        <div key={i} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <p className="text-foreground">{lie}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contradictions */}
              {selectedAudit.contradictions && selectedAudit.contradictions.length > 0 && (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection('contradictions')}
                    className="w-full p-4 flex items-center justify-between bg-warning/5 border-b border-border"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <span className="font-semibold text-foreground">Contradictions</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                        {selectedAudit.contradictions.length}
                      </span>
                    </div>
                    {expandedSections.includes('contradictions') ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSections.includes('contradictions') && (
                    <div className="p-4 space-y-3">
                      {selectedAudit.contradictions.map((contradiction, i) => (
                        <div key={i} className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <p className="text-foreground">{contradiction}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations */}
              {selectedAudit.recommendations && selectedAudit.recommendations.length > 0 && (
                <div className="rounded-xl bg-card border border-border overflow-hidden">
                  <button
                    onClick={() => toggleSection('recommendations')}
                    className="w-full p-4 flex items-center justify-between bg-success/5 border-b border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb className="w-5 h-5 text-success" />
                      <span className="font-semibold text-foreground">Recommendations</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                        {selectedAudit.recommendations.length}
                      </span>
                    </div>
                    {expandedSections.includes('recommendations') ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedSections.includes('recommendations') && (
                    <div className="p-4 space-y-3">
                      {selectedAudit.recommendations.map((rec, i) => (
                        <div key={i} className="p-3 rounded-lg bg-success/5 border border-success/20">
                          <p className="text-foreground">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-card border border-border text-center">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Select or run an analysis</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {"Choose a previous audit from the list or run a new analysis on your employer's ET3 response"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Form Modal */}
      {showAnalysisForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !analyzing && setShowAnalysisForm(false)} />
          <div className="relative w-full max-w-2xl bg-card rounded-xl border border-border shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gold/10">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Forensic ET3 Analysis</h2>
                  <p className="text-sm text-muted-foreground">Paste your employer{"'"}s ET3 response</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="p-4 rounded-lg bg-info/10 border border-info/30">
                <p className="text-sm text-info">
                  <strong>Tip:</strong> Copy the full text of the ET3 response including all grounds of resistance. 
                  The more complete the text, the better the analysis.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">ET3 Response Text *</label>
                <textarea
                  value={et3Text}
                  onChange={(e) => setEt3Text(e.target.value)}
                  placeholder="Paste the employer's ET3 response here..."
                  rows={12}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {et3Text.length} characters
                </p>
              </div>

              {/* Analysis Progress */}
              {analyzing && (
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div 
                      className="h-full bg-gold transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                    <span>AI analyzing ET3 response... {analysisProgress}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-4 border-t border-border bg-card">
              <button
                onClick={() => setShowAnalysisForm(false)}
                disabled={analyzing}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={runAnalysis}
                disabled={!et3Text.trim() || !selectedCase || analyzing}
                className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
