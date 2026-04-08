import { NextRequest, NextResponse } from 'next/server'
import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'

// This cron job runs hourly to process AI learnings and improve the model
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/self-improve", "schedule": "0 * * * *" }] }

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

interface LearningTask {
  id: string
  taskType: string
  aiPrediction: Record<string, unknown>
  actualOutcome: Record<string, unknown>
  userFeedback: number
  confidenceScore: number
}

// Analyze user edits to find patterns
async function analyzeUserEdits(originalContent: string, editedContent: string, documentType: string) {
  const prompt = `Analyze the differences between the AI-generated content and the user's edited version.
  
Document Type: ${documentType}

ORIGINAL AI OUTPUT:
${originalContent.substring(0, 2000)}

USER'S EDITED VERSION:
${editedContent.substring(0, 2000)}

Identify:
1. What sections did the user modify most?
2. What tone/style changes were made?
3. What factual corrections were needed?
4. What patterns suggest improvements to the AI prompts?

Return a JSON object with:
{
  "modifications": ["list of key changes"],
  "toneAdjustments": "description of tone changes",
  "factualCorrections": ["list of corrections"],
  "promptImprovements": ["suggested prompt improvements"],
  "confidenceImpact": number between -0.1 and 0.1
}`

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    })
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Compare AI prediction with actual outcome
async function analyzePredictionAccuracy(task: LearningTask) {
  const prompt = `Compare the AI's prediction with the actual outcome and determine accuracy.

TASK TYPE: ${task.taskType}

AI PREDICTION:
${JSON.stringify(task.aiPrediction, null, 2)}

ACTUAL OUTCOME:
${JSON.stringify(task.actualOutcome, null, 2)}

USER FEEDBACK SCORE: ${task.userFeedback}/5

Analyze:
1. How accurate was the AI prediction?
2. What specific elements were correct/incorrect?
3. What patterns explain the discrepancy?
4. What weight adjustments should be made?

Return JSON:
{
  "accuracyScore": number 0-1,
  "correctElements": ["list"],
  "incorrectElements": ["list"],
  "patterns": ["identified patterns"],
  "weightAdjustment": number between -0.05 and 0.05,
  "learningNotes": "summary of what to learn"
}`

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    })
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Discover new patterns from successful cases
async function discoverPatterns(successfulCases: Record<string, unknown>[]) {
  const prompt = `Analyze these successful employment tribunal cases to discover reusable patterns.

SUCCESSFUL CASES:
${JSON.stringify(successfulCases.slice(0, 5), null, 2)}

Identify:
1. Common legal argument structures that worked
2. Evidence presentation patterns
3. Timeline gap exploitation strategies
4. Employer weakness patterns

Return JSON:
{
  "legalPatterns": [{"name": "", "description": "", "applicability": ""}],
  "evidencePatterns": [{"name": "", "description": ""}],
  "strategyPatterns": [{"name": "", "description": ""}],
  "newInsights": ["list of new discoveries"]
}`

  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    })
    return JSON.parse(text)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow in development without auth
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const startTime = Date.now()
  const results = {
    processed: 0,
    improved: 0,
    patternsDiscovered: 0,
    errors: 0,
    details: [] as string[],
  }

  try {
    // In production, fetch unprocessed learning tasks from Supabase
    // const { data: tasks } = await supabase
    //   .from('ai_learning_log')
    //   .select('*')
    //   .eq('is_processed', false)
    //   .limit(50)

    // Demo: Process sample tasks
    const demoTasks: LearningTask[] = [
      {
        id: '1',
        taskType: 'forensic_analysis',
        aiPrediction: { contradictions: 3, confidence: 0.78 },
        actualOutcome: { contradictions: 4, userVerified: true },
        userFeedback: 4,
        confidenceScore: 0.78,
      },
      {
        id: '2',
        taskType: 'document_generation',
        aiPrediction: { quality: 'high', tone: 'formal' },
        actualOutcome: { userEdits: 2, finalApproval: true },
        userFeedback: 5,
        confidenceScore: 0.85,
      },
    ]

    for (const task of demoTasks) {
      try {
        const analysis = await analyzePredictionAccuracy(task)
        if (analysis) {
          results.processed++
          if (analysis.weightAdjustment !== 0) {
            results.improved++
            results.details.push(
              `Task ${task.id}: ${task.taskType} - adjusted weight by ${analysis.weightAdjustment}`
            )
          }

          // In production, update the confidence weights in Supabase
          // await supabase
          //   .from('ai_confidence_weights')
          //   .update({ 
          //     current_confidence: sql`current_confidence + ${analysis.weightAdjustment}`,
          //     total_predictions: sql`total_predictions + 1`,
          //     successful_predictions: sql`successful_predictions + ${analysis.accuracyScore > 0.7 ? 1 : 0}`
          //   })
          //   .eq('task_type', task.taskType)

          // Mark task as processed
          // await supabase
          //   .from('ai_learning_log')
          //   .update({ is_processed: true, processed_at: new Date().toISOString(), improvements_made: analysis })
          //   .eq('id', task.id)
        }
      } catch (error) {
        results.errors++
        results.details.push(`Error processing task ${task.id}: ${error}`)
      }
    }

    // Discover patterns from recent successful cases
    // In production, fetch from case_outcomes table
    const successfulCases = [
      { type: 'unfair_dismissal', outcome: 'won', strategy: 'timeline_gaps' },
      { type: 'discrimination', outcome: 'settled', strategy: 'et3_contradictions' },
    ]

    if (successfulCases.length >= 3) {
      const patterns = await discoverPatterns(successfulCases)
      if (patterns?.legalPatterns) {
        results.patternsDiscovered = patterns.legalPatterns.length
        results.details.push(
          `Discovered ${results.patternsDiscovered} new patterns`
        )

        // In production, store patterns in ai_patterns table
        // for (const pattern of patterns.legalPatterns) {
        //   await supabase
        //     .from('ai_patterns')
        //     .upsert({
        //       pattern_type: 'legal',
        //       pattern_name: pattern.name,
        //       pattern_description: pattern.description,
        //       pattern_data: pattern,
        //       last_used_at: new Date().toISOString()
        //     })
        // }
      }
    }

    const processingTime = Date.now() - startTime

    // Log the cron run
    // await supabase.from('system_metrics').upsert({
    //   metric_date: new Date().toISOString().split('T')[0],
    //   metric_hour: new Date().getHours(),
    //   ai_tokens_used: sql`ai_tokens_used + ${tokensUsed}`,
    // })

    return NextResponse.json({
      success: true,
      results,
      processingTimeMs: processingTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Self-improvement cron error:', error)
    
    // Create system alert for error
    // await supabase.from('system_alerts').insert({
    //   type: 'system_error',
    //   severity: 'critical',
    //   title: 'Self-Improvement Cron Failed',
    //   description: error.message,
    // })

    return NextResponse.json({
      success: false,
      error: 'Self-improvement process failed',
      results,
    }, { status: 500 })
  }
}

// GET endpoint for manual trigger from dashboard
export async function GET(request: NextRequest) {
  // Convert GET to POST for manual trigger
  return POST(request)
}
