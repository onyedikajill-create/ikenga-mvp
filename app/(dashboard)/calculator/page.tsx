"use client"

import { useState, useEffect } from "react"
import { Calculator, PoundSterling, AlertCircle, Info, TrendingUp, Scale, FileText, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Vento Bands 2025/26 (updated April 2025)
const VENTO_BANDS = {
  lower: { min: 1200, max: 11700, label: "Lower Band", description: "Less serious cases, one-off incidents" },
  middle: { min: 11700, max: 35200, label: "Middle Band", description: "Serious cases not meriting upper band" },
  upper: { min: 35200, max: 58700, label: "Upper Band", description: "Most serious cases, prolonged campaigns" },
  exceptional: { min: 58700, max: null, label: "Exceptional", description: "Only the most extreme cases" },
}

// Statutory caps 2025/26
const STATUTORY_CAPS = {
  weeklyPay: 700, // Statutory weekly pay cap
  basicAward: 21000, // Maximum basic award (30 weeks × £700)
  compensatoryAward: 115461, // Maximum compensatory award (52 weeks × £700 × 1.5 + adjustments)
}

export default function CalculatorPage() {
  // Form state
  const [weeklyPay, setWeeklyPay] = useState<string>("")
  const [yearsService, setYearsService] = useState<string>("")
  const [ageAtDismissal, setAgeAtDismissal] = useState<string>("")
  const [claimType, setClaimType] = useState<string>("")
  const [discriminationType, setDiscriminationType] = useState<string>("")
  const [ventoLevel, setVentoLevel] = useState<string>("")
  const [futureWagesWeeks, setFutureWagesWeeks] = useState<string>("26")
  const [mitigatedEarnings, setMitigatedEarnings] = useState<string>("0")
  const [pensionLoss, setPensionLoss] = useState<string>("0")
  const [lossOfStatutoryRights, setLossOfStatutoryRights] = useState<boolean>(true)
  const [acasUplift, setAcasUplift] = useState<string>("0")
  const [contributoryFault, setContributoryFault] = useState<string>("0")

  // Results state
  const [results, setResults] = useState<{
    basicAward: number
    compensatoryAward: number
    injuryToFeelings: number
    pensionLoss: number
    statutoryRights: number
    grossTotal: number
    acasAdjustment: number
    contributoryReduction: number
    netTotal: number
  } | null>(null)

  const calculateCompensation = () => {
    const weekly = Math.min(parseFloat(weeklyPay) || 0, STATUTORY_CAPS.weeklyPay)
    const years = parseFloat(yearsService) || 0
    const age = parseInt(ageAtDismissal) || 0
    const futureWeeks = parseInt(futureWagesWeeks) || 0
    const mitigated = parseFloat(mitigatedEarnings) || 0
    const pension = parseFloat(pensionLoss) || 0
    const acas = parseInt(acasUplift) || 0
    const contributory = parseInt(contributoryFault) || 0

    // Basic Award calculation
    // Under 22: 0.5 week per year
    // 22-40: 1 week per year
    // Over 41: 1.5 weeks per year
    let basicMultiplier = 1
    if (age < 22) basicMultiplier = 0.5
    else if (age >= 41) basicMultiplier = 1.5

    // Cap service at 20 years
    const cappedYears = Math.min(years, 20)
    let basicAward = Math.min(weekly * cappedYears * basicMultiplier, STATUTORY_CAPS.basicAward)

    // Compensatory Award calculation
    // Future loss of earnings
    const futureLoss = (weekly * futureWeeks) - mitigated
    
    // Statutory rights loss (typically £500-£700)
    const statutoryRightsValue = lossOfStatutoryRights ? 500 : 0

    // Injury to feelings (Vento bands)
    let injuryToFeelings = 0
    if (ventoLevel && VENTO_BANDS[ventoLevel as keyof typeof VENTO_BANDS]) {
      const band = VENTO_BANDS[ventoLevel as keyof typeof VENTO_BANDS]
      // Use midpoint of band
      injuryToFeelings = band.max ? (band.min + band.max) / 2 : band.min * 1.5
    }

    let compensatoryAward = Math.max(0, futureLoss) + statutoryRightsValue
    
    // Cap compensatory award for unfair dismissal (but not discrimination)
    if (claimType === "unfair_dismissal") {
      compensatoryAward = Math.min(compensatoryAward, STATUTORY_CAPS.compensatoryAward)
    }

    // Gross total before adjustments
    let grossTotal = basicAward + compensatoryAward + injuryToFeelings + pension

    // ACAS uplift (0-25%)
    const acasAdjustment = grossTotal * (acas / 100)
    grossTotal += acasAdjustment

    // Contributory fault reduction (0-100%)
    const contributoryReduction = grossTotal * (contributory / 100)
    const netTotal = grossTotal - contributoryReduction

    setResults({
      basicAward,
      compensatoryAward,
      injuryToFeelings,
      pensionLoss: pension,
      statutoryRights: statutoryRightsValue,
      grossTotal: grossTotal - acasAdjustment,
      acasAdjustment,
      contributoryReduction,
      netTotal,
    })
  }

  useEffect(() => {
    if (weeklyPay && yearsService) {
      calculateCompensation()
    }
  }, [weeklyPay, yearsService, ageAtDismissal, claimType, ventoLevel, futureWagesWeeks, mitigatedEarnings, pensionLoss, lossOfStatutoryRights, acasUplift, contributoryFault])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compensation Calculator</h1>
          <p className="text-muted-foreground mt-1">
            Calculate potential Employment Tribunal awards using 2025/26 rates
          </p>
        </div>

        {/* Important Notice */}
        <Card className="bg-amber-500/10 border-amber-500/50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-500">Important Disclaimer</p>
                <p className="text-sm text-muted-foreground">
                  This calculator provides estimates only and should not be relied upon as legal advice. 
                  Actual awards depend on many factors and are at the Tribunal&apos;s discretion. 
                  Consult a qualified employment lawyer for specific advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calculator Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Employment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyPay" className="flex items-center gap-1">
                      Weekly Gross Pay (GBP)
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your gross weekly pay before tax. Statutory cap is £{STATUTORY_CAPS.weeklyPay}/week.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative">
                      <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="weeklyPay"
                        type="number"
                        placeholder="e.g., 600"
                        value={weeklyPay}
                        onChange={(e) => setWeeklyPay(e.target.value)}
                        className="pl-9 bg-background"
                      />
                    </div>
                    {parseFloat(weeklyPay) > STATUTORY_CAPS.weeklyPay && (
                      <p className="text-xs text-amber-500">Capped at £{STATUTORY_CAPS.weeklyPay}/week for calculation</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsService" className="flex items-center gap-1">
                      Years of Service
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Complete years of continuous employment. Capped at 20 years for basic award.</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input
                      id="yearsService"
                      type="number"
                      placeholder="e.g., 5"
                      value={yearsService}
                      onChange={(e) => setYearsService(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageAtDismissal">Age at Dismissal</Label>
                    <Input
                      id="ageAtDismissal"
                      type="number"
                      placeholder="e.g., 35"
                      value={ageAtDismissal}
                      onChange={(e) => setAgeAtDismissal(e.target.value)}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="claimType">Primary Claim Type</Label>
                    <Select value={claimType} onValueChange={setClaimType}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select claim type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unfair_dismissal">Unfair Dismissal</SelectItem>
                        <SelectItem value="constructive_dismissal">Constructive Dismissal</SelectItem>
                        <SelectItem value="discrimination">Discrimination</SelectItem>
                        <SelectItem value="whistleblowing">Whistleblowing</SelectItem>
                        <SelectItem value="breach_contract">Breach of Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Discrimination/Injury to Feelings */}
                {(claimType === "discrimination" || claimType === "whistleblowing") && (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Injury to Feelings (Vento Bands 2025/26)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {claimType === "discrimination" && (
                          <div className="space-y-2">
                            <Label>Discrimination Type</Label>
                            <Select value={discriminationType} onValueChange={setDiscriminationType}>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="race">Race</SelectItem>
                                <SelectItem value="sex">Sex</SelectItem>
                                <SelectItem value="disability">Disability</SelectItem>
                                <SelectItem value="age">Age</SelectItem>
                                <SelectItem value="religion">Religion/Belief</SelectItem>
                                <SelectItem value="sexual_orientation">Sexual Orientation</SelectItem>
                                <SelectItem value="pregnancy">Pregnancy/Maternity</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Vento Band Level</Label>
                          <Select value={ventoLevel} onValueChange={setVentoLevel}>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lower">Lower: £{VENTO_BANDS.lower.min.toLocaleString()} - £{VENTO_BANDS.lower.max?.toLocaleString()}</SelectItem>
                              <SelectItem value="middle">Middle: £{VENTO_BANDS.middle.min.toLocaleString()} - £{VENTO_BANDS.middle.max?.toLocaleString()}</SelectItem>
                              <SelectItem value="upper">Upper: £{VENTO_BANDS.upper.min.toLocaleString()} - £{VENTO_BANDS.upper.max?.toLocaleString()}</SelectItem>
                              <SelectItem value="exceptional">Exceptional: £{VENTO_BANDS.exceptional.min.toLocaleString()}+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Future Loss */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Future Loss of Earnings</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="futureWeeks" className="flex items-center gap-1">
                        Weeks of Future Loss
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Expected time to find equivalent employment. Typically 13-52 weeks.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="futureWeeks"
                        type="number"
                        value={futureWagesWeeks}
                        onChange={(e) => setFutureWagesWeeks(e.target.value)}
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mitigatedEarnings" className="flex items-center gap-1">
                        Mitigated Earnings (Total)
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Total earnings from new employment during the loss period.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="mitigatedEarnings"
                          type="number"
                          value={mitigatedEarnings}
                          onChange={(e) => setMitigatedEarnings(e.target.value)}
                          className="pl-9 bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pensionLoss">Pension Loss (GBP)</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pensionLoss"
                          type="number"
                          placeholder="0"
                          value={pensionLoss}
                          onChange={(e) => setPensionLoss(e.target.value)}
                          className="pl-9 bg-background"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="space-y-0.5">
                        <Label>Loss of Statutory Rights</Label>
                        <p className="text-xs text-muted-foreground">Typically £500</p>
                      </div>
                      <Switch
                        checked={lossOfStatutoryRights}
                        onCheckedChange={setLossOfStatutoryRights}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Adjustments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Adjustments</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acasUplift" className="flex items-center gap-1">
                        ACAS Uplift (%)
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">0-25% uplift if employer failed to follow ACAS Code of Practice.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select value={acasUplift} onValueChange={setAcasUplift}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% - No uplift</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="25">25% - Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contributoryFault" className="flex items-center gap-1">
                        Contributory Fault (%)
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Reduction if your conduct contributed to dismissal.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Select value={contributoryFault} onValueChange={setContributoryFault}>
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% - No reduction</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="20">20%</SelectItem>
                          <SelectItem value="25">25%</SelectItem>
                          <SelectItem value="50">50%</SelectItem>
                          <SelectItem value="75">75%</SelectItem>
                          <SelectItem value="100">100% - Full reduction</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <Card className="bg-card border-border sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Estimated Award
                </CardTitle>
                <CardDescription>Based on 2025/26 statutory rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Basic Award</span>
                        <span className="font-medium">{formatCurrency(results.basicAward)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Compensatory Award</span>
                        <span className="font-medium">{formatCurrency(results.compensatoryAward)}</span>
                      </div>
                      {results.injuryToFeelings > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Injury to Feelings</span>
                          <span className="font-medium">{formatCurrency(results.injuryToFeelings)}</span>
                        </div>
                      )}
                      {results.pensionLoss > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Pension Loss</span>
                          <span className="font-medium">{formatCurrency(results.pensionLoss)}</span>
                        </div>
                      )}
                      {results.statutoryRights > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Statutory Rights</span>
                          <span className="font-medium">{formatCurrency(results.statutoryRights)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Gross Total</span>
                        <span className="font-medium">{formatCurrency(results.grossTotal)}</span>
                      </div>

                      {results.acasAdjustment > 0 && (
                        <div className="flex justify-between items-center text-green-500">
                          <span>ACAS Uplift (+{acasUplift}%)</span>
                          <span>+{formatCurrency(results.acasAdjustment)}</span>
                        </div>
                      )}

                      {results.contributoryReduction > 0 && (
                        <div className="flex justify-between items-center text-red-500">
                          <span>Contributory Fault (-{contributoryFault}%)</span>
                          <span>-{formatCurrency(results.contributoryReduction)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-foreground text-lg">Estimated Total</span>
                        <span className="font-bold text-primary text-2xl">{formatCurrency(results.netTotal)}</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Schedule of Loss
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Scale className="h-4 w-4 mr-2" />
                        Compare with Settlement Offer
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your employment details to calculate estimated compensation</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vento Bands Reference */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  Vento Bands 2025/26
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(VENTO_BANDS).map(([key, band]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{band.label}</span>
                    <span className="font-medium">
                      £{band.min.toLocaleString()}{band.max ? ` - £${band.max.toLocaleString()}` : "+"}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
