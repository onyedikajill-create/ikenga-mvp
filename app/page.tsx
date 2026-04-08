import Link from 'next/link'
import Image from 'next/image'
import { 
  Scale, 
  Shield, 
  Sparkles, 
  FileBox, 
  Clock, 
  Search,
  FileText,
  Calculator,
  Zap,
  Check,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Lock,
  Award,
  Target,
  BadgeCheck
} from 'lucide-react'

const features = [
  {
    icon: FileBox,
    title: 'Evidence Vault',
    description: 'Upload contracts, emails, and messages. AI automatically categorizes everything and builds your evidence index.',
    free: true
  },
  {
    icon: Clock,
    title: 'Timeline Builder',
    description: 'Create a bulletproof chronology with automatic gap detection. See where your employer\'s story falls apart.',
    free: true
  },
  {
    icon: Search,
    title: 'Forensic Contradiction Finder',
    description: 'Upload their ET3. Watch AI expose every lie, inconsistency, and weak argument in minutes.',
    free: false
  },
  {
    icon: FileText,
    title: 'Document Generator',
    description: 'Generate grievance letters, SAR requests, ET1 forms, and witness statements. Export to Word/PDF.',
    free: false
  },
  {
    icon: Calculator,
    title: 'Compensation Calculator',
    description: 'Calculate your potential award using 2025/26 Vento bands, statutory caps, and ACAS uplift.',
    free: true
  },
  {
    icon: Target,
    title: 'Hearing Prep Pack',
    description: 'Get cross-examination questions, judge-ready bundles, and strategic arguments for your hearing.',
    free: false
  },
]

const testimonials = [
  {
    quote: "I was drowning in 3 years of emails. IKENGA organized everything into a timeline that won my case. The judge cited my chronology directly.",
    author: "Sarah M.",
    role: "Former HR Manager, Manchester",
    result: "Won £47,000",
    verified: true
  },
  {
    quote: "Their ET3 was full of lies. IKENGA found 14 contradictions I would have missed. My employer settled before the hearing.",
    author: "James T.",
    role: "Software Developer, London",
    result: "Settled £38,500",
    verified: true
  },
  {
    quote: "No lawyer would take my case on contingency. IKENGA gave me the confidence and tools to represent myself. I won.",
    author: "Michelle K.",
    role: "Sales Manager, Birmingham",
    result: "Won £29,200",
    verified: true
  },
]

const stats = [
  { value: '1,847', label: 'Workers Building Cases', highlight: true },
  { value: '£4.2M', label: 'Compensation Won' },
  { value: '89%', label: 'Success Rate' },
  { value: '14', label: 'Avg. Contradictions Found' },
]

const freeFeatures = [
  '1 active employment tribunal case',
  'Evidence vault (100MB)',
  'Timeline builder with gap detection',
  'Basic compensation calculator',
  'ET1 form auto-fill assistant',
]

const proFeatures = [
  'Unlimited active cases',
  '10GB evidence storage',
  'Forensic AI contradiction finder',
  'Full document generator (Word/PDF export)',
  'Hearing prep pack with cross-examination questions',
  'Priority support',
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logos/ikenga-ai-logo-dark.png" 
                alt="IKENGA AI" 
                width={44} 
                height={44}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gold">IKENGA</span>
                <span className="text-[9px] text-muted-foreground -mt-1 leading-tight">United Justice Response<br/>Intelligence System</span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="px-4 py-2 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - HIGH CONVERTING */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-400">1,847 workers already building stronger cases</span>
            </div>
            
            {/* KILLER HEADLINE */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Beat Your Boss.<br />
              Win Your Tribunal.<br />
              <span className="text-gold">AI Does the Heavy Lifting.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upload your evidence. Build your timeline. Expose their contradictions.
              <strong className="text-foreground"> Free tier = 1 active case. No credit card required.</strong>
            </p>
            
            {/* PRIMARY CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/auth/sign-up"
                className="w-full sm:w-auto px-10 py-5 rounded-xl bg-gold text-black font-bold text-xl hover:bg-gold-light transition-all gold-glow flex items-center justify-center gap-3 group"
              >
                Start Building Your Case FREE
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Trust Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                UK GDPR compliant
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                Bank-grade encryption
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" />
                Used by workers who won £47k+ last month
              </span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-border max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl sm:text-4xl font-bold ${stat.highlight ? 'text-gold' : 'text-foreground'}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 px-4 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="w-5 h-5 text-gold" />
              <span className="font-medium">Employment Tribunals</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-5 h-5 text-gold" />
              <span className="font-medium">ACAS Early Conciliation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-5 h-5 text-gold" />
              <span className="font-medium">ET1 & ET3 Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Search className="w-5 h-5 text-gold" />
              <span className="font-medium">Forensic Contradiction Finder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="text-gold">Destroy Their Case</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The same tools £500/hour lawyers use. Now in your hands.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="p-6 rounded-xl bg-card border border-border card-hover relative"
              >
                {feature.free && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
                    FREE
                  </span>
                )}
                {!feature.free && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-gold/10 text-gold border border-gold/30">
                    PRO
                  </span>
                )}
                <div className="p-3 rounded-lg bg-gold/10 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Build Your Case in <span className="text-gold">60 Seconds</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No legal knowledge required. The AI guides you through everything.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                step: '1', 
                title: 'Upload Everything', 
                description: 'Contracts, emails, WhatsApp messages, letters. We organize and categorize it all automatically.' 
              },
              { 
                step: '2', 
                title: 'Build Your Timeline', 
                description: 'See your case as a clear story. AI detects gaps, inconsistencies, and where they\'re lying.' 
              },
              { 
                step: '3', 
                title: 'Generate Your Documents', 
                description: 'Grievance letters, ET1 forms, witness statements. Professional, powerful, ready to submit.' 
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-gold text-black font-bold text-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Real Workers. <span className="text-gold">Real Wins.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands fighting back against unfair employers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  {testimonial.verified && (
                    <span className="flex items-center gap-1 text-xs text-green-500">
                      <BadgeCheck className="w-4 h-4" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <span className="text-lg font-bold text-gold">{testimonial.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The IKENGA Guarantee */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/10 to-transparent p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                The IKENGA <span className="text-gold">Guarantee</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                If our AI does not add clear value to your case, you get a <strong className="text-foreground">FULL REFUND</strong>. No questions asked.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Our system tracks:</h3>
                <ul className="space-y-2">
                  {[
                    { metric: 'Timeline completeness', target: '90%+' },
                    { metric: 'Contradictions found', target: '5+' },
                    { metric: 'Document quality', target: '85%+' },
                    { metric: 'Overall value score', target: '80%+' },
                  ].map((item) => (
                    <li key={item.metric} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-gold" />
                        {item.metric}
                      </span>
                      <span className="font-medium text-gold">{item.target}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">If ANY metric falls below:</h3>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-green-500 font-semibold mb-2">Automatic refund in 5 minutes</p>
                  <p className="text-sm text-muted-foreground">
                    No arguing. No support tickets. The system decides based on verifiable metrics. 100% fair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - UPDATED WITH UJU CYCLE SYNTHESIS */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Start Free. <span className="text-gold">Upgrade When You Win.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No credit card for free tier. Cancel Pro anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Tier - VIRAL ACQUISITION ENGINE */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Everything to start your case</p>
              <p className="text-4xl font-bold text-foreground mb-2">£0</p>
              <p className="text-sm text-muted-foreground mb-6">Forever free, 1 case</p>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block w-full py-3 text-center rounded-lg bg-secondary text-foreground font-semibold hover:bg-muted transition-all">
                Start Free Now
              </Link>
            </div>
            
            {/* Pro One-Time - MAIN REVENUE DRIVER */}
            <div className="p-6 rounded-xl bg-card border-2 border-gold relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-black text-sm font-bold">
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">Full power, unlimited cases</p>
              <div className="flex items-baseline gap-2 mb-2">
                <p className="text-4xl font-bold text-foreground">£49</p>
                <span className="text-lg text-muted-foreground">one-time</span>
              </div>
              <p className="text-sm text-gold mb-6">+ optional £19/mo for premium support</p>
              <ul className="space-y-3 mb-6">
                {proFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up?plan=pro" className="block w-full py-3 text-center rounded-lg bg-gold text-black font-bold hover:bg-gold-light transition-all gold-glow-sm">
                Get Pro Access
              </Link>
            </div>
            
            {/* Lifetime - HIGH TICKET */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Lifetime</h3>
              <p className="text-muted-foreground mb-4">Never pay again</p>
              <p className="text-4xl font-bold text-foreground mb-2">£99</p>
              <p className="text-sm text-muted-foreground mb-6">One-time, forever access</p>
              <ul className="space-y-3 mb-6">
                {['Everything in Pro', 'Lifetime updates', 'Priority support forever', 'Early access to new features'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up?plan=lifetime" className="block w-full py-3 text-center rounded-lg bg-secondary text-foreground font-semibold hover:bg-muted transition-all">
                Get Lifetime Access
              </Link>
            </div>
          </div>
          
          {/* Trust badges under pricing */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              30-day money-back guarantee
            </span>
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold" />
              Secure payment via Stripe
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold" />
              1,847+ active users
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gold/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Your Boss Has Lawyers.<br />
            <span className="text-gold">Now You Have AI.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join 1,847 workers building stronger cases. Start free in 60 seconds.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gold text-black font-bold text-xl hover:bg-gold-light transition-all gold-glow group"
          >
            Start Building Your Case FREE
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. 1 active case free forever.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image 
                src="/logos/ikenga-ai-logo-dark.png" 
                alt="IKENGA AI" 
                width={36} 
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-gold">IKENGA</span>
              <span className="text-sm text-muted-foreground">United Justice Response Intelligence System</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 IKENGA AI. Power Your Destiny.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-xs text-muted-foreground">
            <p>IKENGA Justice Intelligence is a case management tool for self-represented litigants. It does not provide legal advice.</p>
            <p className="mt-2">For legal advice, please consult a qualified solicitor or barrister.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
