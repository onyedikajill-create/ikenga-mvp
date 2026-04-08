import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

// IKENGA Justice Intelligence - Forensic Contradiction Finder
// As specified in the UJU Cycle synthesis for maximum launch velocity

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { employerResponse, userEvidence, analysisMode } = await req.json()

    if (!employerResponse && !userEvidence) {
      return NextResponse.json(
        { error: "Either employerResponse or userEvidence is required" },
        { status: 400 }
      )
    }

    const systemPrompt = `You are a senior UK employment barrister with 20+ years experience at tribunal hearings. You have a reputation for demolishing employer defenses by finding hidden contradictions.

Your task is to forensically analyze employer statements against employee evidence and identify:

1. **CONTRADICTIONS**: Where the employer says X but the evidence shows Y
2. **ANCHOR LIES**: Foundational claims that, if proven false, collapse their entire defense
3. **WEAK POINTS**: Arguments likely to fail at tribunal
4. **STRONG POINTS**: Arguments the employee should emphasize
5. **MISSING EVIDENCE**: What would strengthen the employee's case
6. **RECOMMENDED RESPONSE**: How to counter each employer argument

Be thorough, ruthless, and provide actionable intelligence. Format your response as structured JSON.`

    const prompt = `Analyse this employer's ET3 response against the employee's evidence.

EMPLOYER RESPONSE (ET3):
${employerResponse || "Not provided - analyse the evidence independently"}

EMPLOYEE EVIDENCE:
${userEvidence || "Not provided - analyse the ET3 independently"}

${analysisMode === 'quick' ? 'Provide a quick summary of the top 5 issues.' : 'Provide a comprehensive forensic analysis.'}

Return a JSON object with these exact keys:
{
  "contradictions": [{"claim": "", "evidence_against": "", "impact": "high|medium|low"}],
  "anchor_lies": [{"lie": "", "why_critical": "", "how_to_prove_false": ""}],
  "weak_points": [{"argument": "", "why_weak": "", "tribunal_likely_response": ""}],
  "strong_points": [{"argument": "", "supporting_evidence": "", "how_to_emphasize": ""}],
  "missing_evidence": [{"document": "", "where_to_find": "", "importance": ""}],
  "recommended_responses": [{"employer_claim": "", "counter_argument": "", "evidence_to_cite": ""}],
  "overall_assessment": {
    "employer_defense_strength": "1-10",
    "employee_case_strength": "1-10", 
    "recommended_priority_actions": []
  }
}`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt,
      maxTokens: 4000,
    })

    // Try to parse as JSON, otherwise return as text
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text
      const analysis = JSON.parse(jsonStr)
      return NextResponse.json(analysis)
    } catch {
      // Return as text if JSON parsing fails
      return NextResponse.json({ 
        analysis: text,
        format: "text",
        note: "AI returned text format - parsed results may vary"
      })
    }
  } catch (error) {
    console.error("IKENGA Forensic Analysis Error:", error)
    return NextResponse.json(
      { error: "Failed to analyze. Please try again." },
      { status: 500 }
    )
  }
}
