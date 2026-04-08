import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const platformConstraints: Record<string, { maxLength: number; style: string }> = {
  linkedin: {
    maxLength: 3000,
    style: "professional, thought-leadership oriented, uses line breaks for readability, includes a hook and call-to-action",
  },
  twitter: {
    maxLength: 280,
    style: "concise, punchy, conversational, uses threads for longer content",
  },
  facebook: {
    maxLength: 63206,
    style: "conversational, community-focused, storytelling, encourages engagement",
  },
  instagram: {
    maxLength: 2200,
    style: "visual-focused captions, uses emojis, includes relevant hashtags, encourages saves and shares",
  },
}

export async function POST(request: Request) {
  try {
    const {
      platform,
      contentType,
      topic,
      tone,
      targetAudience,
      keywords,
      callToAction,
      includeHashtags,
      includeEmoji,
    } = await request.json()

    if (!topic || !platform) {
      return NextResponse.json(
        { error: "Topic and platform are required" },
        { status: 400 }
      )
    }

    const platformInfo = platformConstraints[platform] || platformConstraints.linkedin

    const systemPrompt = `You are an expert social media content creator and copywriter. You specialize in creating engaging, platform-optimized content that drives engagement and achieves business goals.

Your writing style is authentic, compelling, and tailored to each platform's unique culture and constraints.

Platform: ${platform.toUpperCase()}
- Maximum length: ${platformInfo.maxLength} characters
- Style: ${platformInfo.style}

Guidelines:
- Create content that feels native to the platform
- Use formatting appropriate for the platform (line breaks, bullet points, etc.)
- ${includeEmoji ? "Include relevant emojis to add personality and visual breaks" : "Do not use emojis"}
- ${includeHashtags ? "Include 3-10 relevant hashtags at the end" : "Do not include hashtags"}
- Start with a strong hook that stops the scroll
- End with a clear call-to-action
- Keep sentences punchy and scannable
- Write in a way that encourages engagement (likes, comments, shares, saves)`

    const userPrompt = `Create a ${platform} post with the following specifications:

TOPIC: ${topic}

CONTENT TYPE: ${contentType || "general"}

TONE: ${tone || "professional"}

${targetAudience ? `TARGET AUDIENCE: ${targetAudience}` : ""}

${keywords ? `KEYWORDS TO INCLUDE: ${keywords}` : ""}

${callToAction ? `CALL TO ACTION: ${callToAction}` : ""}

Generate the main post content, followed by 2 alternative variations with different hooks or angles.

Format your response as:
---MAIN---
[main post content]
---VARIATION 1---
[first alternative]
---VARIATION 2---
[second alternative]`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
      maxTokens: 2000,
    })

    // Parse the response into main content and variations
    const sections = text.split(/---(?:MAIN|VARIATION \d+)---/).filter(Boolean)
    
    const main = sections[0]?.trim() || text
    const variations = sections.slice(1).map(s => s.trim()).filter(Boolean)

    return NextResponse.json({
      main,
      variations,
      platform,
      characterCount: main.length,
    })
  } catch (error) {
    console.error("Content generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    )
  }
}
