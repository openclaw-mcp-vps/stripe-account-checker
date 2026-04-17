import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stripe-account-checker.example.com"),
  title: "Stripe Account Checker | Predict Stripe Ban Risk Before You Launch",
  description:
    "Run a Stripe policy risk check on your business model, chargeback profile, onboarding flow, and compliance posture to reduce account ban risk.",
  keywords: [
    "Stripe ban checker",
    "Stripe risk analysis",
    "payments compliance",
    "fintech tool",
    "chargeback risk"
  ],
  openGraph: {
    title: "Stripe Account Checker",
    description:
      "Analyze your business against Stripe risk patterns and get a tactical mitigation plan.",
    type: "website",
    url: "https://stripe-account-checker.example.com",
    siteName: "Stripe Account Checker"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
