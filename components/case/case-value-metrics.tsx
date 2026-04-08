'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  FileText,
  Scale,
  Clock,
  Zap
} from 'lucide-react'

interface CaseMetrics {
  overall_value_score: number
  timeline_completeness: number
  letter_quality: number
  legal_accuracy: number
  processing_confidence: number
  contradictions_found: number
  gaps_detected: number
  documents_generated: string[]
}

interface CaseValueMetricsProps {
  caseId: string
  metrics: CaseMetrics | null
  onRefundRequest?: () => void
}

const REFUND_THRESHOLD = 70

export function CaseValueMetrics({ caseId, metrics, onRefundRequest }: CaseValueMetricsProps) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [refundResult, setRefundResult] = useState<{
    refunded: boolean
    reason: string
    amount?: number
  } | null>(null)

  const isAboveThreshold = metrics ? metrics.overall_value_score >= REFUND_THRESHOLD : false

  const handleRefundRequest = async (forceRefund = false) => {
    setIsRequesting(true)
    try {
      const response = await fetch('/api/refund/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, forceRefund })
      })
      const result = await response.json()
      setRefundResult(result)
      if (onRefundRequest) onRefundRequest()
    } catch (error) {
      console.error('Refund request failed:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (!metrics) {
    return (
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            No Metrics Available
          </CardTitle>
          <CardDescription>
            Case processing has not completed yet. Full refund eligible if no value delivered.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => handleRefundRequest(true)}
            disabled={isRequesting}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isRequesting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Request Full Refund'
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (refundResult) {
    return (
      <Card className={refundResult.refunded ? 'border-green-500 bg-green-500/5' : 'border-muted'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {refundResult.refunded ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Refund Approved
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-muted-foreground" />
                Refund Not Required
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{refundResult.reason}</p>
          {refundResult.refunded && refundResult.amount && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-2xl font-bold text-green-500">
                £{refundResult.amount.toFixed(2)} refunded
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Processing time: {'<'} 5 minutes
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-gold" />
              Case Value Metrics
            </CardTitle>
            <CardDescription>
              Real-time AI quality assessment - cryptographically verified
            </CardDescription>
          </div>
          <Badge variant={isAboveThreshold ? 'default' : 'destructive'}>
            {isAboveThreshold ? 'Above Threshold' : 'Below Threshold'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Value Score */}
        <div className="p-4 rounded-lg bg-muted/30 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Value Score</span>
            <span className={`text-2xl font-bold ${getScoreColor(metrics.overall_value_score)}`}>
              {metrics.overall_value_score}%
            </span>
          </div>
          <Progress 
            value={metrics.overall_value_score} 
            className="h-3"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Refund threshold: {REFUND_THRESHOLD}%
          </p>
        </div>

        {/* Individual Metrics */}
        <div className="grid gap-4">
          <MetricRow 
            icon={Clock}
            label="Timeline Completeness"
            value={metrics.timeline_completeness}
            target={90}
          />
          <MetricRow 
            icon={Zap}
            label="Contradictions Found"
            value={metrics.contradictions_found}
            isCount
            target={5}
          />
          <MetricRow 
            icon={FileText}
            label="Document Quality"
            value={metrics.letter_quality}
            target={85}
          />
          <MetricRow 
            icon={Scale}
            label="Legal Accuracy"
            value={metrics.legal_accuracy}
            target={80}
          />
          <MetricRow 
            icon={TrendingUp}
            label="Processing Confidence"
            value={metrics.processing_confidence}
            target={75}
          />
        </div>

        {/* Documents Generated */}
        {metrics.documents_generated && metrics.documents_generated.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Documents Generated</p>
            <div className="flex flex-wrap gap-2">
              {metrics.documents_generated.map((doc, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Guarantee Status */}
        <div className={`p-4 rounded-lg border ${
          isAboveThreshold 
            ? 'bg-green-500/5 border-green-500/30' 
            : 'bg-red-500/5 border-red-500/30'
        }`}>
          {isAboveThreshold ? (
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-500">
                  Your case is above the {REFUND_THRESHOLD}% refund threshold.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  AI has delivered verified value. Full guarantee protection active.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-500">
                    Your case is below the {REFUND_THRESHOLD}% refund threshold.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You are eligible for an automatic full refund.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => handleRefundRequest(false)}
                disabled={isRequesting}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isRequesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing Refund...
                  </>
                ) : (
                  'Request Automatic Refund'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* No Questions Asked Option */}
        {isAboveThreshold && (
          <div className="pt-2 text-center">
            <button
              onClick={() => handleRefundRequest(true)}
              disabled={isRequesting}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Not satisfied? Request refund anyway (no questions asked)
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricRow({ 
  icon: Icon, 
  label, 
  value, 
  target,
  isCount = false 
}: { 
  icon: typeof Clock
  label: string
  value: number
  target: number
  isCount?: boolean
}) {
  const percentage = isCount ? Math.min((value / target) * 100, 100) : value
  const displayValue = isCount ? value : `${value}%`
  const displayTarget = isCount ? `${target}+` : `${target}%`
  
  const getColor = () => {
    if (isCount) {
      return value >= target ? 'text-green-500' : 'text-yellow-500'
    }
    if (value >= target) return 'text-green-500'
    if (value >= target * 0.7) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">{label}</span>
          <span className={`text-sm font-medium ${getColor()}`}>
            {displayValue}
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${
              percentage >= 80 ? 'bg-green-500' : 
              percentage >= 60 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Target: {displayTarget}
        </p>
      </div>
    </div>
  )
}
