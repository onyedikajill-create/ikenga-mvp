import { NextRequest, NextResponse } from 'next/server'

// Types
type AlertSeverity = 'info' | 'warning' | 'critical' | 'urgent'
type AlertType = 'low_confidence' | 'user_dispute' | 'legal_risk' | 'system_error' | 'unusual_pattern' | 'ai_insight' | 'payment_issue' | 'security_concern'

interface SystemAlert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  description: string
  userId?: string
  caseId?: string
  metadata: Record<string, unknown>
  isRead: boolean
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  resolutionNotes?: string
  createdAt: string
}

// Demo alerts data
const demoAlerts: SystemAlert[] = [
  {
    id: 'alert_1',
    type: 'low_confidence',
    severity: 'warning',
    title: 'Low AI Confidence Score',
    description: 'Forensic analysis for case #234 returned 62% confidence',
    userId: 'usr_234',
    caseId: 'case_234',
    metadata: { confidenceScore: 0.62, taskType: 'forensic_analysis' },
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert_2',
    type: 'user_dispute',
    severity: 'warning',
    title: 'User Disputed AI Output',
    description: 'User marked the generated grievance letter as inaccurate',
    userId: 'usr_127',
    caseId: 'case_891',
    metadata: { documentType: 'grievance_letter', issue: 'incorrect_dates' },
    isRead: false,
    isResolved: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert_3',
    type: 'ai_insight',
    severity: 'info',
    title: 'New Pattern Discovered',
    description: 'AI detected a recurring pattern in retail sector dismissals',
    metadata: { patternType: 'employer_response', sector: 'retail', confidence: 0.78 },
    isRead: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

// GET /api/admin/alerts
// Returns system alerts with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const severity = searchParams.get('severity')
  const resolved = searchParams.get('resolved')
  const limit = parseInt(searchParams.get('limit') || '50')

  let alerts = [...demoAlerts]

  // Apply filters
  if (severity) {
    alerts = alerts.filter(a => a.severity === severity)
  }
  if (resolved !== null) {
    alerts = alerts.filter(a => a.isResolved === (resolved === 'true'))
  }

  // Sort by severity and date
  alerts.sort((a, b) => {
    const severityOrder = { urgent: 0, critical: 1, warning: 2, info: 3 }
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity]
    if (severityDiff !== 0) return severityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const stats = {
    total: demoAlerts.length,
    unread: demoAlerts.filter(a => !a.isRead).length,
    critical: demoAlerts.filter(a => a.severity === 'critical').length,
    warning: demoAlerts.filter(a => a.severity === 'warning').length,
    info: demoAlerts.filter(a => a.severity === 'info').length,
    resolved: demoAlerts.filter(a => a.isResolved).length,
  }

  return NextResponse.json({
    alerts: alerts.slice(0, limit),
    stats,
    timestamp: new Date().toISOString(),
  })
}

// POST /api/admin/alerts
// Create a new system alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, severity, title, description, userId, caseId, metadata } = body

    // In production, this would insert into the system_alerts table
    const newAlert: SystemAlert = {
      id: `alert_${Date.now()}`,
      type,
      severity,
      title,
      description,
      userId,
      caseId,
      metadata: metadata || {},
      isRead: false,
      isResolved: false,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      alert: newAlert,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/alerts
// Update alert status (mark as read, resolve, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId, action, resolutionNotes } = body

    switch (action) {
      case 'mark_read':
        return NextResponse.json({
          success: true,
          message: 'Alert marked as read',
        })

      case 'resolve':
        return NextResponse.json({
          success: true,
          message: 'Alert resolved',
          resolvedAt: new Date().toISOString(),
          resolutionNotes,
        })

      case 'dismiss':
        return NextResponse.json({
          success: true,
          message: 'Alert dismissed',
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}
