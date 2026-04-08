"use client"

import { useState } from "react"
import { Check, Zap, Crown, Building2, FileText, Scale, Sparkles, CreditCard, Building, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: { monthly: 0, annual: 0 },
    icon: Zap,
    features: [
      "1 active case",
      "Basic evidence upload (10MB limit)",
      "Simple timeline builder",
      "Basic compensation calculator",
      "Community support",
    ],
    limitations: [
      "No AI-powered features",
      "No document generation",
      "No forensic analysis",
      "No IKENGA content tools",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious self-represented litigants",
    price: { monthly: 9.99, annual: 79 },
    icon: Crown,
    features: [
      "Unlimited active cases",
      "Full evidence vault (100MB per file)",
      "Advanced timeline with gap detection",
      "Full compensation calculator with Vento bands",
      "AI-powered Forensic Auditor",
      "Document Generator (all templates)",
      "IKENGA AI Content Studio",
      "Priority email support",
      "Case export (PDF)",
    ],
    limitations: [],
    cta: "Upgrade to Pro",
    popular: true,
    savings: "Save £40/year",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For legal advisors & organisations",
    price: { monthly: 49.99, annual: 499 },
    icon: Building2,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Client management dashboard",
      "White-label document export",
      "API access",
      "Custom AI training",
      "Dedicated account manager",
      "Phone support",
      "SLA guarantee",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

const oneOffProducts = [
  {
    id: "forensic_audit",
    name: "Deep Forensic Audit",
    description: "Comprehensive AI analysis of your employer's defence (ET3) to identify anchor lies, contradictions, and strategic weaknesses",
    price: 49,
    icon: Scale,
    features: [
      "Full ET3 analysis",
      "Anchor lie detection",
      "Contradiction mapping",
      "Evidence gap identification",
      "Strategic recommendations",
      "PDF report export",
    ],
  },
  {
    id: "document_pack",
    name: "Document Generator Pack",
    description: "Access to all document templates with unlimited generations",
    price: 29,
    icon: FileText,
    features: [
      "Grievance letter template",
      "Subject Access Request (SAR)",
      "ET1 claim draft",
      "Without prejudice letter",
      "Appeal letter template",
      "Settlement agreement analysis",
    ],
  },
  {
    id: "content_pack",
    name: "IKENGA Content Pack",
    description: "100 AI-generated social media posts for your professional brand",
    price: 19,
    icon: Sparkles,
    features: [
      "100 post credits",
      "All platforms supported",
      "Multiple content types",
      "Hashtag optimization",
      "Scheduling feature",
      "Never expires",
    ],
  },
]

const bankDetails = {
  accountName: "UJRIS Ltd",
  sortCode: "04-00-04",
  accountNumber: "12345678",
  reference: "PRO-[YOUR_EMAIL]",
}

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual")
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Powerful tools to fight for justice. No hidden fees.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as "monthly" | "annual")} className="w-auto">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="annual" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Annual
              <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-500">
                Save 33%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-card border-border relative ${
              plan.popular ? "border-primary shadow-lg shadow-primary/20" : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${plan.popular ? "bg-primary" : "bg-muted"}`}>
                  <plan.icon className={`h-5 w-5 ${plan.popular ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    £{billingPeriod === "monthly" ? plan.price.monthly : plan.price.annual}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-muted-foreground">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                  )}
                </div>
                {plan.savings && billingPeriod === "annual" && (
                  <p className="text-sm text-green-500 mt-1">{plan.savings}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.limitations.length > 0 && (
                <>
                  <Separator />
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-4 w-4 flex items-center justify-center shrink-0">—</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
            <CardFooter>
              {plan.id === "free" ? (
                <Button variant="outline" className="w-full" disabled>
                  {plan.cta}
                </Button>
              ) : plan.id === "enterprise" ? (
                <Button variant="outline" className="w-full">
                  {plan.cta}
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}>
                      {plan.cta}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upgrade to {plan.name}</DialogTitle>
                      <DialogDescription>
                        Complete your payment via bank transfer
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Account Name</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{bankDetails.accountName}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.accountName, "accountName")}
                            >
                              {copied === "accountName" ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sort Code</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bankDetails.sortCode}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.sortCode, "sortCode")}
                            >
                              {copied === "sortCode" ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Account Number</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium font-mono">{bankDetails.accountNumber}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.accountNumber, "accountNumber")}
                            >
                              {copied === "accountNumber" ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="font-bold text-lg text-primary">
                            £{billingPeriod === "monthly" ? plan.price.monthly : plan.price.annual}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Reference</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs">{bankDetails.reference}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(bankDetails.reference, "reference")}
                            >
                              {copied === "reference" ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        After completing your transfer, your account will be upgraded within 24 hours. 
                        Use your email address in the reference so we can identify your payment.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay with Card
                        </Button>
                        <Button className="flex-1 bg-primary hover:bg-primary/90">
                          <Building className="h-4 w-4 mr-2" />
                          I&apos;ve Paid
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* One-off Products */}
      <div className="pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">One-Time Purchases</h2>
          <p className="text-muted-foreground mt-1">
            Need specific features? Buy only what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {oneOffProducts.map((product) => (
            <Card key={product.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <product.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">£{product.price}</div>
                  </div>
                </div>
                <CardDescription className="mt-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Purchase for £{product.price}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ or Trust Signals */}
      <div className="pt-8 text-center">
        <Card className="bg-card border-border max-w-3xl mx-auto">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5,000+</div>
                <div className="text-sm text-muted-foreground">Self-Litigants Helped</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">£2.4M+</div>
                <div className="text-sm text-muted-foreground">Compensation Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
