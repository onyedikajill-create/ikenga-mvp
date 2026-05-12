import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  getSiteMetadataBase,
} from "../src/ikenga/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteMetadataBase(),
  title: {
    default: `${APP_NAME} | ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "IKENGA AI",
    "AI content engine",
    "brand voice AI",
    "creator operating system",
    "marketing automation",
    "early access",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: `${APP_NAME} | ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${playfair.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col">
        {children}
        {/* UJU Cycle™ legal notice — required on all pages */}
        <footer
          style={{
            borderTop:     "1px solid #0e0e0e",
            padding:       "10px 20px",
            textAlign:     "center",
            background:    "#000",
          }}
        >
          <p style={{ margin: 0, fontSize: 10, color: "#2a2a2a", letterSpacing: "0.06em" }}>
            UJU CYCLE™ is a proprietary methodology of UJU GROUP LIMITED. Protected as trade secrets under UK law.
          </p>
        </footer>
      </body>
    </html>
  );
}
