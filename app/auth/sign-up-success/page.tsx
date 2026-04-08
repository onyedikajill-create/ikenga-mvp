import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowRight } from 'lucide-react'

export default function SignUpSuccessPage() {
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
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gold/10 gold-glow">
            <Mail className="w-12 h-12 text-gold" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
          <p className="text-muted-foreground">
            {"We've sent you a confirmation link to verify your email address. "} 
            Click the link in the email to activate your account and start building your case.
          </p>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-lg bg-card border border-border text-left space-y-2">
          <p className="text-sm font-medium text-foreground">{"Didn't receive the email?"}</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• Wait a few minutes and try again</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gold text-black font-semibold hover:bg-gold-light transition-all gold-glow-sm"
          >
            Go to login
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <Link 
            href="/"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  )
}
