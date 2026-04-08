'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  RefreshCw,
  Play,
  Pause,
  History,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  BarChart3,
  GitBranch
} from 'lucide-react'

const confidenceWeights = [
  { 
    taskType: 'forensic_analysis', 
    name: 'Forensic Analysis', 
    baseConfidence: 0.78, 
    currentConfidence: 0.84,
    totalPredictions: 1247,
    successfulPredictions: 1047,
    trend: '+7.7%'
  },
  { 
    taskType: 'document_generation', 
    name: 'Document Generation', 
    baseConfidence: 0.82, 
    currentConfidence: 0.91,
    totalPredictions: 3456,
    successfulPredictions: 3145,
    trend: '+11.0%'
  },
  { 
    taskType: 'timeline_analysis', 
    name: 'Timeline Analysis', 
    baseConfidence: 0.85, 
    currentConfidence: 0.89,
    totalPredictions: 892,
    successfulPredictions: 794,
    trend: '+4.7%'
  },
  { 
    taskType: 'contradiction_detection', 
    name: 'Contradiction Detection', 
    baseConfidence: 0.75, 
    currentConfidence: 0.83,
    totalPredictions: 567,
    successfulPredictions: 470,
    trend: '+10.7%'
  },
  { 
    taskType: 'compensation_calculation', 
    name: 'Compensation Calculation', 
    baseConfidence: 0.88, 
    currentConfidence: 0.94,
    totalPredictions: 2134,
    successfulPredictions: 2006,
    trend: '+6.8%'
  },
  { 
    taskType: 'content_generation', 
    name: 'Content Generation', 
    baseConfidence: 0.80, 
    currentConfidence: 0.87,
    totalPredictions: 1876,
    successfulPredictions: 1632,
    trend: '+8.8%'
  },
]

const recentLearnings = [
  {
    id: 1,
    type: 'pattern',
    title: 'New Employer Response Pattern',
    description: 'Identified common deflection tactics in retail sector ET3 responses',
    impact: 'High',
    timestamp: '2 hours ago',
    status: 'applied'
  },
  {
    id: 2,
    type: 'improvement',
    title: 'Grievance Letter Tone Optimization',
    description: 'Adjusted formal tone based on 87% positive user feedback',
    impact: 'Medium',
    timestamp: '4 hours ago',
    status: 'applied'
  },
  {
    id: 3,
    type: 'correction',
    title: 'Vento Band Calculation Update',
    description: 'Corrected lower band range for 2025/26 tribunal guidelines',
    impact: 'Critical',
    timestamp: '6 hours ago',
    status: 'applied'
  },
  {
    id: 4,
    type: 'pattern',
    title: 'Whistleblowing Case Pattern',
    description: 'Discovered timeline gap correlation in NHS whistleblowing cases',
    impact: 'High',
    timestamp: '8 hours ago',
    status: 'pending'
  },
  {
    id: 5,
    type: 'feedback',
    title: 'User Edit Analysis',
    description: 'Users frequently modify witness statement introductions - analyzing patterns',
    impact: 'Medium',
    timestamp: '12 hours ago',
    status: 'processing'
  },
]

const learningSessions = [
  { date: 'Today', processed: 47, improvements: 12, patterns: 7, accuracy: '87%' },
  { date: 'Yesterday', processed: 52, improvements: 8, patterns: 5, accuracy: '84%' },
  { date: '2 days ago', processed: 38, improvements: 6, patterns: 3, accuracy: '82%' },
  { date: '3 days ago', processed: 41, improvements: 9, patterns: 4, accuracy: '85%' },
  { date: '4 days ago', processed: 45, improvements: 7, patterns: 6, accuracy: '83%' },
]

export default function AILearningPage() {
  const [isLearningActive, setIsLearningActive] = useState(true)
  const [autoApply, setAutoApply] = useState(true)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Learning Engine</h1>
          <p className="text-muted-foreground">
            Self-improvement metrics and pattern discovery
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto-Apply Improvements</span>
            <Switch checked={autoApply} onCheckedChange={setAutoApply} />
          </div>
          <Button 
            variant={isLearningActive ? "destructive" : "default"}
            onClick={() => setIsLearningActive(!isLearningActive)}
          >
            {isLearningActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Learning
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume Learning
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Learning Status */}
      <Card className={`border-2 ${isLearningActive ? 'border-green-500/30 bg-green-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isLearningActive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="font-medium">
                {isLearningActive ? 'Learning Engine Active' : 'Learning Engine Paused'}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Tasks in Queue: </span>
                <span className="font-mono">23</span>
              </div>
              <div>
                <span className="text-muted-foreground">Processing Rate: </span>
                <span className="font-mono">4.2/min</span>
              </div>
              <div>
                <span className="text-muted-foreground">Next Calibration: </span>
                <span className="font-mono">47 min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Weights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-500" />
            Confidence Weights by Task Type
          </CardTitle>
          <CardDescription>
            AI performance tracking and automatic calibration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {confidenceWeights.map((weight) => (
              <div key={weight.taskType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{weight.name}</span>
                    <Badge variant="outline" className="text-green-500 border-green-500/30">
                      {weight.trend}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {weight.successfulPredictions.toLocaleString()}/{weight.totalPredictions.toLocaleString()} successful
                    </span>
                    <span className="font-mono text-lg font-bold text-purple-500">
                      {(weight.currentConfidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">
                    Base: {(weight.baseConfidence * 100)}%
                  </span>
                  <Progress 
                    value={weight.currentConfidence * 100} 
                    className="h-3 flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-16 text-right">
                    Current: {(weight.currentConfidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning History */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Learnings */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-gold" />
              Recent Learnings & Discoveries
            </CardTitle>
            <CardDescription>
              Patterns, improvements, and corrections applied to the model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentLearnings.map((learning) => (
                  <div
                    key={learning.id}
                    className="p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          learning.type === 'pattern' ? 'bg-gold/20 text-gold' :
                          learning.type === 'improvement' ? 'bg-green-500/20 text-green-500' :
                          learning.type === 'correction' ? 'bg-red-500/20 text-red-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {learning.type === 'pattern' && <GitBranch className="h-5 w-5" />}
                          {learning.type === 'improvement' && <TrendingUp className="h-5 w-5" />}
                          {learning.type === 'correction' && <AlertTriangle className="h-5 w-5" />}
                          {learning.type === 'feedback' && <BarChart3 className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{learning.title}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              learning.impact === 'Critical' ? 'border-red-500 text-red-500' :
                              learning.impact === 'High' ? 'border-gold text-gold' :
                              'border-muted-foreground text-muted-foreground'
                            }`}>
                              {learning.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {learning.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {learning.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {learning.status === 'applied' && (
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Applied
                          </Badge>
                        )}
                        {learning.status === 'pending' && (
                          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {learning.status === 'processing' && (
                          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Processing
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Learning Sessions Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Learning Sessions
            </CardTitle>
            <CardDescription>Daily processing summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningSessions.map((session, i) => (
                <div 
                  key={session.date}
                  className={`p-3 rounded-lg ${i === 0 ? 'bg-gold/10 border border-gold/20' : 'bg-muted/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{session.date}</span>
                    <Badge variant="outline">{session.accuracy}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <p className="text-lg font-bold">{session.processed}</p>
                      <p className="text-xs text-muted-foreground">Processed</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-500">{session.improvements}</p>
                      <p className="text-xs text-muted-foreground">Improved</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gold">{session.patterns}</p>
                      <p className="text-xs text-muted-foreground">Patterns</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
          <CardDescription>
            Override automatic learning when needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Force Calibration
            </Button>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              Rollback Last Change
            </Button>
            <Button variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Reset to Baseline
            </Button>
            <Button variant="outline" className="text-red-500 hover:text-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              Clear Learning Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
