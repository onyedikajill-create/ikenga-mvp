"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Wand2, Copy, CheckCircle, Send, Calendar, Linkedin, Twitter, Facebook, Instagram, RefreshCw, Zap, MessageSquare, Hash, Globe, Clock, TrendingUp, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const platforms = [
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "bg-blue-600", maxLength: 3000 },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "bg-black", maxLength: 280 },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-500", maxLength: 63206 },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-600 to-pink-500", maxLength: 2200 },
]

const contentTypes = [
  { id: "thought_leadership", name: "Thought Leadership", description: "Share insights and expertise" },
  { id: "educational", name: "Educational", description: "Teach your audience something new" },
  { id: "promotional", name: "Promotional", description: "Promote your product or service" },
  { id: "engagement", name: "Engagement", description: "Spark conversations and interactions" },
  { id: "storytelling", name: "Storytelling", description: "Share personal or brand stories" },
  { id: "news_commentary", name: "News Commentary", description: "Comment on industry news" },
]

const toneOptions = [
  { id: "professional", name: "Professional" },
  { id: "conversational", name: "Conversational" },
  { id: "inspirational", name: "Inspirational" },
  { id: "humorous", name: "Humorous" },
  { id: "authoritative", name: "Authoritative" },
  { id: "empathetic", name: "Empathetic" },
]

export default function ContentPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("linkedin")
  const [contentType, setContentType] = useState<string>("")
  const [tone, setTone] = useState<string>("professional")
  const [topic, setTopic] = useState<string>("")
  const [keywords, setKeywords] = useState<string>("")
  const [targetAudience, setTargetAudience] = useState<string>("")
  const [callToAction, setCallToAction] = useState<string>("")
  const [includeHashtags, setIncludeHashtags] = useState<boolean>(true)
  const [includeEmoji, setIncludeEmoji] = useState<boolean>(true)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [variations, setVariations] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!topic) return
    
    setIsGenerating(true)
    
    // Simulate AI generation - in production this would call Groq API
    await new Promise(resolve => setTimeout(resolve, 2000))

    const platform = platforms.find(p => p.id === selectedPlatform)
    
    // Generate sample content based on platform and type
    const sampleContent = generateSampleContent(selectedPlatform, contentType, topic, tone, includeHashtags, includeEmoji)
    
    setGeneratedContent(sampleContent.main)
    setVariations(sampleContent.variations)
    setIsGenerating(false)
  }

  const generateSampleContent = (platform: string, type: string, topic: string, tone: string, hashtags: boolean, emoji: boolean) => {
    const emojiSet = emoji ? { hook: "🚀", point: "💡", cta: "👇" } : { hook: "", point: "", cta: "" }
    
    const templates: Record<string, { main: string, variations: string[] }> = {
      linkedin: {
        main: `${emojiSet.hook} ${topic}

Here's what most people get wrong:

They think success is about working harder.
But it's actually about working smarter.

After 10 years in this industry, I've learned:

${emojiSet.point} Focus on high-impact activities
${emojiSet.point} Build systems, not just goals
${emojiSet.point} Invest in relationships, not just skills
${emojiSet.point} Learn from failures, not just wins

The difference between good and great?

Consistency over intensity.
Every. Single. Day.

${callToAction || "What's one thing you've learned that changed your approach?"}

${emojiSet.cta}

${hashtags ? "#Leadership #PersonalGrowth #CareerAdvice #Productivity #Success" : ""}`,
        variations: [
          `${emojiSet.hook} Unpopular opinion about ${topic}:

Most advice you hear is backwards.

Here's what actually works...

[Thread]`,
          `${emojiSet.hook} I spent 5 years figuring out ${topic}.

Here are 5 lessons I wish I knew from day one:

1. Start before you're ready
2. Done is better than perfect
3. Feedback is a gift
4. Compound effects are real
5. Your network is your net worth

Save this for later. ${emojiSet.cta}`,
        ]
      },
      twitter: {
        main: `${emojiSet.hook} ${topic} in 2025:

The playbook has changed.

Here's what's working now:

1. Authenticity > Perfection
2. Value > Volume
3. Community > Followers

${callToAction || "Thoughts?"}

${hashtags ? "#GrowthMindset" : ""}`,
        variations: [
          `Hot take: ${topic} isn't what you think.

Most people overcomplicate it.

The truth? Keep it simple.

${emojiSet.cta}`,
          `3 things I learned about ${topic} this week:

• Quality over quantity
• Consistency is key
• Patience pays off

What would you add?`,
        ]
      },
      facebook: {
        main: `${emojiSet.hook} Let's talk about ${topic}...

I've been thinking about this a lot lately, and I wanted to share some thoughts with you all.

${contentType === "storytelling" ? "Last week, something happened that really opened my eyes..." : "Here's what I've discovered..."}

The key insight? It's not about doing more. It's about doing what matters.

${emojiSet.point} Focus on impact, not activity
${emojiSet.point} Build genuine connections
${emojiSet.point} Stay curious and keep learning

I'd love to hear your experiences. ${callToAction || "What's worked for you?"}

${emojiSet.cta} Drop a comment below!

${hashtags ? "#Inspiration #Growth #Community" : ""}`,
        variations: [
          `${emojiSet.hook} Story time about ${topic}!

Three years ago, I had no idea what I was doing.

Fast forward to today...

[Continue reading]`,
        ]
      },
      instagram: {
        main: `${emojiSet.hook} ${topic} - save this for later!

The truth about success nobody tells you:

${emojiSet.point} It's messy
${emojiSet.point} It takes time
${emojiSet.point} It requires consistency
${emojiSet.point} It's worth it

Double tap if you agree! ${emojiSet.cta}

${hashtags ? "\n\n#MondayMotivation #GrowthMindset #Inspiration #Success #Entrepreneur #Hustle #Goals #Mindset #Motivation #Business" : ""}`,
        variations: [
          `POV: You finally understand ${topic} ${emojiSet.hook}

The game changer? Keeping it simple.

Save & share if this resonates! ${emojiSet.cta}`,
        ]
      },
    }

    return templates[platform] || templates.linkedin
  }

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logos/ikenga-ai-logo-transparent.png"
              alt="IKENGA AI"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">IKENGA AI Content Studio</h1>
              <p className="text-muted-foreground">
                Power Your Destiny Across Every Platform
              </p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
          <Zap className="h-3 w-3 mr-1" />
          Powered by Groq AI
        </Badge>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="generate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Content
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Posts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Content Configuration */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Content Configuration
                </CardTitle>
                <CardDescription>
                  Configure your content and let AI do the heavy lifting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Platform Selection */}
                <div className="space-y-2">
                  <Label>Target Platform</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform.id)}
                        className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                          selectedPlatform === platform.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                          <platform.icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic */}
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic / Main Idea</Label>
                  <Textarea
                    id="topic"
                    placeholder="What do you want to talk about? E.g., 'The importance of work-life balance for entrepreneurs'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-background min-h-[80px]"
                  />
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <Label htmlFor="audience">
                    <Target className="h-4 w-4 inline mr-1" />
                    Target Audience (Optional)
                  </Label>
                  <Input
                    id="audience"
                    placeholder="E.g., 'Tech entrepreneurs, startup founders'"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label htmlFor="keywords">
                    <Hash className="h-4 w-4 inline mr-1" />
                    Keywords (Optional)
                  </Label>
                  <Input
                    id="keywords"
                    placeholder="Comma-separated keywords to include"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="bg-background"
                  />
                </div>

                {/* Call to Action */}
                <div className="space-y-2">
                  <Label htmlFor="cta">Call to Action (Optional)</Label>
                  <Input
                    id="cta"
                    placeholder="E.g., 'What's your experience with this?'"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <Separator />

                {/* Options */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={includeHashtags}
                      onCheckedChange={setIncludeHashtags}
                      id="hashtags"
                    />
                    <Label htmlFor="hashtags" className="text-sm">Include Hashtags</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={includeEmoji}
                      onCheckedChange={setIncludeEmoji}
                      id="emoji"
                    />
                    <Label htmlFor="emoji" className="text-sm">Include Emojis</Label>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Generating with Groq AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Generated Content
                      </CardTitle>
                      <CardDescription>
                        {selectedPlatformData && (
                          <span className="flex items-center gap-1 mt-1">
                            <selectedPlatformData.icon className="h-3 w-3" />
                            {selectedPlatformData.name} • Max {selectedPlatformData.maxLength.toLocaleString()} characters
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {generatedContent && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleRegenerate}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="space-y-4">
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        className="min-h-[300px] bg-background font-sans"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{generatedContent.length} characters</span>
                        {selectedPlatformData && generatedContent.length > selectedPlatformData.maxLength && (
                          <span className="text-red-500">
                            Exceeds {selectedPlatformData.name} limit by {generatedContent.length - selectedPlatformData.maxLength} characters
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-primary hover:bg-primary/90">
                          <Send className="h-4 w-4 mr-2" />
                          Post Now
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your content and click Generate</p>
                      <p className="text-sm mt-1">AI will create platform-optimized content for you</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Variations */}
              {variations.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Alternative Variations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {variations.map((variation, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/50 cursor-pointer transition-colors"
                        onClick={() => setGeneratedContent(variation)}
                      >
                        <p className="text-sm whitespace-pre-wrap line-clamp-4">{variation}</p>
                        <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                          Use This Version
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Scheduled Posts
              </CardTitle>
              <CardDescription>Manage your upcoming social media posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts scheduled yet</p>
                <p className="text-sm mt-1">Connect your social accounts to start scheduling</p>
                <Button className="mt-4" variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Connect Accounts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Content Analytics
              </CardTitle>
              <CardDescription>Track the performance of your content across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics coming soon</p>
                <p className="text-sm mt-1">Connect your accounts to start tracking performance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
