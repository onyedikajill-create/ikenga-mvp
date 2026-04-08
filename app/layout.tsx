import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "IKENGA AI | Justice Intelligence Platform",
  description: "UJRIS + IKENGA - The unified platform for self-represented litigants. Build your employment tribunal case, expose contradictions with AI forensics, and fight for workplace justice.",
  keywords: ["employment tribunal", "unfair dismissal", "workplace justice", "ET1", "ET3", "ACAS", "self-represented litigant", "legal AI"],
  authors: [{ name: "IKENGA AI" }],
  openGraph: {
    title: "IKENGA AI | Power Your Destiny Across Every Platform",
    description: "The unified intelligence platform for self-represented litigants. Build your case, expose contradictions, and fight for justice.",
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
