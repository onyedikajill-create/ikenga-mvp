import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const documentTemplates: Record<string, { name: string; instructions: string }> = {
  grievance: {
    name: "Formal Grievance Letter",
    instructions: `Generate a formal grievance letter following UK employment law best practices. The letter should:
- Be addressed formally to the employer
- Reference the company's grievance procedure and ACAS Code of Practice
- Clearly state the nature of the grievance
- Include specific dates and incidents
- Name any witnesses
- State the desired outcome
- Request a grievance meeting
- Reserve the employee's rights
- Be professional and factual in tone`,
  },
  sar: {
    name: "Subject Access Request (GDPR)",
    instructions: `Generate a Subject Access Request under UK GDPR Article 15. The letter should:
- Reference the Data Protection Act 2018 and UK GDPR Article 15
- Address the Data Protection Officer
- Include employee identification details
- Request ALL personal data held
- Specifically list common employment data categories (emails, personnel files, disciplinary records, CCTV, etc.)
- Set the one-month statutory deadline
- Warn of potential ICO complaint for non-compliance
- Be formal and comprehensive`,
  },
  et1: {
    name: "ET1 Employment Tribunal Claim Form Draft",
    instructions: `Generate a draft ET1 claim form narrative. This should:
- Follow the structure of the official ET1 form
- Include all required sections (claimant details, respondent details, employment details, claim details)
- Provide a chronological account of events
- Clearly state the type of claim(s)
- Specify the remedy sought
- Note the importance of Early Conciliation with ACAS
- Include a disclaimer that this is a draft requiring review
- Be factual and detailed`,
  },
  without_prejudice: {
    name: "Without Prejudice Settlement Letter",
    instructions: `Generate a without prejudice settlement letter. The letter should:
- Be clearly marked "WITHOUT PREJUDICE - SAVE AS TO COSTS"
- Explain the context of the dispute briefly
- List the potential claims
- Make a clear settlement proposal with specific amount
- Include proposed terms (reference, confidentiality, etc.)
- Set a deadline for response
- Note it may be relied upon for costs purposes
- Be professional and non-inflammatory`,
  },
  appeal: {
    name: "Appeal Letter",
    instructions: `Generate an appeal letter against a disciplinary or dismissal decision. The letter should:
- State this is a formal appeal
- Reference the original decision being appealed
- Set out clear grounds of appeal (procedural unfairness, disproportionate sanction, new evidence, etc.)
- List supporting evidence
- State the remedy sought
- Request an appeal hearing
- Note the right to be accompanied
- Be factual and focused on the grounds`,
  },
  flexible_working: {
    name: "Flexible Working Request",
    instructions: `Generate a statutory flexible working request under Section 80F of the Employment Rights Act 1996. The letter should:
- Reference the statutory right
- State current working pattern
- State proposed working pattern
- Propose a start date
- Assess impact on employer and how it can be managed
- Note this is a statutory request
- Reference the 2-month response deadline
- Be professional and solution-focused`,
  },
}

export async function POST(request: Request) {
  try {
    const { documentType, formData } = await request.json()

    if (!documentType || !documentTemplates[documentType]) {
      return NextResponse.json(
        { error: "Invalid document type" },
        { status: 400 }
      )
    }

    const template = documentTemplates[documentType]

    const systemPrompt = `You are an expert employment law document drafter specializing in UK employment law. You create professional, legally sound documents for self-represented litigants.

Your documents are:
- Technically accurate in legal terminology
- Following UK employment law best practices
- Clear and well-structured
- Professional in tone
- Comprehensive but not verbose
- Properly formatted for formal correspondence

Always include today's date: ${new Date().toLocaleDateString('en-GB')}

${template.instructions}`

    const userPrompt = `Generate a ${template.name} with the following details:

${Object.entries(formData)
  .filter(([_, value]) => value)
  .map(([key, value]) => `${key.replace(/_/g, ' ').toUpperCase()}: ${value}`)
  .join('\n')}

Generate the complete document ready for use. Fill in any gaps with appropriate placeholder text in [square brackets] that the user should complete.`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 3000,
    })

    return NextResponse.json({
      document: text,
      documentType,
      documentName: template.name,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Document generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate document" },
      { status: 500 }
    )
  }
}
