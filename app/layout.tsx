import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import Link from "next/link";

import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stripe-account-checker.example.com"),
  title: {
    default: "Stripe Account Checker | Predict Stripe Suspension Risk",
    template: "%s | Stripe Account Checker"
  },
  description:
    "Analyze your business model, transaction profile, and compliance controls to estimate Stripe suspension risk before you integrate payments.",
  keywords: [
    "Stripe risk checker",
    "Stripe account suspension",
    "fintech startup tools",
    "payment compliance",
    "Stripe underwriting"
  ],
  openGraph: {
    title: "Stripe Account Checker",
    description:
      "Know your Stripe suspension risk before you build your payments stack. Get a score, risk triggers, and remediation plan.",
    type: "website",
    url: "https://stripe-account-checker.example.com"
  },
  twitter: {
    card: "summary_large_image",
    title: "Stripe Account Checker",
    description:
      "Founders use this tool to assess Stripe ban risk before launch and fix underwriting red flags early."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="text-foreground antialiased">
        <div className="relative min-h-screen">
          <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0d1117]/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <Link href="/" className="font-heading text-lg font-semibold text-slate-100">
                Stripe Account Checker
              </Link>
              <nav className="flex items-center gap-4 text-sm text-slate-300">
                <Link href="/dashboard" className="transition-colors hover:text-cyan-300">
                  Dashboard
                </Link>
                <Link href="/assessment" className="transition-colors hover:text-cyan-300">
                  Assessment
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
