import Link from 'next/link'
import Image from 'next/image'
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logos/ikenga-ai-logo-dark.png" 
              alt="IKENGA AI" 
              width={60} 
              height={60}
              className="rounded-lg"
            />
          </Link>
        </div>
        
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">
            Something went wrong during the authentication process. This could be due to 
            an expired link or a technical issue.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm"
          >
            Try logging in again
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/auth/sign-up"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-secondary text-foreground font-semibold hover:bg-muted transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Create a new account
          </Link>
          
          <Link 
            href="/"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to homepage
          </Link>
        </div>

        {/* Support */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Still having trouble?{' '}
            <a href="mailto:support@ikenga.ai" className="text-gold hover:text-gold-light">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
