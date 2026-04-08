import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

// Calculate SHA256 hash for truth chain
function calculateTruthHash(data: object): string {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      caseId,
      // Input metrics
      documentsUploaded = 0,
      totalPages = 0,
      documentTypes = [],
      // Processing metrics
      processingConfidence = 0,
      contradictionsFound = 0,
      gapsDetected = 0,
      timelineCompleteness = 0,
      // Output metrics
      documentsGenerated = [],
      estimatedCompensation = { low: 0, likely: 0, high: 0 },
      // Quality scores
      timelineQuality = 0,
      letterQuality = 0,
      legalAccuracy = 0,
    } = body

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

    // Verify case ownership
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single()

    if (caseError || !caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }

    // Calculate overall value score (weighted average)
    const overallValueScore = Math.round(
      (timelineCompleteness * 0.25) +
      (letterQuality * 0.25) +
      (legalAccuracy * 0.25) +
      (processingConfidence * 0.15) +
      (Math.min(contradictionsFound * 10, 100) * 0.10)
    )

    // Create metrics record
    const metricsData = {
      case_id: caseId,
      user_id: user.id,
      documents_uploaded: documentsUploaded,
      total_pages: totalPages,
      document_types: documentTypes,
      processing_confidence: processingConfidence,
      contradictions_found: contradictionsFound,
      gaps_detected: gapsDetected,
      timeline_completeness: timelineCompleteness,
      documents_generated: documentsGenerated,
      estimated_compensation_low: estimatedCompensation.low,
      estimated_compensation_likely: estimatedCompensation.likely,
      estimated_compensation_high: estimatedCompensation.high,
      timeline_quality: timelineQuality,
      letter_quality: letterQuality,
      legal_accuracy: legalAccuracy,
      overall_value_score: overallValueScore,
    }

    const { data: metrics, error: metricsError } = await supabase
      .from('case_quality_metrics')
      .insert(metricsData)
      .select()
      .single()

    if (metricsError) {
      console.error('Metrics creation error:', metricsError)
      return NextResponse.json(
        { error: 'Failed to save metrics' },
        { status: 500 }
      )
    }

    // Create truth chain entry (cryptographic proof)
    const truthMetadata = {
      caseId,
      metricsId: metrics.id,
      timestamp: new Date().toISOString(),
      scores: {
        overall: overallValueScore,
        timeline: timelineCompleteness,
        legal: legalAccuracy,
        confidence: processingConfidence,
        quality: letterQuality
      },
      outputs: {
        documents: documentsGenerated.length,
        contradictions: contradictionsFound,
        gaps: gapsDetected
      }
    }

    const processingHash = calculateTruthHash(truthMetadata)

    // Get previous hash for chain
    const { data: lastChain } = await supabase
      .from('case_truth_chain')
      .select('processing_hash')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    await supabase.from('case_truth_chain').insert({
      case_id: caseId,
      processing_hash: processingHash,
      previous_hash: lastChain?.processing_hash || null,
      metadata: truthMetadata,
      version: '1.0.0'
    })

    // Check if this triggers automatic refund eligibility
    const refundThresholds = {
      overall_value_score: 50,
      timeline_completeness: 60,
      legal_accuracy: 40,
      processing_confidence: 30,
    }

    const isRefundEligible = 
      overallValueScore < refundThresholds.overall_value_score ||
      timelineCompleteness < refundThresholds.timeline_completeness ||
      legalAccuracy < refundThresholds.legal_accuracy ||
      processingConfidence < refundThresholds.processing_confidence

    return NextResponse.json({
      success: true,
      metricsId: metrics.id,
      overallValueScore,
      processingHash,
      isRefundEligible,
      refundThreshold: 50,
      metrics: {
        timelineCompleteness,
        letterQuality,
        legalAccuracy,
        processingConfidence,
        contradictionsFound,
        documentsGenerated: documentsGenerated.length
      }
    })

  } catch (error) {
    console.error('Case metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve case metrics
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

    // Get all metrics for case
    const { data: metrics, error: metricsError } = await supabase
      .from('case_quality_metrics')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })

    if (metricsError) {
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      )
    }

    // Get truth chain
    const { data: truthChain } = await supabase
      .from('case_truth_chain')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })

    // Calculate refund eligibility
    const latestMetrics = metrics?.[0]
    const refundThreshold = 50
    const isRefundEligible = latestMetrics 
      ? latestMetrics.overall_value_score < refundThreshold
      : true

    return NextResponse.json({
      metrics: metrics || [],
      latestMetrics,
      truthChain: truthChain || [],
      isRefundEligible,
      refundThreshold
    })

  } catch (error) {
    console.error('Get case metrics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
