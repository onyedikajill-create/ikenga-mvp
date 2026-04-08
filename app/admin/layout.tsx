'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Brain, 
  Bell, 
  Users, 
  TrendingUp,
  Shield,
  Settings,
  LogOut,
  Activity,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', label: 'Super Dashboard', icon: LayoutDashboard },
  { href: '/admin/ai-learning', label: 'AI Learning', icon: Brain },
  { href: '/admin/alerts', label: 'Alerts', icon: Bell },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/admin/system', label: 'System Health', icon: Activity },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="relative h-10 w-10">
              <Image
                src="/logos/ikenga-logo.jpg"
                alt="IKENGA AI"
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gold">ADMIN</h1>
              <p className="text-xs text-muted-foreground">Super Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                  {item.label === 'Alerts' && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Admin Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Super Admin</p>
                <p className="text-xs text-muted-foreground">Full Access</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Exit Admin
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
