import Link from "next/link";
import { AlertTriangle, BarChart3, CheckCircle2, ShieldAlert, ShieldCheck } from "lucide-react";
import PaymentButton from "@/components/PaymentButton";

const faqs = [
  {
    q: "How accurate is this Stripe ban risk model?",
    a: "It is a policy-informed risk estimator, not an official Stripe decision engine. It helps you identify known risk patterns before processing volume scales."
  },
  {
    q: "Can this guarantee my Stripe account will never be restricted?",
    a: "No tool can guarantee that, but this platform gives you prioritized controls that materially reduce avoidable policy and dispute triggers."
  },
  {
    q: "What do I get after payment?",
    a: "You get full access to the risk checker and dashboard recommendations, plus the ability to run unlimited reassessments as your business evolves."
  },
  {
    q: "Who is this for?",
    a: "Founders, operators, and fintech teams launching Stripe-powered revenue who want to avoid preventable compliance and dispute failures."
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
      <header className="mb-20 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide text-slate-200">
          Stripe Account Checker
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/check"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            Open Tool
          </Link>
          <PaymentButton label="Unlock Full Access" />
        </div>
      </header>

      <section className="mb-24 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            <ShieldAlert className="h-4 w-4" />
            Pre-flight Stripe Risk Check
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-slate-100 md:text-5xl">
            Check if your business will trigger Stripe bans before it costs you revenue.
          </h1>
          <p className="mb-8 max-w-xl text-lg text-slate-300">
            Stripe Account Checker analyzes your dispute profile, business category, compliance readiness, and market exposure to
            flag high-risk patterns that commonly cause holds, reserves, and account shutdowns.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/check"
              className="rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Run Free Preview Analysis
            </Link>
            <PaymentButton label="Start Full Access - $19/mo" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">What you get in under 3 minutes</h2>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <BarChart3 className="mt-0.5 h-4 w-4 text-blue-300" />
              A quantified Stripe restriction risk score from low to critical.
            </li>
            <li className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
              Your top policy and dispute vulnerabilities ranked by impact.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
              Action steps to reduce ban risk before launching paid traffic.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-20 grid gap-6 md:grid-cols-3">
        <article className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The Problem</h3>
          <p className="text-sm text-slate-300">
            Most founders only discover Stripe risk issues after a reserve hold or payout freeze. By then, acquisition spend and
            customer trust are already damaged.
          </p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The Solution</h3>
          <p className="text-sm text-slate-300">
            Run a structured underwriting simulation on your business profile before scale. Fix known failure points while stakes
            are low.
          </p>
        </article>
        <article className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
          <h3 className="mb-3 text-base font-semibold text-slate-100">The Outcome</h3>
          <p className="text-sm text-slate-300">
            Lower dispute exposure, cleaner compliance posture, and fewer surprises from payment-provider risk teams.
          </p>
        </article>
      </section>

      <section className="mb-20 rounded-xl border border-blue-500/30 bg-blue-500/10 p-8">
        <h2 className="mb-2 text-2xl font-bold text-slate-100">Simple pricing for payment-risk confidence</h2>
        <p className="mb-6 max-w-2xl text-slate-300">
          Use Stripe Account Checker as often as you want while refining offers, onboarding flows, and fraud controls.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-700 bg-slate-900/70 p-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">Pro Access</p>
            <p className="text-3xl font-bold text-slate-100">$19<span className="text-base text-slate-400">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Unlimited risk analyses
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Priority mitigation roadmap
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Access-protected dashboard
              </li>
            </ul>
          </div>
          <PaymentButton label="Unlock Pro Access" />
        </div>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-100">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <article key={faq.q} className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <h3 className="mb-2 text-base font-semibold text-slate-100">{faq.q}</h3>
              <p className="text-sm text-slate-300">{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
