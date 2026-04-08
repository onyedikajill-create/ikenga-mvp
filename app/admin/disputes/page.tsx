'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Download,
  Brain,
  Zap
} from 'lucide-react'

// Demo data - in production this comes from Supabase
const demoDisputes = [
  {
    id: 'disp_001',
    caseId: 'case_abc123',
    userEmail: 'john.doe@email.com',
    disputeType: 'low_value',
    valueScore: 45,
    timelineScore: 55,
    qualityScore: 40,
    legalAccuracyScore: 60,
    refundAmount: 49.00,
    status: 'auto_refunded',
    createdAt: '2026-04-08T10:30:00Z',
    resolution: 'Automatic refund - value score below 50% threshold',
    learningExtracted: true,
    improvement: 'Prompt optimized for better timeline generation'
  },
  {
    id: 'disp_002',
    caseId: 'case_def456',
    userEmail: 'jane.smith@email.com',
    disputeType: 'incomplete_timeline',
    valueScore: 62,
    timelineScore: 48,
    qualityScore: 70,
    legalAccuracyScore: 68,
    refundAmount: 49.00,
    status: 'auto_refunded',
    createdAt: '2026-04-08T09:15:00Z',
    resolution: 'Automatic refund - timeline completeness below 60%',
    learningExtracted: true,
    improvement: 'Added gap detection validation'
  },
  {
    id: 'disp_003',
    caseId: 'case_ghi789',
    userEmail: 'bob.wilson@email.com',
    disputeType: 'user_dissatisfied',
    valueScore: 78,
    timelineScore: 82,
    qualityScore: 75,
    legalAccuracyScore: 80,
    refundAmount: 49.00,
    status: 'auto_refunded',
    createdAt: '2026-04-07T16:45:00Z',
    resolution: 'No questions asked refund - user requested',
    learningExtracted: false,
    improvement: null
  }
]

const demoMetrics = {
  totalDisputes: 3,
  autoRefunded: 3,
  manualReview: 0,
  denied: 0,
  totalRefundAmount: 147.00,
  refundRate: 1.2,
  avgValueScore: 61.7,
  improvementsMade: 2
}

export default function DisputeDashboardPage() {
  const [disputes, setDisputes] = useState(demoDisputes)
  const [metrics, setMetrics] = useState(demoMetrics)
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredDisputes = disputes.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    if (search && !d.userEmail.toLowerCase().includes(search.toLowerCase()) && 
        !d.caseId.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'auto_refunded':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Auto Refunded</Badge>
      case 'manual_review':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Manual Review</Badge>
      case 'denied':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Denied</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDisputeTypeBadge = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      low_value: { label: 'Low Value', color: 'text-red-500' },
      incomplete_timeline: { label: 'Incomplete Timeline', color: 'text-orange-500' },
      inaccurate_analysis: { label: 'Inaccurate Analysis', color: 'text-red-500' },
      missing_contradictions: { label: 'Missing Contradictions', color: 'text-yellow-500' },
      unusable_documents: { label: 'Unusable Docs', color: 'text-red-500' },
      system_error: { label: 'System Error', color: 'text-purple-500' },
      user_dissatisfied: { label: 'User Request', color: 'text-blue-500' }
    }
    const t = types[type] || { label: type, color: 'text-muted-foreground' }
    return <span className={`text-xs font-medium ${t.color}`}>{t.label}</span>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dispute Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor refunds, disputes, and AI learning improvements
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Disputes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">0</div>
            <p className="text-xs text-muted-foreground">All resolved automatically</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Auto-Refunded Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.autoRefunded}</div>
            <p className="text-xs text-muted-foreground">
              £{metrics.totalRefundAmount.toFixed(2)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Refund Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{metrics.refundRate}%</span>
              <TrendingDown className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground">Industry avg: 5-8%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Improvements Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gold">{metrics.improvementsMade}</span>
              <Brain className="h-5 w-5 text-gold" />
            </div>
            <p className="text-xs text-muted-foreground">From dispute learnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Guarantee Status */}
      <Card className="border-gold/30 bg-gold/5">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold/20">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold">The IKENGA Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  No value = Full refund. Automated. No arguments.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-500">100%</div>
              <p className="text-xs text-muted-foreground">Promise Kept</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or case ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disputes</SelectItem>
            <SelectItem value="auto_refunded">Auto Refunded</SelectItem>
            <SelectItem value="manual_review">Manual Review</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Disputes</CardTitle>
          <CardDescription>
            All disputes are resolved automatically based on AI metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Learning</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-mono text-xs">
                    {dispute.caseId.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="text-sm">
                    {dispute.userEmail}
                  </TableCell>
                  <TableCell>
                    {getDisputeTypeBadge(dispute.disputeType)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-12">Value:</span>
                        <Progress value={dispute.valueScore} className="h-1.5 w-16" />
                        <span className={dispute.valueScore < 50 ? 'text-red-500' : ''}>
                          {dispute.valueScore}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-12">Timeline:</span>
                        <Progress value={dispute.timelineScore} className="h-1.5 w-16" />
                        <span className={dispute.timelineScore < 60 ? 'text-red-500' : ''}>
                          {dispute.timelineScore}%
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    £{dispute.refundAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(dispute.status)}
                  </TableCell>
                  <TableCell>
                    {dispute.learningExtracted ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <Zap className="h-3 w-3" />
                        <span className="text-xs">Applied</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Improvements from Disputes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gold" />
            AI Improvements from Disputes
          </CardTitle>
          <CardDescription>
            Every dispute teaches the system to be better
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDisputes
              .filter(d => d.improvement)
              .map((dispute) => (
                <div 
                  key={dispute.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div className="p-2 rounded-full bg-green-500/20">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{dispute.improvement}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      From case {dispute.caseId.slice(0, 8)}... - {getDisputeTypeBadge(dispute.disputeType)}
                    </p>
                  </div>
                </div>
              ))}
            {filteredDisputes.filter(d => d.improvement).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No improvements extracted yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
