import Link from "next/link";
import { ArrowRight, ShieldAlert, WalletCards } from "lucide-react";

import { PricingCard } from "@/components/PricingCard";

const faqs = [
  {
    question: "How accurate is the ban prediction?",
    answer:
      "The model combines common Stripe enforcement triggers, dispute thresholds, and compliance signals. It is not legal advice, but it reliably surfaces the same issues that force manual underwriting reviews."
  },
  {
    question: "Who should use this before launch?",
    answer:
      "SaaS founders with cross-border plans, marketplaces handling third-party funds, fintech builders, and any business with high-ticket or delayed-fulfillment transactions."
  },
  {
    question: "How do I unlock access after paying?",
    answer:
      "Use Stripe Payment Link checkout, then return to the dashboard with your checkout session ID. We validate it from webhook records and issue a secure access cookie."
  }
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            Fintech risk intelligence for founders
          </p>
          <h1 className="font-heading text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Check if your business will trigger Stripe bans before you integrate
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Stripe suspensions can wipe out revenue overnight. Stripe Account Checker scores your business model, transaction behavior, and compliance posture against known enforcement patterns so you can fix red flags early.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? ""}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-cyan-500 px-6 text-base font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Unlock for $19/mo
            </a>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-6 text-base font-semibold text-slate-100 transition-colors hover:bg-slate-800"
            >
              Already paid
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="space-y-5">
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4">
              <p className="text-sm font-semibold text-rose-200">Critical Founder Problem</p>
              <p className="mt-2 text-sm text-rose-100">
                Founders often discover Stripe risk only after launch, when payout holds or sudden bans freeze payroll and growth.
              </p>
            </div>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
              <p className="text-sm font-semibold text-cyan-200">What this tool gives you</p>
              <ul className="mt-2 space-y-2 text-sm text-cyan-100">
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  Quantified suspension risk score with category breakdown
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  Trigger-level explanations tied to your answers
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                  Action plan to reduce underwriting risk before onboarding
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <ShieldAlert className="h-6 w-6 text-rose-300" />
          <h2 className="mt-3 font-heading text-xl text-slate-100">Problem</h2>
          <p className="mt-2 text-sm text-slate-300">
            Stripe enforcement has tightened for high-risk verticals, cross-border flows, and weak chargeback controls.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <WalletCards className="h-6 w-6 text-cyan-300" />
          <h2 className="mt-3 font-heading text-xl text-slate-100">Why founders pay</h2>
          <p className="mt-2 text-sm text-slate-300">
            $19/month is cheaper than redesigning your entire checkout stack after a sudden account freeze.
          </p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <ArrowRight className="h-6 w-6 text-emerald-300" />
          <h2 className="mt-3 font-heading text-xl text-slate-100">Outcome</h2>
          <p className="mt-2 text-sm text-slate-300">
            Launch with clear policy docs, safer transaction patterns, and an underwriting-ready compliance narrative.
          </p>
        </div>
      </section>

      <section id="pricing" className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div>
          <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">One plan, immediate risk visibility</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            Built for early-stage SaaS and fintech teams choosing payment infrastructure. Run unlimited assessments, compare scenarios, and reduce ban risk before engineering commits to Stripe.
          </p>
        </div>
        <PricingCard
          title="Stripe Account Checker"
          price="$19"
          cadence="per month"
          description="Risk scoring for founders deciding whether Stripe is safe for their model."
          features={[
            "Unlimited risk assessments",
            "Detailed trigger analysis and remediation actions",
            "Scenario testing for volume, geography, and dispute changes",
            "Dashboard access behind secure purchase cookie"
          ]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl text-slate-50 sm:text-4xl">FAQ</h2>
        <div className="grid gap-3">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
              <h3 className="font-semibold text-slate-100">{faq.question}</h3>
              <p className="mt-2 text-sm text-slate-300">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
