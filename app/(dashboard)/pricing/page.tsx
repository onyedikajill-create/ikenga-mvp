"use client"

import { useState } from "react"
import { Check, Crown, Building2, FileText, Scale, Sparkles, CreditCard, Building, Copy, CheckCircle, Zap, Shield, Lock, Star, ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// UJU Cycle Optimized Pricing
const plans = [
  {
    id: "free",
    name: "Free",
    description: "Everything to start your case",
    price: 0,
    priceLabel: "Forever free",
    icon: Zap,
    features: [
      "1 active employment tribunal case",
      "Evidence vault (100MB)",
      "Timeline builder with gap detection",
      "Basic compensation calculator",
      "ET1 form auto-fill assistant",
    ],
    limitations: [
      "No AI Forensic Finder",
      "No document export (Word/PDF)",
      "No cross-examination questions",
    ],
    cta: "Current Plan",
    ctaAction: "disabled",
    popular: false,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Full power. Unlimited cases. One payment.",
    price: 49,
    priceLabel: "one-time payment",
    monthlyOption: 19,
    icon: Crown,
    features: [
      "Unlimited active cases",
      "10GB evidence storage",
      "Forensic AI contradiction finder",
      "Full document generator",
      "Word/PDF export",
      "Hearing prep pack",
      "Cross-examination questions",
      "Priority support",
    ],
    limitations: [],
    cta: "Get Pro Access",
    ctaAction: "purchase",
    popular: true,
    highlight: true,
    badge: "BEST VALUE",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    description: "Never pay again. Forever access.",
    price: 99,
    priceLabel: "one-time, forever",
    icon: Rocket,
    features: [
      "Everything in Pro",
      "Lifetime updates included",
      "Priority support forever",
      "Early access to new features",
      "Beta features access",
      "Founding member badge",
    ],
    limitations: [],
    cta: "Get Lifetime Access",
    ctaAction: "purchase",
    popular: false,
    highlight: false,
  },
]

const addOns = [
  {
    id: "forensic_deep",
    name: "Deep Forensic Audit",
    description: "AI barrister-level analysis of your ET3",
    price: 29,
    icon: Scale,
    features: [
      "Anchor lie detection",
      "Contradiction mapping",
      "Strategic recommendations",
      "PDF report",
    ],
  },
  {
    id: "document_pack",
    name: "Document Pack",
    description: "All template access + unlimited generations",
    price: 19,
    icon: FileText,
    features: [
      "Grievance letters",
      "SAR requests",
      "ET1 drafts",
      "Witness statements",
    ],
  },
  {
    id: "content_pack",
    name: "Content Pack",
    description: "100 AI posts for professional branding",
    price: 19,
    icon: Sparkles,
    features: [
      "100 post credits",
      "All platforms",
      "Scheduling",
      "Never expires",
    ],
  },
]

const bankDetails = {
  accountName: "IKENGA Ltd",
  sortCode: "04-00-04",
  accountNumber: "12345678",
  reference: "PRO-[YOUR_EMAIL]",
}

export default function PricingPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
          1,847+ workers building stronger cases
        </Badge>
        <h1 className="text-4xl font-bold text-foreground">
          Start Free. <span className="text-gold">Upgrade When You Win.</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">
          No hidden fees. No subscriptions to cancel. Pay once, use forever.
        </p>
      </div>

      {/* Main Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-card relative overflow-hidden transition-all ${
              plan.highlight 
                ? "border-2 border-gold shadow-lg shadow-gold/10" 
                : "border-border hover:border-gold/50"
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 left-0 right-0 bg-gold text-black text-center text-sm font-bold py-1">
                {plan.badge}
              </div>
            )}
            <CardHeader className={plan.badge ? "pt-10" : ""}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${plan.highlight ? "bg-gold/20" : "bg-muted"}`}>
                  <plan.icon className={`h-5 w-5 ${plan.highlight ? "text-gold" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${plan.highlight ? "text-gold" : "text-foreground"}`}>
                    {plan.price === 0 ? "£0" : `£${plan.price}`}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.priceLabel}</p>
                {plan.monthlyOption && (
                  <p className="text-xs text-gold mt-1">+ optional £{plan.monthlyOption}/mo premium support</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlight ? "text-gold" : "text-green-500"}`} />
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
                        <span className="h-4 w-4 flex items-center justify-center shrink-0">-</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
            <CardFooter>
              {plan.ctaAction === "disabled" ? (
                <Button variant="outline" className="w-full" disabled>
                  {plan.cta}
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className={`w-full ${plan.highlight ? "bg-gold hover:bg-gold-light text-black font-bold" : ""}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.cta}
                      {plan.highlight && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Get {plan.name} Access</DialogTitle>
                      <DialogDescription>
                        Choose your payment method
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      {/* Price Summary */}
                      <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-center">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-3xl font-bold text-gold">£{plan.price}</p>
                        <p className="text-xs text-muted-foreground">{plan.priceLabel}</p>
                      </div>
                      
                      {/* Payment Options */}
                      <div className="grid gap-3">
                        <Button className="w-full bg-[#635BFF] hover:bg-[#5851db] h-12">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay with Card (Stripe)
                        </Button>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-12">
                              <Building className="h-4 w-4 mr-2" />
                              Pay by Bank Transfer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Bank Transfer Details</DialogTitle>
                              <DialogDescription>
                                Transfer £{plan.price} to upgrade your account
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
                                {[
                                  { label: "Account Name", value: bankDetails.accountName, key: "accountName" },
                                  { label: "Sort Code", value: bankDetails.sortCode, key: "sortCode", mono: true },
                                  { label: "Account Number", value: bankDetails.accountNumber, key: "accountNumber", mono: true },
                                ].map((item) => (
                                  <div key={item.key} className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{item.label}</span>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-medium ${item.mono ? "font-mono" : ""}`}>{item.value}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyToClipboard(item.value, item.key)}
                                      >
                                        {copied === item.key ? (
                                          <CheckCircle className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <Separator />
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">Amount</span>
                                  <span className="font-bold text-lg text-gold">£{plan.price}</span>
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
                                Use your email as the reference. Account upgraded within 24 hours of payment.
                              </p>
                              <Button className="w-full bg-gold hover:bg-gold-light text-black">
                                {"I've Completed the Transfer"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      {/* Trust signals */}
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Secure
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          30-day guarantee
                        </span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add-ons Section */}
      <div className="pt-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Add-Ons</h2>
          <p className="text-muted-foreground mt-1">
            Already on Free? Buy just what you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {addOns.map((addon) => (
            <Card key={addon.id} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <addon.icon className="h-5 w-5 text-gold" />
                    <CardTitle className="text-base">{addon.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-gold border-gold/30">
                    £{addon.price}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{addon.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="grid grid-cols-2 gap-1">
                  {addon.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-gold shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  Add for £{addon.price}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* The IKENGA Guarantee */}
      <Card className="bg-gold/5 border-gold/30">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gold/20">
                <Shield className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">The IKENGA Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  If our AI does not add clear value to your case, you get a full refund. Automatically.
                </p>
              </div>
            </div>
            <Link href="/#guarantee" className="text-sm text-gold hover:underline whitespace-nowrap">
              Learn more
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-gold">1,847</p>
          <p className="text-xs text-muted-foreground">Active Users</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-gold">£4.2M+</p>
          <p className="text-xs text-muted-foreground">Compensation Won</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-2xl font-bold text-gold">89%</p>
          <p className="text-xs text-muted-foreground">Success Rate</p>
        </div>
      </div>
    </div>
  )
}
