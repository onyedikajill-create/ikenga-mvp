'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  Briefcase,
  FileText,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  DollarSign,
  RefreshCw,
  Eye,
  ArrowUpRight,
  Server,
  Database,
  Cpu,
  Wifi
} from 'lucide-react'

// Demo metrics - in production these come from the API
const initialMetrics = {
  activeUsers: 342,
  newUsersToday: 23,
  casesToday: 47,
  documentsGenerated: 156,
  forensicAudits: 34,
  contentPosts: 89,
  revenueToday: 1247.50,
  revenueMonth: 34892.00,
  aiTokensUsed: 892456,
  avgConfidence: 0.847,
  avgResponseTime: 1247,
  errorRate: 0.3,
  improvements: 12,
  patternsLearned: 7,
}

const systemStatus = {
  groq: { status: 'operational', latency: 234 },
  supabase: { status: 'operational', latency: 45 },
  stripe: { status: 'operational', latency: 187 },
  storage: { status: 'operational', latency: 89 },
}

const recentActivity = [
  { id: 1, action: 'User 342 uploaded 12 documents', time: '2 mins ago', type: 'upload' },
  { id: 2, action: 'AI generated timeline for case 891', time: '5 mins ago', type: 'ai' },
  { id: 3, action: 'Pro upgrade completed by user 127', time: '8 mins ago', type: 'payment' },
  { id: 4, action: 'Forensic audit completed - 3 contradictions found', time: '12 mins ago', type: 'ai' },
  { id: 5, action: 'New case created: Unfair Dismissal', time: '15 mins ago', type: 'case' },
  { id: 6, action: 'ET1 draft generated for case 456', time: '18 mins ago', type: 'document' },
  { id: 7, action: 'User disputed AI output - flagged for review', time: '22 mins ago', type: 'alert' },
  { id: 8, action: 'LinkedIn post scheduled for user 89', time: '25 mins ago', type: 'content' },
]

const pendingAlerts = [
  { 
    id: 1, 
    severity: 'warning', 
    title: 'Low AI Confidence Score', 
    description: 'Forensic analysis for case 234 returned 62% confidence',
    time: '15 mins ago'
  },
  { 
    id: 2, 
    severity: 'info', 
    title: 'User Feedback Received', 
    description: 'User 127 rated document generation 5/5 stars',
    time: '1 hour ago'
  },
  { 
    id: 3, 
    severity: 'warning', 
    title: 'AI Insight Available', 
    description: 'New pattern discovered in constructive dismissal cases',
    time: '2 hours ago'
  },
]

const aiLearnings = [
  { type: 'improvement', text: 'Constructive dismissal arguments improved 23%' },
  { type: 'improvement', text: 'Vento band calculations refined for 2025/26' },
  { type: 'improvement', text: 'ACAS early conciliation scripts optimized' },
  { type: 'pattern', text: 'New contradiction pattern discovered in performance plans' },
  { type: 'pattern', text: 'Employer response patterns identified in retail sector' },
]

export default function SuperDashboardPage() {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        aiTokensUsed: prev.aiTokensUsed + Math.floor(Math.random() * 1000),
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Super Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time system monitoring and AI performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Bar */}
      <Card className="bg-card/50 border-gold/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-muted-foreground">System Status:</span>
              {Object.entries(systemStatus).map(([name, data]) => (
                <div key={name} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    data.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className="text-sm capitalize">{name}</span>
                  <span className="text-xs text-muted-foreground">{data.latency}ms</span>
                </div>
              ))}
            </div>
            <Badge variant="outline" className="border-green-500 text-green-500">
              All Systems Operational
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-gold">{metrics.activeUsers}</p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{metrics.newUsersToday} today
                </p>
              </div>
              <Users className="h-10 w-10 text-gold/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cases Today</p>
                <p className="text-3xl font-bold text-blue-500">{metrics.casesToday}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.forensicAudits} audits run
                </p>
              </div>
              <Briefcase className="h-10 w-10 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-3xl font-bold text-green-500">
                  £{metrics.revenueToday.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  £{metrics.revenueMonth.toLocaleString()} this month
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-3xl font-bold text-purple-500">
                  {(metrics.avgConfidence * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2% this week
                </p>
              </div>
              <Brain className="h-10 w-10 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gold" />
                  Live Activity Feed
                </CardTitle>
                <CardDescription>Real-time user actions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'ai' ? 'bg-purple-500/20 text-purple-500' :
                      activity.type === 'payment' ? 'bg-green-500/20 text-green-500' :
                      activity.type === 'alert' ? 'bg-yellow-500/20 text-yellow-500' :
                      activity.type === 'upload' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {activity.type === 'ai' && <Brain className="h-4 w-4" />}
                      {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                      {activity.type === 'alert' && <AlertTriangle className="h-4 w-4" />}
                      {activity.type === 'upload' && <FileText className="h-4 w-4" />}
                      {activity.type === 'case' && <Briefcase className="h-4 w-4" />}
                      {activity.type === 'document' && <FileText className="h-4 w-4" />}
                      {activity.type === 'content' && <Zap className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card className="border-yellow-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Pending Alerts
                </CardTitle>
                <CardDescription>Items needing attention</CardDescription>
              </div>
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                {pendingAlerts.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'warning' 
                      ? 'border-yellow-500/30 bg-yellow-500/5' 
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Learning Section */}
      <Card className="border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Learning Metrics - Last 24 Hours
              </CardTitle>
              <CardDescription>Self-improvement progress and discoveries</CardDescription>
            </div>
            <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">
              +{metrics.improvements} improvements
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{metrics.casesToday}</p>
              <p className="text-sm text-muted-foreground">Cases Processed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-green-500">87%</p>
              <p className="text-sm text-muted-foreground">Successful Outcomes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-purple-500">{metrics.improvements}</p>
              <p className="text-sm text-muted-foreground">Improvements Made</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold text-gold">{metrics.patternsLearned}</p>
              <p className="text-sm text-muted-foreground">Patterns Learned</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">HOT LEARNINGS TODAY:</p>
            <div className="space-y-2">
              {aiLearnings.map((learning, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/30">
                  {learning.type === 'improvement' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <Zap className="h-4 w-4 text-gold" />
                  )}
                  <span className="text-sm">{learning.text}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Performance</CardTitle>
            <CardDescription>Response times and throughput</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Response Time</span>
              <span className="font-mono text-sm">{metrics.avgResponseTime}ms</span>
            </div>
            <Progress value={75} className="h-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <span className="font-mono text-sm text-green-500">{metrics.errorRate}%</span>
            </div>
            <Progress value={3} className="h-2" />

            <div className="flex items-center justify-between">
              <span className="text-sm">AI Tokens Used Today</span>
              <span className="font-mono text-sm">{metrics.aiTokensUsed.toLocaleString()}</span>
            </div>
            <Progress value={45} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>AI workload breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Document Generation', value: metrics.documentsGenerated, max: 200 },
              { name: 'Forensic Analysis', value: metrics.forensicAudits, max: 50 },
              { name: 'Content Creation', value: metrics.contentPosts, max: 100 },
              { name: 'Timeline Building', value: 28, max: 50 },
            ].map((task) => (
              <div key={task.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{task.name}</span>
                  <span className="font-mono">{task.value}</span>
                </div>
                <Progress value={(task.value / task.max) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
