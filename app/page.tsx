'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowRight, 
  Check, 
  Shield, 
  Scale,
  FileText,
  Clock,
  Search,
  Mail,
  Calendar,
  MousePointer,
  Wrench,
  FileOutput,
  MessageSquareQuote,
  HelpCircle,
  Zap,
  Heart,
  Car,
  Briefcase,
  Eye,
  FileBox,
  ShieldCheck,
  Brain,
  Video,
  Timer
} from 'lucide-react'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    alert('Welcome to the Justice Movement!')
    setName('')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-md border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/logos/ujris-logo-dark.jpg" 
                alt="UJRIS" 
                width={44} 
                height={44}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">
                <span className="text-[#d4a853]">UJ</span>
                <span className="text-white">RIS</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#resources" className="text-sm text-gray-300 hover:text-white transition-colors">Resources</Link>
            </div>
            
            <Link
              href="/auth/sign-up"
              className="px-5 py-2.5 rounded-lg bg-[#d4a853] text-[#1a1f2e] font-semibold text-sm hover:bg-[#e5b964] transition-all"
            >
              Start Free Assessment
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tags */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="text-[#d4a853] text-sm font-medium">AI-Powered</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-300 text-sm">UK Law</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-300 text-sm">Free to Start</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white mb-6 leading-tight">
            {"Justice Shouldn't Require a"}<br/>
            <span className="text-[#d4a853] italic">Lawyer</span> to Survive
          </h1>
          
          <p className="text-xl sm:text-2xl text-[#d4a853] mb-4 font-medium">
            Turn evidence into action. Turn discrimination into justice.
          </p>
          
          <p className="text-gray-400 text-lg mb-10 max-w-3xl mx-auto">
            Intelligence-driven legal power for self-represented litigants. Built for BAME communities — designed for everyone facing injustice.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-transparent border-2 border-white text-white font-semibold hover:bg-white hover:text-[#1a1f2e] transition-all"
            >
              Start Your Case
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#d4a853] text-[#1a1f2e] font-semibold hover:bg-[#e5b964] transition-all"
            >
              See All Tools
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-400 hover:text-white transition-colors font-medium"
            >
              How It Works
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mb-12">
            Free to start — no card needed · Your data stays on your device · Built by a discrimination survivor
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-white mb-1">3 months - 1 day</div>
              <div className="text-sm text-gray-400">ET Claim Window</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-white mb-1">68%</div>
              <div className="text-sm text-gray-400">ACAS cases settle before tribunal</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-white mb-1">£56,000</div>
              <div className="text-sm text-gray-400">Vento upper band</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-white mb-1">94%</div>
              <div className="text-sm text-gray-400">BAME claimants self-represented</div>
            </div>
          </div>
        </div>
      </section>

      {/* We Understand Your Struggle */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1a1f2e] mb-4">
              We Understand Your <span className="text-[#d4a853]">Struggle</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Every problem you face has a solution in UJRIS
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: HelpCircle, problem: '"I don\'t know where to start"', solution: 'Guided 4-step assessment gives you clarity in 10 minutes' },
              { icon: Zap, problem: '"They\'re denying everything"', solution: 'Forensic Analyser exposes contradictions line by line' },
              { icon: Scale, problem: '"Solicitors cost £250/hour"', solution: 'What costs £500 takes £29 here' },
              { icon: Clock, problem: '"I don\'t know my deadlines"', solution: 'Live countdown to tribunal filing deadlines' },
              { icon: Shield, problem: '"The system is designed to crush me"', solution: 'Anchor Lie Detection exposes foundational falsehoods' },
              { icon: Heart, problem: '"I\'m facing abuse AND discrimination"', solution: 'Covers domestic abuse, IOPC complaints, ICO breaches' },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-[#1a1f2e] border border-[#2a3142]">
                <div className="w-12 h-12 rounded-full bg-[#d4a853]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#d4a853]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 italic">{item.problem}</h3>
                <div className="w-12 h-0.5 bg-[#d4a853] mb-3"></div>
                <p className="text-gray-400 text-sm">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Justice in 3 Clicks */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="inline-block px-4 py-1 rounded-full bg-[#d4a853]/20 text-[#d4a853] text-sm font-medium mb-4">
              The 3-Click Rule
            </span>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Justice in <span className="text-[#d4a853]">3 Clicks</span>
            </h2>
            <p className="text-gray-400 text-lg">
              No complexity. No confusion. Just results.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { icon: MousePointer, step: '1', title: 'Open UJRIS', desc: 'Select or create your case' },
              { icon: Wrench, step: '2', title: 'Choose Your Tool', desc: 'Assessment, Forensic, SAR, or Timeline' },
              { icon: FileOutput, step: '3', title: 'Generate Report', desc: 'Court-ready PDF in seconds' },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-[#2a3142] border-2 border-[#3a4152] flex flex-col items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-[#d4a853] mb-1" />
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block w-24 h-0.5 border-t-2 border-dashed border-[#3a4152] mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Complete Legal Arsenal */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1a1f2e] mb-4">
              Your Complete <span className="text-[#d4a853]">Legal Arsenal</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Every tool you need to build, analyze, and win your case
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'Anchor Lie Detection', desc: '15 forensic detectors that expose contradictions and foundational falsehoods', highlight: true },
              { icon: FileText, title: 'Truth-Layer Reports', desc: 'Court-ready PDF documents that present your evidence professionally' },
              { icon: Calendar, title: 'Evidence Timeline', desc: 'Drag-and-drop timeline builder to organize your case chronologically' },
              { icon: Mail, title: 'SAR Intelligence', desc: 'Auto-generate Subject Access Requests to gather evidence legally' },
              { icon: ShieldCheck, title: 'Sovereign Shield', desc: 'Specialized pathways for domestic abuse and coercive control cases' },
              { icon: Brain, title: 'Case Intelligence', desc: 'AI-powered strength scoring to assess your chances of success' },
              { icon: FileBox, title: 'AI Document Drafting', desc: 'Generate grievance letters, ET1 guidance, and legal correspondence' },
              { icon: Video, title: 'CCTV Analyser', desc: 'Challenge video evidence and identify inconsistencies' },
              { icon: Timer, title: 'Deadlines Centre', desc: 'Live countdown timers so you never miss a filing deadline' },
            ].map((item, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-xl border ${item.highlight ? 'bg-[#1a1f2e] border-[#d4a853]' : 'bg-[#1a1f2e] border-[#2a3142]'}`}
              >
                <div className={`w-12 h-12 rounded-lg ${item.highlight ? 'bg-[#d4a853]/20' : 'bg-[#2a3142]'} flex items-center justify-center mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.highlight ? 'text-[#d4a853]' : 'text-[#4a9eff]'}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Are You Fighting? */}
      <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              What Are You <span className="text-[#d4a853]">Fighting?</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Select your case type to get started
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: FileText, category: 'DWP', title: 'PIP Appeal', desc: 'Challenge Personal Independence Payment decisions with evidence-based arguments' },
              { icon: Car, category: 'COUNCIL', title: 'Parking Ticket / PCN', desc: 'Fight unfair Penalty Charge Notices with procedural and substantive defenses' },
              { icon: Shield, category: 'INSURERS', title: 'Insurance Claim Denial', desc: 'Challenge rejected claims and bad faith insurance practices' },
              { icon: Briefcase, category: 'EMPLOYER', title: 'Employment Dispute', desc: 'Discrimination, unfair dismissal, harassment, and whistleblowing cases' },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-xl bg-[#2a3142] border border-[#3a4152] hover:border-[#d4a853] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-[#d4a853]/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#d4a853]" />
                </div>
                <span className="text-xs font-semibold text-[#d4a853] tracking-wider">{item.category}</span>
                <h3 className="text-lg font-semibold text-white mt-1 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <Link 
                  href="/auth/sign-up" 
                  className="inline-flex items-center text-[#d4a853] font-medium text-sm group-hover:gap-2 transition-all"
                >
                  Start Case <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1a1f2e] mb-4">
              Simple, <span className="text-[#d4a853]">Transparent Pricing</span>
            </h2>
            <p className="text-gray-600 text-lg">
              One payment. Your case analyzed. No hidden fees.
            </p>
          </div>
          
          <div className="rounded-2xl border-2 border-[#d4a853] bg-white p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-[#d4a853] text-[#1a1f2e] text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-[#1a1f2e] mb-2">£49</div>
              <p className="text-gray-500">one-time payment</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {[
                'Unlimited document uploads (any size)',
                'AI legal summary',
                'Timeline generation',
                'Ready-to-send appeal letter',
                'Password-protected PDF',
                '7-day refund if not useful',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/auth/sign-up"
              className="block w-full py-4 rounded-lg bg-[#d4a853] text-[#1a1f2e] font-semibold text-center hover:bg-[#e5b964] transition-all"
            >
              Start Your Case — £49 <ArrowRight className="inline w-5 h-5 ml-1" />
            </Link>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              90-minute delivery · Secure payment · 7-day refund
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
              Real People. Real <span className="text-[#d4a853]">Justice.</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands fighting back with UJRIS
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "UJRIS helped me identify contradictions in my employer's response that I would never have spotted. The Anchor Lie Detection feature was a game-changer for my race discrimination case.",
                name: 'M.O.',
                role: 'Employment Tribunal Claimant',
                tag: 'Race Discrimination'
              },
              {
                quote: "As someone with a disability fighting PIP denials, I felt powerless. UJRIS gave me the tools to organize my evidence and present my case clearly. I won my appeal.",
                name: 'A.K.',
                role: 'Self-Represented Litigant',
                tag: 'Disability Discrimination'
              },
              {
                quote: "I recommend UJRIS to everyone who comes to us feeling overwhelmed. It does what we wish we could do for every client - gives them real, actionable guidance.",
                name: 'C.A.',
                role: 'Citizens Advice Volunteer',
                tag: 'Advisory Role'
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 rounded-xl bg-[#2a3142] border border-[#3a4152]">
                <MessageSquareQuote className="w-10 h-10 text-[#d4a853] mb-4" />
                <p className="text-gray-300 italic mb-6">&quot;{testimonial.quote}&quot;</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[#d4a853]/20 text-[#d4a853] text-xs">
                    {testimonial.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#d4a853] mx-auto mb-8"></div>
          <blockquote className="text-2xl sm:text-3xl font-serif text-[#1a1f2e] mb-8 leading-relaxed">
            &quot;My resolve for justice is not a lifestyle choice. It is an inheritance. From a people who would rather walk into the sea than live as slaves.&quot;
          </blockquote>
          <p className="text-gray-500">
            — <span className="text-[#d4a853] font-semibold">ONYEDIKA MICHAEL OJIAKU</span>, FOUNDER
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Freedom is sacred', 'Justice is ancestral', 'Truth is spiritual', 'No one stands alone'].map((value, index) => (
              <span key={index} className="px-4 py-2 rounded-full bg-[#1a1f2e] text-white text-sm">
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1a1f2e]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
            Join the <span className="text-[#d4a853]">Justice Movement</span>
          </h2>
          <p className="text-gray-400 mb-2">Get instant access to UJRIS — free forever</p>
          <p className="text-[#d4a853] font-medium mb-8">1,249 people have joined</p>
          
          <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-[#2a3142] border border-[#3a4152] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
              required
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-[#2a3142] border border-[#3a4152] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4a853]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[#d4a853] text-[#1a1f2e] font-semibold hover:bg-[#e5b964] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Joining...' : 'Get Free Access'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          <p className="text-sm text-gray-500">No spam. No selling your data. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-[#141821] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/logos/ujris-logo-dark.jpg" 
                  alt="UJRIS" 
                  width={36} 
                  height={36}
                  className="rounded-lg"
                />
                <span className="text-lg font-bold">
                  <span className="text-[#d4a853]">UJ</span>
                  <span className="text-white">RIS</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {"Justice Shouldn't Require a Lawyer to Survive. AI-powered legal tools for self-represented litigants."}
              </p>
              <Link href="#" className="text-[#d4a853] text-sm font-medium">Justice Intelligence</Link>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Assessment Tool</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Forensic Analyser</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">SAR Generator</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Timeline Builder</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Learning Hub</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help Centre</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Report a Bug</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Accessibility</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-[#d4a853]/10 border border-[#d4a853]/30 mb-8">
            <p className="text-sm text-gray-300 text-center">
              <span className="text-[#d4a853] font-semibold">Important:</span> UJRIS is a decision-support tool, not legal advice. For complex legal matters, please consult a qualified solicitor or barrister.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500">© 2026 UJRIS. All rights reserved. Patent pending.</p>
            <p className="text-sm text-gray-500">Built with purpose. Powered by justice.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
