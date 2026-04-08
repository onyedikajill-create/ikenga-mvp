'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { 
  Plus, 
  Clock, 
  Calendar,
  AlertTriangle,
  FileBox,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react'
import type { TimelineEvent, Case, Evidence, TimelineEventType } from '@/lib/types'

const eventTypeLabels: Record<TimelineEventType, string> = {
  employment_start: 'Employment Start',
  incident: 'Incident',
  grievance: 'Grievance',
  meeting: 'Meeting',
  disciplinary: 'Disciplinary',
  dismissal: 'Dismissal',
  appeal: 'Appeal',
  acas: 'ACAS',
  et1_submission: 'ET1 Submission',
  et3_response: 'ET3 Response',
  hearing: 'Hearing',
  other: 'Other'
}

const eventTypeColors: Record<TimelineEventType, string> = {
  employment_start: 'bg-success/20 text-success border-success/30',
  incident: 'bg-destructive/20 text-destructive border-destructive/30',
  grievance: 'bg-warning/20 text-warning border-warning/30',
  meeting: 'bg-info/20 text-info border-info/30',
  disciplinary: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  dismissal: 'bg-red-600/20 text-red-600 border-red-600/30',
  appeal: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  acas: 'bg-teal-500/20 text-teal-500 border-teal-500/30',
  et1_submission: 'bg-blue-600/20 text-blue-600 border-blue-600/30',
  et3_response: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  hearing: 'bg-gold/20 text-gold border-gold/30',
  other: 'bg-muted text-muted-foreground border-border'
}

export default function TimelineBuilderPage() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('case')
  
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [selectedCase, setSelectedCase] = useState(caseId || '')
  
  // Form state
  const [formDate, setFormDate] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState<TimelineEventType>('incident')
  const [formEvidenceIds, setFormEvidenceIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    const [eventsResult, casesResult, evidenceResult] = await Promise.all([
      selectedCase 
        ? supabase.from('timeline_events').select('*').eq('user_id', user.id).eq('case_id', selectedCase).order('event_date', { ascending: true })
        : supabase.from('timeline_events').select('*').eq('user_id', user.id).order('event_date', { ascending: true }),
      supabase.from('cases').select('*').eq('user_id', user.id).order('case_name'),
      selectedCase
        ? supabase.from('evidence').select('*').eq('user_id', user.id).eq('case_id', selectedCase)
        : supabase.from('evidence').select('*').eq('user_id', user.id)
    ])

    const loadedEvents = (eventsResult.data || []) as TimelineEvent[]
    
    // Detect gaps (more than 30 days between events)
    const eventsWithGaps = loadedEvents.map((event, index) => {
      if (index === 0) return event
      const prevEvent = loadedEvents[index - 1]
      const daysDiff = Math.floor(
        (new Date(event.event_date).getTime() - new Date(prevEvent.event_date).getTime()) / (1000 * 60 * 60 * 24)
      )
      return {
        ...event,
        is_gap_detected: daysDiff > 30,
        gap_days: daysDiff > 30 ? daysDiff : null
      }
    })

    setEvents(eventsWithGaps)
    setCases((casesResult.data || []) as Case[])
    setEvidence((evidenceResult.data || []) as Evidence[])
    setLoading(false)
  }, [selectedCase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const resetForm = () => {
    setFormDate('')
    setFormTitle('')
    setFormDescription('')
    setFormType('incident')
    setFormEvidenceIds([])
    setEditingEvent(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const openEditModal = (event: TimelineEvent) => {
    setEditingEvent(event)
    setFormDate(event.event_date)
    setFormTitle(event.event_title)
    setFormDescription(event.event_description || '')
    setFormType(event.event_type)
    setFormEvidenceIds(event.evidence_ids || [])
    setShowAddModal(true)
  }

  const handleSave = async () => {
    if (!formDate || !formTitle || !selectedCase) return

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setSaving(false)
      return
    }

    const eventData = {
      user_id: user.id,
      case_id: selectedCase,
      event_date: formDate,
      event_title: formTitle,
      event_description: formDescription || null,
      event_type: formType,
      evidence_ids: formEvidenceIds
    }

    if (editingEvent) {
      await supabase.from('timeline_events').update(eventData).eq('id', editingEvent.id)
    } else {
      await supabase.from('timeline_events').insert(eventData)
    }

    setSaving(false)
    setShowAddModal(false)
    resetForm()
    loadData()
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    const supabase = createClient()
    await supabase.from('timeline_events').delete().eq('id', eventId)
    loadData()
  }

  const gapsCount = events.filter(e => e.is_gap_detected).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timeline Builder</h1>
          <p className="text-muted-foreground mt-1">
            Build a chronological narrative of your case events
          </p>
        </div>
        <button
          onClick={openAddModal}
          disabled={!selectedCase}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all gold-glow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* Case Selector & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>{c.case_name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2.5 rounded-lg bg-card border border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            <span className="font-semibold text-foreground">{events.length}</span>
            <span className="text-muted-foreground">events</span>
          </div>
          {gapsCount > 0 && (
            <div className="px-4 py-2.5 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="font-semibold text-warning">{gapsCount}</span>
              <span className="text-warning">gaps detected</span>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      {events.length === 0 ? (
        <div className="p-12 rounded-xl bg-card border border-border text-center">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No timeline events yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start building your case chronology by adding key events like incidents, meetings, and disciplinary actions.
          </p>
          {selectedCase ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all"
            >
              <Plus className="w-5 h-5" />
              Add First Event
            </button>
          ) : (
            <p className="text-sm text-muted-foreground">Select a case above to start adding events</p>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id}>
                {/* Gap Warning */}
                {event.is_gap_detected && event.gap_days && (
                  <div className="ml-12 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                    <div>
                      <p className="font-medium text-warning">Gap Detected: {event.gap_days} days</p>
                      <p className="text-sm text-warning/80">Consider adding events or explanations for this period</p>
                    </div>
                  </div>
                )}
                
                {/* Event Card */}
                <div className="flex gap-4">
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full border-4 border-background flex items-center justify-center ${
                      event.event_type === 'dismissal' ? 'bg-destructive' :
                      event.event_type === 'employment_start' ? 'bg-success' :
                      event.event_type === 'hearing' ? 'bg-gold' :
                      'bg-card border-2 border-border'
                    }`}>
                      <Calendar className={`w-5 h-5 ${
                        ['dismissal', 'employment_start', 'hearing'].includes(event.event_type) 
                          ? 'text-white' 
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="flex-1 p-4 rounded-xl bg-card border border-border card-hover group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${eventTypeColors[event.event_type]}`}>
                            {eventTypeLabels[event.event_type]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{event.event_title}</h3>
                        {event.event_description && (
                          <p className="text-muted-foreground text-sm">{event.event_description}</p>
                        )}
                        {event.evidence_ids && event.evidence_ids.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <FileBox className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {event.evidence_ids.length} linked evidence item{event.evidence_ids.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(event)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !saving && setShowAddModal(false)} />
          <div className="relative w-full max-w-lg bg-card rounded-xl border border-border shadow-xl animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
              <h2 className="text-lg font-semibold text-foreground">
                {editingEvent ? 'Edit Event' : 'Add Timeline Event'}
              </h2>
              <button
                onClick={() => !saving && setShowAddModal(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Case (if not pre-selected) */}
              {!caseId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Case *</label>
                  <select
                    value={selectedCase}
                    onChange={(e) => setSelectedCase(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                  >
                    <option value="">Select a case</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>{c.case_name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Date *</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as TimelineEventType)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  {Object.entries(eventTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Verbal warning issued by manager"
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Provide details about what happened..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                />
              </div>

              {/* Link Evidence */}
              {evidence.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Link Evidence</label>
                  <div className="max-h-32 overflow-y-auto space-y-2 p-2 rounded-lg bg-secondary border border-border">
                    {evidence.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formEvidenceIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormEvidenceIds([...formEvidenceIds, item.id])
                            } else {
                              setFormEvidenceIds(formEvidenceIds.filter(id => id !== item.id))
                            }
                          }}
                          className="w-4 h-4 rounded border-border bg-background text-gold focus:ring-gold"
                        />
                        <span className="text-sm text-foreground truncate">{item.file_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-3 p-4 border-t border-border bg-card">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formDate || !formTitle || !selectedCase || saving}
                className="px-6 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? 'Saving...' : editingEvent ? 'Save Changes' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
