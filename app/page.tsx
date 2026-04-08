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
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: FileBox,
    title: 'Evidence Vault',
    description: 'Securely store and organize all your case documents, emails, and evidence with automatic categorization.',
  },
  {
    icon: Clock,
    title: 'Timeline Builder',
    description: 'Create chronological timelines with automatic gap detection to strengthen your case narrative.',
  },
  {
    icon: Search,
    title: 'Forensic AI Auditor',
    description: 'Upload your ET3 response and let AI identify contradictions, anchor lies, and weak points.',
  },
  {
    icon: FileText,
    title: 'Document Generator',
    description: 'Generate grievance letters, SAR requests, ET1 forms, and witness statements in minutes.',
  },
  {
    icon: Calculator,
    title: 'Compensation Calculator',
    description: 'Calculate your potential award using 2025/26 Vento bands and statutory caps.',
  },
  {
    icon: Sparkles,
    title: 'Content Studio',
    description: 'AI-powered content generation for your brand across social platforms.',
  },
]

const testimonials = [
  {
    quote: "IKENGA helped me organize 3 years of emails and documents into a compelling timeline. I won my unfair dismissal case.",
    author: "Sarah M.",
    role: "Former HR Manager",
    result: "Won £45,000"
  },
  {
    quote: "The AI forensic tool found contradictions in my employer's ET3 that I would have missed. Game changer.",
    author: "James T.",
    role: "Software Developer",
    result: "Settled for £32,000"
  },
  {
    quote: "As a self-represented litigant, I was terrified. IKENGA gave me the confidence and tools to fight back.",
    author: "Michelle K.",
    role: "Sales Executive",
    result: "Won £28,500"
  },
]

const stats = [
  { value: '2,847', label: 'Cases Managed' },
  { value: '£4.2M', label: 'Compensation Won' },
  { value: '89%', label: 'Success Rate' },
  { value: '4.9/5', label: 'User Rating' },
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
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold text-gold">IKENGA</span>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
              <Zap className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Justice Intelligence Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Power Your Destiny<br />
              <span className="text-gold-gradient">Across Every Platform</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The unified AI platform for self-represented litigants. Build your employment tribunal case, 
              expose contradictions, generate documents, and fight for workplace justice.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/auth/sign-up"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-gold text-black font-semibold text-lg hover:bg-gold-light transition-all gold-glow flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-lg bg-secondary text-foreground font-semibold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-gold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logos/Trust Section */}
      <section className="py-12 px-4 border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by self-represented litigants across the UK</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="w-6 h-6" />
              <span className="font-medium">Employment Tribunals</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-6 h-6" />
              <span className="font-medium">ACAS Early Conciliation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-6 h-6" />
              <span className="font-medium">ET1 & ET3 Forms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to <span className="text-gold">Win Your Case</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From evidence organization to AI-powered analysis, we give you the tools that expensive lawyers use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="p-6 rounded-xl bg-card border border-border card-hover"
              >
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
              How IKENGA <span className="text-gold">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to build a winning case
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload Your Evidence', description: 'Add contracts, emails, letters, and any documents related to your case. We automatically organize and categorize everything.' },
              { step: '2', title: 'Build Your Timeline', description: "Create a chronological narrative of events. Our AI detects gaps and inconsistencies in your employer's story." },
              { step: '3', title: 'Generate Documents', description: 'Create professional grievance letters, SAR requests, and tribunal documents with AI assistance.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold text-black font-bold text-xl flex items-center justify-center mx-auto mb-4">
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
              Real People, <span className="text-gold">Real Results</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands who have fought back against unfair treatment
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <span className="text-sm font-semibold text-gold">{testimonial.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, <span className="text-gold">Transparent Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-4">Perfect for getting started</p>
              <p className="text-4xl font-bold text-foreground mb-6">£0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-6">
                {['1 active case', 'Evidence vault (100MB)', 'Basic timeline builder', 'Compensation calculator'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block w-full py-3 text-center rounded-lg bg-secondary text-foreground font-semibold hover:bg-muted transition-all">
                Get Started Free
              </Link>
            </div>
            
            {/* Pro */}
            <div className="p-6 rounded-xl bg-card border-2 border-gold relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gold text-black text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-4">For serious cases</p>
              <p className="text-4xl font-bold text-foreground mb-6">£9.99<span className="text-lg font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-6">
                {['Unlimited cases', 'Evidence vault (10GB)', 'AI Forensic Auditor', 'Document Generator', 'Priority support'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block w-full py-3 text-center rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm">
                Start Pro Trial
              </Link>
            </div>
            
            {/* Annual */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-2">Pro Annual</h3>
              <p className="text-muted-foreground mb-4">Save 34%</p>
              <p className="text-4xl font-bold text-foreground mb-6">£79<span className="text-lg font-normal text-muted-foreground">/year</span></p>
              <ul className="space-y-3 mb-6">
                {['Everything in Pro', '2 months free', 'Export all data', 'Dedicated support'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-5 h-5 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/sign-up" className="block w-full py-3 text-center rounded-lg bg-secondary text-foreground font-semibold hover:bg-muted transition-all">
                Get Annual Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to Fight for <span className="text-gold">Justice</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {"Join thousands of self-represented litigants who have won their cases with IKENGA. Start free today."}
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gold text-black font-semibold text-lg hover:bg-gold-light transition-all gold-glow"
          >
            Start Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-3">
              <Image 
                src="/logos/ikenga-ai-logo-dark.png" 
                alt="IKENGA AI" 
                width={40} 
                height={40}
                className="rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-gold">IKENGA</span>
                <p className="text-xs text-muted-foreground">Power Your Destiny</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/help" className="hover:text-foreground transition-colors">Help</Link>
              <a href="mailto:support@ikenga.ai" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2026 IKENGA AI. All rights reserved. Power Your Destiny Across Every Platform.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
