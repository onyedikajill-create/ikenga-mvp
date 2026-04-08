import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

// Refund thresholds - automatically trigger refund if below these values
const REFUND_THRESHOLDS = {
  overall_value_score: 50,
  timeline_completeness: 60,
  legal_accuracy: 40,
  processing_confidence: 30,
  letter_quality: 50,
}

interface CaseMetrics {
  overall_value_score: number
  timeline_completeness: number
  legal_accuracy: number
  processing_confidence: number
  letter_quality: number
  timeline_quality: number
  contradictions_found: number
  documents_generated: string[]
}

function checkRefundEligibility(metrics: CaseMetrics): { eligible: boolean; reason: string; percentage: number } {
  // Check each threshold
  if (metrics.overall_value_score < REFUND_THRESHOLDS.overall_value_score) {
    return {
      eligible: true,
      reason: `Overall value score ${metrics.overall_value_score}% is below ${REFUND_THRESHOLDS.overall_value_score}% threshold`,
      percentage: 100
    }
  }

  if (metrics.timeline_completeness < REFUND_THRESHOLDS.timeline_completeness) {
    return {
      eligible: true,
      reason: `Timeline completeness ${metrics.timeline_completeness}% is below ${REFUND_THRESHOLDS.timeline_completeness}% threshold`,
      percentage: 100
    }
  }

  if (metrics.legal_accuracy < REFUND_THRESHOLDS.legal_accuracy) {
    return {
      eligible: true,
      reason: `Legal accuracy ${metrics.legal_accuracy}% is below ${REFUND_THRESHOLDS.legal_accuracy}% threshold`,
      percentage: 100
    }
  }

  if (metrics.processing_confidence < REFUND_THRESHOLDS.processing_confidence) {
    return {
      eligible: true,
      reason: `Processing confidence ${metrics.processing_confidence}% is below ${REFUND_THRESHOLDS.processing_confidence}% threshold`,
      percentage: 100
    }
  }

  if (metrics.letter_quality < REFUND_THRESHOLDS.letter_quality) {
    return {
      eligible: true,
      reason: `Letter quality ${metrics.letter_quality}% is below ${REFUND_THRESHOLDS.letter_quality}% threshold`,
      percentage: 100
    }
  }

  // No documents generated
  if (!metrics.documents_generated || metrics.documents_generated.length === 0) {
    return {
      eligible: true,
      reason: 'No documents were generated',
      percentage: 100
    }
  }

  // All metrics above threshold
  return {
    eligible: false,
    reason: `All metrics above threshold (overall value: ${metrics.overall_value_score}%)`,
    percentage: 0
  }
}

export async function POST(request: Request) {
  try {
    const { caseId, forceRefund = false } = await request.json()

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get case and verify ownership
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('*, payments(*)')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }

    // Get case quality metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('case_quality_metrics')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // If no metrics, automatic refund (system failed to process)
    if (metricsError || !metrics) {
      // Process automatic refund
      const refundAmount = caseData.payments?.[0]?.amount || 0

      const { data: refund, error: refundError } = await supabase
        .from('refund_guarantees')
        .insert({
          case_id: caseId,
          user_id: user.id,
          value_score: 0,
          timeline_score: 0,
          quality_score: 0,
          legal_accuracy_score: 0,
          refund_triggered: true,
          refund_reason: 'No processing metrics found - automatic refund',
          refund_amount: refundAmount,
          status: 'approved'
        })
        .select()
        .single()

      if (refundError) {
        console.error('Refund creation error:', refundError)
        return NextResponse.json(
          { error: 'Failed to process refund' },
          { status: 500 }
        )
      }

      // Log dispute for AI learning
      await supabase.from('dispute_history').insert({
        case_id: caseId,
        user_id: user.id,
        refund_id: refund.id,
        dispute_type: 'system_error',
        resolution: 'auto_refunded'
      })

      return NextResponse.json({
        refunded: true,
        amount: refundAmount,
        reason: 'No processing metrics found - automatic refund',
        refundId: refund.id,
        processingTime: '< 5 minutes'
      })
    }

    // Check refund eligibility based on metrics
    const eligibility = checkRefundEligibility(metrics as CaseMetrics)

    if (eligibility.eligible || forceRefund) {
      const refundAmount = caseData.payments?.[0]?.amount || 0
      const finalAmount = (refundAmount * eligibility.percentage) / 100

      // Create refund record
      const { data: refund, error: refundError } = await supabase
        .from('refund_guarantees')
        .insert({
          case_id: caseId,
          user_id: user.id,
          value_score: metrics.overall_value_score,
          timeline_score: metrics.timeline_completeness,
          quality_score: metrics.letter_quality,
          legal_accuracy_score: metrics.legal_accuracy,
          refund_triggered: true,
          refund_reason: forceRefund ? 'User requested refund (no questions asked)' : eligibility.reason,
          refund_amount: finalAmount,
          status: 'approved'
        })
        .select()
        .single()

      if (refundError) {
        console.error('Refund creation error:', refundError)
        return NextResponse.json(
          { error: 'Failed to process refund' },
          { status: 500 }
        )
      }

      // Log dispute for AI learning
      await supabase.from('dispute_history').insert({
        case_id: caseId,
        user_id: user.id,
        refund_id: refund.id,
        dispute_type: forceRefund ? 'user_dissatisfied' : 'low_value',
        resolution: 'auto_refunded'
      })

      // TODO: Process actual Stripe refund here
      // await stripe.refunds.create({ payment_intent: caseData.payments[0].stripe_payment_intent_id })

      return NextResponse.json({
        refunded: true,
        amount: finalAmount,
        reason: forceRefund ? 'User requested refund (no questions asked)' : eligibility.reason,
        refundId: refund.id,
        metrics: {
          valueScore: metrics.overall_value_score,
          timelineCompleteness: metrics.timeline_completeness,
          legalAccuracy: metrics.legal_accuracy,
          processingConfidence: metrics.processing_confidence,
          letterQuality: metrics.letter_quality
        },
        processingTime: '< 5 minutes'
      })
    }

    // Not eligible for automatic refund
    return NextResponse.json({
      refunded: false,
      reason: eligibility.reason,
      metrics: {
        valueScore: metrics.overall_value_score,
        timelineCompleteness: metrics.timeline_completeness,
        legalAccuracy: metrics.legal_accuracy,
        processingConfidence: metrics.processing_confidence,
        letterQuality: metrics.letter_quality
      },
      thresholds: REFUND_THRESHOLDS,
      message: 'Your case metrics are above the refund threshold. If you still wish to request a refund, use the "force refund" option.'
    })

  } catch (error) {
    console.error('Refund request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Check refund eligibility without processing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const caseId = searchParams.get('caseId')

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get case quality metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('case_quality_metrics')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (metricsError || !metrics) {
      return NextResponse.json({
        eligible: true,
        reason: 'No processing metrics found - eligible for automatic refund',
        metrics: null
      })
    }

    const eligibility = checkRefundEligibility(metrics as CaseMetrics)

    return NextResponse.json({
      eligible: eligibility.eligible,
      reason: eligibility.reason,
      refundPercentage: eligibility.percentage,
      metrics: {
        valueScore: metrics.overall_value_score,
        timelineCompleteness: metrics.timeline_completeness,
        legalAccuracy: metrics.legal_accuracy,
        processingConfidence: metrics.processing_confidence,
        letterQuality: metrics.letter_quality,
        contradictionsFound: metrics.contradictions_found,
        documentsGenerated: metrics.documents_generated
      },
      thresholds: REFUND_THRESHOLDS
    })

  } catch (error) {
    console.error('Refund eligibility check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
