"use client"

import { useState } from "react"
import { FileText, Download, Wand2, Copy, CheckCircle, AlertTriangle, Clock, Building2, Scale, FileWarning, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const documentTypes = [
  {
    id: "grievance",
    name: "Grievance Letter",
    description: "Formal complaint to your employer about workplace issues",
    icon: FileWarning,
    fields: ["issue_type", "dates", "witnesses", "desired_outcome"],
    estimatedTime: "5 min",
  },
  {
    id: "sar",
    name: "Subject Access Request (SAR)",
    description: "Request all personal data held by your employer under GDPR",
    icon: FileText,
    fields: ["employer_name", "employment_dates", "specific_data"],
    estimatedTime: "3 min",
  },
  {
    id: "et1",
    name: "ET1 Claim Form",
    description: "Employment Tribunal claim form for unfair dismissal, discrimination, etc.",
    icon: Scale,
    fields: ["claim_type", "respondent", "dates", "remedy_sought"],
    estimatedTime: "15 min",
  },
  {
    id: "without_prejudice",
    name: "Without Prejudice Letter",
    description: "Settlement negotiation letter protected from disclosure in court",
    icon: Send,
    fields: ["settlement_amount", "terms", "deadline"],
    estimatedTime: "8 min",
  },
  {
    id: "appeal",
    name: "Appeal Letter",
    description: "Appeal against disciplinary action or dismissal decision",
    icon: AlertTriangle,
    fields: ["original_decision", "appeal_grounds", "evidence"],
    estimatedTime: "10 min",
  },
  {
    id: "flexible_working",
    name: "Flexible Working Request",
    description: "Formal request for flexible working arrangements",
    icon: Clock,
    fields: ["proposed_arrangement", "start_date", "impact_assessment"],
    estimatedTime: "5 min",
  },
]

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleGenerate = async () => {
    if (!selectedDocument) return
    
    setIsGenerating(true)
    
    // Simulate AI generation - in production this would call Groq API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const docType = documentTypes.find(d => d.id === selectedDocument)
    
    const templates: Record<string, string> = {
      grievance: `FORMAL GRIEVANCE LETTER

To: ${formData.employer_name || "[Employer Name]"}
From: ${formData.employee_name || "[Your Name]"}
Date: ${new Date().toLocaleDateString('en-GB')}
Re: Formal Grievance - ${formData.issue_type || "[Issue Type]"}

Dear ${formData.manager_name || "[Manager Name]"},

I am writing to raise a formal grievance in accordance with the company's grievance procedure and the ACAS Code of Practice.

NATURE OF GRIEVANCE:
${formData.description || "[Detailed description of the issue]"}

DATES AND INCIDENTS:
${formData.dates || "[Relevant dates and specific incidents]"}

WITNESSES:
${formData.witnesses || "[Names of any witnesses]"}

IMPACT:
This matter has caused me significant distress and has affected my ability to perform my duties effectively.

DESIRED OUTCOME:
${formData.desired_outcome || "[What resolution you are seeking]"}

I request a meeting to discuss this grievance at the earliest opportunity. Please confirm receipt of this letter and the date of the grievance meeting within 5 working days.

I reserve all my rights.

Yours sincerely,

${formData.employee_name || "[Your Name]"}`,

      sar: `SUBJECT ACCESS REQUEST
Data Protection Act 2018 / UK GDPR Article 15

To: Data Protection Officer
${formData.employer_name || "[Company Name]"}
${formData.employer_address || "[Company Address]"}

Date: ${new Date().toLocaleDateString('en-GB')}

Dear Sir/Madam,

REQUEST FOR PERSONAL DATA

Please treat this letter as a formal request under Article 15 of the UK GDPR for access to all personal data you hold about me.

MY DETAILS:
Full Name: ${formData.employee_name || "[Your Full Name]"}
Date of Birth: ${formData.dob || "[Your DOB]"}
Employee ID: ${formData.employee_id || "[If applicable]"}
Employment Period: ${formData.employment_dates || "[Start Date] to [End Date]"}

I require copies of ALL personal data held about me, including but not limited to:

1. Personnel files and employment records
2. All emails sent by me, received by me, or mentioning me
3. Performance reviews and appraisals
4. Disciplinary records and investigation files
5. Grievance records
6. CCTV footage featuring me
7. Access logs and IT system records
8. Notes from meetings involving me
9. WhatsApp, Teams, or other messaging communications mentioning me
10. Management meeting minutes discussing me
11. Any investigation reports involving me
12. Redundancy selection criteria and scoring (if applicable)

${formData.specific_data ? `SPECIFIC REQUESTS:\n${formData.specific_data}\n` : ""}

Please respond within ONE CALENDAR MONTH as required by law. If you require any additional information to verify my identity or locate the data, please contact me immediately.

Failure to comply may result in a complaint to the Information Commissioner's Office.

Yours faithfully,

${formData.employee_name || "[Your Name]"}
${formData.email || "[Your Email]"}
${formData.phone || "[Your Phone]"}`,

      et1: `ET1 CLAIM FORM - DRAFT

EMPLOYMENT TRIBUNALS
Claim to an Employment Tribunal

1. YOUR DETAILS
${formData.employee_name || "[Claimant Name]"}
${formData.address || "[Address]"}
${formData.email || "[Email]"}
${formData.phone || "[Phone]"}

2. RESPONDENT'S DETAILS
${formData.respondent || "[Employer Name and Address]"}

3. EMPLOYMENT DETAILS
Employment Start Date: ${formData.start_date || "[Date]"}
Employment End Date: ${formData.end_date || "[Date]"}
Job Title: ${formData.job_title || "[Job Title]"}
Hours per week: ${formData.hours || "[Hours]"}
Pay before tax: ${formData.pay || "[Amount]"} per ${formData.pay_period || "[week/month]"}
Notice period: ${formData.notice || "[Notice Period]"}

4. TYPE OF CLAIM
${formData.claim_type || `[ ] Unfair dismissal
[ ] Discrimination (specify protected characteristic)
[ ] Breach of contract
[ ] Unlawful deduction from wages
[ ] Failure to provide written particulars
[ ] Whistleblowing detriment
[ ] Other (specify)`}

5. BACKGROUND AND DETAILS OF CLAIM

${formData.background || "[Detailed chronological account of events leading to claim]"}

6. WHAT REMEDY ARE YOU SEEKING?

${formData.remedy_sought || `[ ] Compensation
[ ] Reinstatement
[ ] Re-engagement
[ ] Declaration of rights
[ ] Recommendation`}

7. OTHER INFORMATION

${formData.other_info || "[Any other relevant information]"}

IMPORTANT: This is a DRAFT. You must submit via the official Employment Tribunals online system or Form ET1.
Time limit: Generally 3 months less 1 day from the act complained of.
Early Conciliation: You MUST contact ACAS before submitting an ET1.`,

      without_prejudice: `WITHOUT PREJUDICE
SAVE AS TO COSTS

Private & Confidential

To: ${formData.recipient || "[Recipient Name/HR]"}
${formData.employer_name || "[Company Name]"}

Date: ${new Date().toLocaleDateString('en-GB')}

Dear ${formData.recipient_name || "[Name]"},

WITHOUT PREJUDICE SETTLEMENT PROPOSAL

I am writing on a without prejudice basis to explore whether this matter can be resolved without the need for Employment Tribunal proceedings.

BACKGROUND:
${formData.background || "[Brief summary of the dispute]"}

MY CLAIMS:
I have potential claims for:
${formData.claims || `- Unfair dismissal
- [Other claims]`}

SETTLEMENT PROPOSAL:
In full and final settlement of all claims arising from my employment and its termination, I am prepared to accept:

1. Compensation: £${formData.settlement_amount || "[Amount]"}
2. ${formData.reference || "An agreed reference"}
3. ${formData.other_terms || "[Other terms]"}

This offer is open for acceptance until ${formData.deadline || "[Date - typically 14 days]"}.

Should this matter proceed to Tribunal, I will rely upon this letter in any application for costs, as it represents a genuine attempt to settle this dispute.

I look forward to your response.

Yours ${formData.recipient_name ? "sincerely" : "faithfully"},

${formData.employee_name || "[Your Name]"}`,

      appeal: `APPEAL AGAINST [DISMISSAL/DISCIPLINARY OUTCOME]

To: ${formData.appeal_manager || "[Appeal Manager]"}
${formData.employer_name || "[Company Name]"}

Date: ${new Date().toLocaleDateString('en-GB')}

Dear ${formData.appeal_manager || "[Name]"},

FORMAL APPEAL

I am writing to formally appeal against the decision to ${formData.original_decision || "[dismiss me / issue a final written warning / etc.]"} dated ${formData.decision_date || "[Date]"}.

GROUNDS OF APPEAL:

${formData.appeal_grounds || `1. PROCEDURAL UNFAIRNESS
   - [Details of how the procedure was unfair]

2. DECISION WAS NOT REASONABLE
   - [Why the decision was not within the range of reasonable responses]

3. NEW EVIDENCE
   - [Any new evidence that was not available at the original hearing]

4. PENALTY TOO SEVERE
   - [Why the sanction was disproportionate]`}

SUPPORTING EVIDENCE:
${formData.evidence || "[List of documents or witnesses you will rely upon]"}

REMEDY SOUGHT:
${formData.remedy || "[What outcome you are seeking - reinstatement, reduced sanction, etc.]"}

I request an appeal hearing at the earliest opportunity. Please confirm the date, time and location, along with details of who will be conducting the appeal.

I will be accompanied at the appeal hearing by ${formData.companion || "[colleague/trade union representative]"}.

Yours ${formData.appeal_manager ? "sincerely" : "faithfully"},

${formData.employee_name || "[Your Name]"}`,

      flexible_working: `FLEXIBLE WORKING REQUEST
Employment Rights Act 1996, Section 80F

To: ${formData.manager_name || "[Manager Name]"}
${formData.employer_name || "[Company Name]"}

Date: ${new Date().toLocaleDateString('en-GB')}

Dear ${formData.manager_name || "[Name]"},

STATUTORY REQUEST FOR FLEXIBLE WORKING

I am making a statutory request for flexible working under Section 80F of the Employment Rights Act 1996.

CURRENT WORKING PATTERN:
${formData.current_pattern || "[Your current working hours/days/location]"}

PROPOSED WORKING PATTERN:
${formData.proposed_arrangement || "[Your proposed new arrangement]"}

PROPOSED START DATE:
${formData.start_date || "[When you want the change to begin]"}

IMPACT ON EMPLOYER AND HOW IT MIGHT BE DEALT WITH:
${formData.impact_assessment || `I have considered how this change might affect the business and my colleagues:

- [How my work will still be completed]
- [How I will coordinate with colleagues]
- [Any cost implications and how they can be minimised]
- [How customer/client needs will still be met]`}

This is ${formData.previous_requests || "my first"} request for flexible working in the past 12 months.

Please arrange a meeting to discuss this request within 28 days. I understand you must respond to this request within 2 months.

Yours sincerely,

${formData.employee_name || "[Your Name]"}
Employee since: ${formData.employment_date || "[Date]"}`,
    }
    
    setGeneratedContent(templates[selectedDocument] || "Document template not found.")
    setIsGenerating(false)
  }

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedDocument}_${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const selectedDocType = documentTypes.find(d => d.id === selectedDocument)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Document Generator</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered legal document generation for employment disputes
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="generate" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Generate Document
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Template Library
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            My Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Document Type Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Select Document Type
                </CardTitle>
                <CardDescription>
                  Choose the type of document you need to generate
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {documentTypes.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocument(doc.id)
                      setGeneratedContent(null)
                      setFormData({})
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedDocument === doc.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${selectedDocument === doc.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <doc.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {doc.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Form Fields */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Document Details
                </CardTitle>
                <CardDescription>
                  {selectedDocument
                    ? `Fill in details for your ${selectedDocType?.name}`
                    : "Select a document type to begin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDocument ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee_name">Your Full Name</Label>
                      <Input
                        id="employee_name"
                        placeholder="Enter your full name"
                        value={formData.employee_name || ""}
                        onChange={(e) => setFormData({ ...formData, employee_name: e.target.value })}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer_name">Employer Name</Label>
                      <Input
                        id="employer_name"
                        placeholder="Enter employer/company name"
                        value={formData.employer_name || ""}
                        onChange={(e) => setFormData({ ...formData, employer_name: e.target.value })}
                        className="bg-background"
                      />
                    </div>

                    {selectedDocument === "grievance" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="issue_type">Type of Issue</Label>
                          <Select
                            value={formData.issue_type || ""}
                            onValueChange={(value) => setFormData({ ...formData, issue_type: value })}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Bullying and Harassment">Bullying and Harassment</SelectItem>
                              <SelectItem value="Discrimination">Discrimination</SelectItem>
                              <SelectItem value="Unfair Treatment">Unfair Treatment</SelectItem>
                              <SelectItem value="Health and Safety">Health and Safety</SelectItem>
                              <SelectItem value="Contract Breach">Contract Breach</SelectItem>
                              <SelectItem value="Workload Issues">Workload Issues</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Describe the Issue</Label>
                          <Textarea
                            id="description"
                            placeholder="Provide a detailed description of what happened..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-background min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="desired_outcome">Desired Outcome</Label>
                          <Textarea
                            id="desired_outcome"
                            placeholder="What resolution are you seeking?"
                            value={formData.desired_outcome || ""}
                            onChange={(e) => setFormData({ ...formData, desired_outcome: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </>
                    )}

                    {selectedDocument === "sar" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="employment_dates">Employment Period</Label>
                          <Input
                            id="employment_dates"
                            placeholder="e.g., January 2020 to Present"
                            value={formData.employment_dates || ""}
                            onChange={(e) => setFormData({ ...formData, employment_dates: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specific_data">Specific Data Requested (Optional)</Label>
                          <Textarea
                            id="specific_data"
                            placeholder="Any specific documents or data you want to request..."
                            value={formData.specific_data || ""}
                            onChange={(e) => setFormData({ ...formData, specific_data: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </>
                    )}

                    {selectedDocument === "without_prejudice" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="settlement_amount">Settlement Amount (GBP)</Label>
                          <Input
                            id="settlement_amount"
                            type="number"
                            placeholder="e.g., 15000"
                            value={formData.settlement_amount || ""}
                            onChange={(e) => setFormData({ ...formData, settlement_amount: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="background">Background Summary</Label>
                          <Textarea
                            id="background"
                            placeholder="Brief summary of the dispute..."
                            value={formData.background || ""}
                            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </>
                    )}

                    {selectedDocument === "et1" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="claim_type">Type of Claim</Label>
                          <Select
                            value={formData.claim_type || ""}
                            onValueChange={(value) => setFormData({ ...formData, claim_type: value })}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Unfair Dismissal">Unfair Dismissal</SelectItem>
                              <SelectItem value="Constructive Dismissal">Constructive Dismissal</SelectItem>
                              <SelectItem value="Discrimination - Race">Discrimination - Race</SelectItem>
                              <SelectItem value="Discrimination - Sex">Discrimination - Sex</SelectItem>
                              <SelectItem value="Discrimination - Disability">Discrimination - Disability</SelectItem>
                              <SelectItem value="Discrimination - Age">Discrimination - Age</SelectItem>
                              <SelectItem value="Whistleblowing">Whistleblowing Detriment</SelectItem>
                              <SelectItem value="Breach of Contract">Breach of Contract</SelectItem>
                              <SelectItem value="Unlawful Deduction">Unlawful Deduction from Wages</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="respondent">Respondent (Employer Details)</Label>
                          <Textarea
                            id="respondent"
                            placeholder="Employer name and full address..."
                            value={formData.respondent || ""}
                            onChange={(e) => setFormData({ ...formData, respondent: e.target.value })}
                            className="bg-background"
                          />
                        </div>
                      </>
                    )}

                    <Separator />

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Document
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a document type from the left to begin</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Generated Document
                    </CardTitle>
                    <CardDescription>
                      Review, edit, and download your document
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
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
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm bg-background"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Template Library</CardTitle>
              <CardDescription>Pre-built templates for common employment law documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((doc) => (
                  <Card key={doc.id} className="bg-muted/50 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <doc.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{doc.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {doc.estimatedTime}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedDocument(doc.id)}>
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>Previously generated documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents generated yet</p>
                <p className="text-sm mt-1">Documents you generate will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
