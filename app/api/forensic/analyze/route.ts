import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { et3Text, claimantTimeline, analysisType } = await request.json()

    if (!et3Text) {
      return NextResponse.json(
        { error: "ET3 response text is required" },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a forensic employment law analyst specializing in detecting inconsistencies, contradictions, and potential lies in ET3 (employer's response) documents. You have deep expertise in UK employment law, ACAS procedures, and tribunal processes.

Your task is to analyze the employer's ET3 response and identify:

1. **ANCHOR LIES**: These are foundational falsehoods that, if proven false, would collapse the employer's entire defense. Look for claims that are central to their narrative but potentially disprovable.

2. **INTERNAL CONTRADICTIONS**: Statements within the ET3 that contradict each other.

3. **TIMELINE GAPS**: Missing time periods, unexplained delays, or suspicious gaps in the employer's narrative.

4. **PROCEDURAL FAILURES**: Evidence of failure to follow ACAS Code of Practice, company policies, or statutory requirements.

5. **DOCUMENTARY INCONSISTENCIES**: Claims that are likely contradicted by documents (emails, meeting notes, HR records) that may exist.

6. **WITNESS CREDIBILITY ISSUES**: Statements attributed to witnesses that may be disprovable or inconsistent.

For each issue identified, provide:
- The specific claim/statement
- Why it appears problematic
- What evidence to request/questions to ask
- Potential impact on the case

Be thorough, analytical, and provide actionable insights.`

    let userPrompt = `Analyze this ET3 (employer's response) for inconsistencies and potential false statements:

---
ET3 RESPONSE TEXT:
${et3Text}
---`

    if (claimantTimeline) {
      userPrompt += `

CLAIMANT'S TIMELINE OF EVENTS:
${claimantTimeline}

Compare the employer's version with the claimant's timeline and identify any contradictions.`
    }

    if (analysisType === "anchor_lies") {
      userPrompt += `

Focus specifically on identifying ANCHOR LIES - the foundational claims that, if disproven, would cause the employer's entire defense to collapse.`
    } else if (analysisType === "timeline") {
      userPrompt += `

Focus specifically on TIMELINE ANALYSIS - gaps, inconsistencies in dates, missing periods, and suspicious timing.`
    } else if (analysisType === "procedural") {
      userPrompt += `

Focus specifically on PROCEDURAL ANALYSIS - did the employer follow correct procedures, ACAS Code, their own policies?`
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 4000,
    })

    return NextResponse.json({ analysis: text })
  } catch (error) {
    console.error("Forensic analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze ET3 response" },
      { status: 500 }
    )
  }
}
