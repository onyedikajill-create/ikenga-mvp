'use client'

import { useState, useEffect } from 'react'
import { CaseValueMetrics } from './case-value-metrics'

interface CaseValueMetricsWrapperProps {
  caseId: string
}

export function CaseValueMetricsWrapper({ caseId }: CaseValueMetricsWrapperProps) {
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/case/metrics?caseId=${caseId}`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data.latestMetrics || null)
        }
      } catch (error) {
        console.error('Failed to fetch case metrics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [caseId])

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-card border border-border animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <CaseValueMetrics 
      caseId={caseId} 
      metrics={metrics}
      onRefundRequest={() => {
        // Optionally refresh metrics after refund request
      }}
    />
  )
}
