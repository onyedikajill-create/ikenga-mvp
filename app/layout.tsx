import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "UJRIS | Universal Justice Response Intelligence System",
  description: "Justice Shouldn't Require a Lawyer to Survive. AI-powered legal tools for self-represented litigants. Build your case, expose contradictions with forensic AI, and fight for justice.",
  keywords: ["employment tribunal", "unfair dismissal", "workplace justice", "ET1", "ET3", "ACAS", "self-represented litigant", "legal AI", "UJRIS", "discrimination"],
  authors: [{ name: "UJRIS" }],
  openGraph: {
    title: "UJRIS | Justice Shouldn't Require a Lawyer to Survive",
    description: "AI-powered legal tools for self-represented litigants. Build your case, expose contradictions, and fight for justice.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#FFD700",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
