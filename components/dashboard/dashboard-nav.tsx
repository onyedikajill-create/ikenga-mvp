'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import {
  LayoutDashboard,
  Briefcase,
  FileBox,
  Clock,
  Search,
  FileText,
  Calculator,
  Sparkles,
  Settings,
  HelpCircle,
  Menu,
  X,
  Scale,
  Zap,
  Crown
} from 'lucide-react'

interface DashboardNavProps {
  user: User
  profile: Profile | null
}

const ujrisNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cases', label: 'My Cases', icon: Briefcase },
  { href: '/evidence', label: 'Evidence Vault', icon: FileBox },
  { href: '/timeline', label: 'Timeline Builder', icon: Clock },
  { href: '/forensic', label: 'Forensic Auditor', icon: Search, premium: true },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/calculator', label: 'Compensation', icon: Calculator },
]

const ikengaNavItems = [
  { href: '/content', label: 'Content Studio', icon: Sparkles },
]

const bottomNavItems = [
  { href: '/pricing', label: 'Pricing', icon: Crown },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/help', label: 'Help & Support', icon: HelpCircle },
]

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isPro = profile?.subscription_tier === 'pro_monthly' || profile?.subscription_tier === 'pro_annual'

  const NavLink = ({ href, label, icon: Icon, premium }: { href: string; label: string; icon: typeof LayoutDashboard; premium?: boolean }) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
    
    return (
      <Link
        href={href}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? 'bg-gold/10 text-gold border border-gold/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
        }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : ''}`} />
        <span className="flex-1">{label}</span>
        {premium && !isPro && (
          <Crown className="w-4 h-4 text-gold" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border text-foreground"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <Image 
              src="/logos/ikenga-ai-logo-dark.png" 
              alt="IKENGA AI" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-gold">IKENGA</h1>
              <p className="text-xs text-muted-foreground">Justice Intelligence</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
            {/* UJRIS Section */}
            <div>
              <div className="flex items-center gap-2 px-3 mb-3">
                <Scale className="w-4 h-4 text-gold" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  UJRIS Legal
                </span>
              </div>
              <div className="space-y-1">
                {ujrisNavItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </div>

            {/* IKENGA Section */}
            <div>
              <div className="flex items-center gap-2 px-3 mb-3">
                <Zap className="w-4 h-4 text-gold" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  IKENGA Content
                </span>
              </div>
              <div className="space-y-1">
                {ikengaNavItems.map((item) => (
                  <NavLink key={item.href} {...item} />
                ))}
              </div>
            </div>
          </nav>

          {/* Upgrade Banner */}
          {!isPro && (
            <div className="px-4 py-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-gold" />
                  <span className="font-semibold text-foreground">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlock unlimited cases, AI forensics, and premium features.
                </p>
                <Link
                  href="/pricing"
                  className="block w-full py-2 px-3 text-center text-sm font-semibold rounded-lg bg-gold text-black hover:bg-gold-light transition-colors"
                >
                  Upgrade from £9.99/mo
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Navigation */}
          <div className="px-4 py-4 border-t border-border space-y-1">
            {bottomNavItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
