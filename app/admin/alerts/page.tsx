'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Eye,
  MessageSquare,
  User,
  Briefcase,
  Brain,
  Shield,
  CreditCard,
  Server,
  ChevronRight
} from 'lucide-react'

const allAlerts = [
  {
    id: 1,
    type: 'low_confidence',
    severity: 'warning',
    title: 'Low AI Confidence Score',
    description: 'Forensic analysis for case #234 returned 62% confidence. The ET3 response contains unusual language patterns that may require human review.',
    user: 'Sarah Mitchell',
    userId: 'usr_234',
    caseId: 'case_234',
    timestamp: '15 minutes ago',
    isRead: false,
    isResolved: false,
  },
  {
    id: 2,
    type: 'user_dispute',
    severity: 'warning',
    title: 'User Disputed AI Output',
    description: 'User marked the generated grievance letter as "inaccurate". They noted that the dates mentioned were incorrect.',
    user: 'James Thompson',
    userId: 'usr_127',
    caseId: 'case_891',
    timestamp: '1 hour ago',
    isRead: false,
    isResolved: false,
  },
  {
    id: 3,
    type: 'ai_insight',
    severity: 'info',
    title: 'New Pattern Discovered',
    description: 'AI detected a recurring pattern in retail sector dismissals: 78% involve performance improvement plans that lack SMART objectives.',
    timestamp: '2 hours ago',
    isRead: true,
    isResolved: false,
  },
  {
    id: 4,
    type: 'payment_issue',
    severity: 'critical',
    title: 'Failed Payment - Pro Subscription',
    description: 'Bank transfer verification failed for user. Amount: £79.00 (Annual Pro). Reference provided does not match.',
    user: 'David Chen',
    userId: 'usr_456',
    timestamp: '3 hours ago',
    isRead: true,
    isResolved: false,
  },
  {
    id: 5,
    type: 'system_error',
    severity: 'critical',
    title: 'Groq API Rate Limit Warning',
    description: 'Approaching 80% of daily Groq API rate limit. Current usage: 78,432 / 100,000 tokens.',
    timestamp: '4 hours ago',
    isRead: true,
    isResolved: true,
    resolvedBy: 'System Auto-Resolved',
    resolutionNotes: 'Rate limit reset at midnight. No action needed.',
  },
  {
    id: 6,
    type: 'unusual_pattern',
    severity: 'warning',
    title: 'Unusual Upload Pattern Detected',
    description: 'User uploaded 47 documents in 5 minutes. This exceeds normal usage patterns and may indicate automated scraping.',
    user: 'Anonymous User',
    userId: 'usr_789',
    timestamp: '5 hours ago',
    isRead: true,
    isResolved: true,
    resolvedBy: 'Admin',
    resolutionNotes: 'Verified legitimate user - law firm paralegal batch uploading case files.',
  },
]

const alertStats = {
  total: 23,
  unread: 5,
  critical: 2,
  warning: 8,
  info: 13,
  resolved: 18,
}

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<typeof allAlerts[0] | null>(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [resolutionNote, setResolutionNote] = useState('')

  const filteredAlerts = allAlerts.filter(alert => {
    if (filter === 'unresolved' && alert.isResolved) return false
    if (filter === 'critical' && alert.severity !== 'critical') return false
    if (filter === 'warning' && alert.severity !== 'warning') return false
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_confidence': return <Brain className="h-5 w-5" />
      case 'user_dispute': return <User className="h-5 w-5" />
      case 'ai_insight': return <Brain className="h-5 w-5" />
      case 'payment_issue': return <CreditCard className="h-5 w-5" />
      case 'system_error': return <Server className="h-5 w-5" />
      case 'unusual_pattern': return <Shield className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-500 border-red-500/30'
      case 'warning': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'info': return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Alerts</h1>
          <p className="text-muted-foreground">
            Items requiring your attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-red-500 text-red-500">
            {alertStats.critical} Critical
          </Badge>
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            {alertStats.warning} Warning
          </Badge>
          <Badge variant="outline">
            {alertStats.unread} Unread
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{alertStats.total}</p>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-500">{alertStats.critical}</p>
            <p className="text-sm text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-yellow-500">{alertStats.warning}</p>
            <p className="text-sm text-muted-foreground">Warning</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-500">{alertStats.info}</p>
            <p className="text-sm text-muted-foreground">Info</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-500">{alertStats.resolved}</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Alerts List */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>All Alerts</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search alerts..." 
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={setFilter} className="mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unresolved">Unresolved</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="warning">Warning</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Alert Items */}
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedAlert?.id === alert.id 
                        ? 'border-gold bg-gold/5' 
                        : 'border-border hover:border-muted-foreground/50 hover:bg-muted/50'
                    } ${!alert.isRead ? 'border-l-4 border-l-gold' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{alert.title}</h4>
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          {alert.isResolved && (
                            <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          {alert.user && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {alert.user}
                            </span>
                          )}
                          {alert.caseId && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {alert.caseId}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alert Detail */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Details</CardTitle>
            <CardDescription>
              {selectedAlert ? 'Review and take action' : 'Select an alert to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAlert ? (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${getSeverityColor(selectedAlert.severity)}`}>
                  <div className="flex items-center gap-2">
                    {getAlertIcon(selectedAlert.type)}
                    <span className="font-medium capitalize">{selectedAlert.type.replace('_', ' ')}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{selectedAlert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedAlert.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Time</span>
                    <span>{selectedAlert.timestamp}</span>
                  </div>
                  {selectedAlert.user && (
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">User</span>
                      <span>{selectedAlert.user}</span>
                    </div>
                  )}
                  {selectedAlert.caseId && (
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Case</span>
                      <Button variant="link" className="h-auto p-0">{selectedAlert.caseId}</Button>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={selectedAlert.isResolved ? "default" : "destructive"}>
                      {selectedAlert.isResolved ? 'Resolved' : 'Open'}
                    </Badge>
                  </div>
                </div>

                {selectedAlert.isResolved ? (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm font-medium text-green-500">Resolution</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedAlert.resolutionNotes}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Resolved by: {selectedAlert.resolvedBy}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Textarea 
                      placeholder="Add resolution notes..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Case
                      </Button>
                    </div>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact User
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an alert from the list to view details and take action</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
