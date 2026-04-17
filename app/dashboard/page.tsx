import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/lemonsqueezy";

export const metadata = {
  title: "Dashboard | Stripe Account Checker",
  description: "Access your account-protected Stripe risk mitigation dashboard."
};

export default async function DashboardPage() {
  const hasAccess = await hasAccessCookie();
  if (!hasAccess) {
    redirect("/");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-4 text-3xl font-bold text-slate-100">Risk Operations Dashboard</h1>
      <p className="mb-8 text-slate-300">
        Your access cookie is active. Use this workspace as your recurring payment-risk control center.
      </p>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Weekly Compliance Routine</h2>
          <ol className="space-y-2 text-sm text-slate-300">
            <li>1. Review disputes and fraud flags for your last 7 days of payments.</li>
            <li>2. Verify refund-policy clarity on product, checkout, and confirmation pages.</li>
            <li>3. Archive KYC/KYB and fulfillment evidence in a processor-ready folder.</li>
          </ol>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="mb-2 text-lg font-semibold text-slate-100">Ban-Risk Trigger Alerts</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>- Chargeback rate above 0.65% for 2 consecutive weeks</li>
            <li>- Refund rate above 10% after new campaign launch</li>
            <li>- Sudden volume spikes &gt; 2.5x baseline within 72 hours</li>
          </ul>
        </article>
      </section>

      <div className="mt-8">
        <Link href="/check" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400">
          Run a fresh risk analysis
        </Link>
      </div>
    </main>
  );
}
