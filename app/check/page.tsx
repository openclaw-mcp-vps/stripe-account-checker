import Link from "next/link";
import RiskAnalyzer from "@/components/RiskAnalyzer";
import PaymentButton from "@/components/PaymentButton";
import { hasAccessCookie } from "@/lib/lemonsqueezy";

export const metadata = {
  title: "Stripe Ban Risk Checker",
  description: "Analyze your business profile for Stripe restriction risk and mitigation steps."
};

export default async function CheckPage() {
  const hasAccess = await hasAccessCookie();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-100">Stripe Ban Risk Checker</h1>
        <Link href="/" className="text-sm text-slate-300 underline underline-offset-4">
          Back to landing page
        </Link>
      </div>

      {hasAccess ? (
        <>
          <p className="mb-8 max-w-3xl text-sm text-slate-300">
            Fill in accurate operating data to receive a policy-informed risk score. This analysis is designed to surface real
            vulnerabilities before you increase processing volume.
          </p>
          <RiskAnalyzer />
        </>
      ) : (
        <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-slate-100">This feature is available to paid users</h2>
          <p className="mb-5 text-sm text-slate-300">
            Complete checkout, then activate access using your Lemon Squeezy order ID to unlock full Stripe risk analysis.
          </p>
          <PaymentButton label="Unlock Checker - $19/mo" />
        </section>
      )}
    </main>
  );
}
