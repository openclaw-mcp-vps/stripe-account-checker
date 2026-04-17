"use client";

import { useState } from "react";
import RiskReport from "@/components/RiskReport";
import { RiskAssessment, RiskInput } from "@/types/risk-assessment";

const defaultInput: RiskInput = {
  businessName: "",
  websiteUrl: "",
  category: "saas",
  monthlyVolumeUsd: 20000,
  avgTicketUsd: 79,
  chargebackRatePercent: 0.35,
  refundRatePercent: 6,
  countries: ["US"],
  hasClearRefundPolicy: true,
  hasDeliveryProof: true,
  kycReady: true,
  accountAgeMonths: 12
};

export default function RiskAnalyzer() {
  const [form, setForm] = useState<RiskInput>(defaultInput);
  const [result, setResult] = useState<RiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof RiskInput>(key: K, value: RiskInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await response.json()) as { assessment?: RiskAssessment; message?: string };
      if (!response.ok || !payload.assessment) {
        setError(payload.message ?? "Unable to run analysis");
        return;
      }
      setResult(payload.assessment);
    } catch {
      setError("Failed to analyze risk. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="grid gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-6 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          Business name
          <input
            required
            value={form.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Website URL
          <input
            required
            value={form.websiteUrl}
            onChange={(event) => update("websiteUrl", event.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Category
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value as RiskInput["category"])}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          >
            <option value="saas">SaaS</option>
            <option value="digital_goods">Digital goods</option>
            <option value="agency">Agency services</option>
            <option value="education">Education</option>
            <option value="supplements">Supplements</option>
            <option value="dropshipping">Dropshipping</option>
            <option value="crypto_related">Crypto-related</option>
            <option value="adult">Adult content</option>
            <option value="travel">Travel</option>
            <option value="financial_services">Financial services</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Monthly volume (USD)
          <input
            type="number"
            min={0}
            value={form.monthlyVolumeUsd}
            onChange={(event) => update("monthlyVolumeUsd", Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Average ticket (USD)
          <input
            type="number"
            min={0}
            value={form.avgTicketUsd}
            onChange={(event) => update("avgTicketUsd", Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Chargeback rate (%)
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.chargebackRatePercent}
            onChange={(event) => update("chargebackRatePercent", Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Refund rate (%)
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.refundRatePercent}
            onChange={(event) => update("refundRatePercent", Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          Account age (months)
          <input
            type="number"
            min={0}
            value={form.accountAgeMonths}
            onChange={(event) => update("accountAgeMonths", Number(event.target.value))}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
          Countries served (comma-separated ISO codes)
          <input
            value={form.countries.join(",")}
            onChange={(event) =>
              update(
                "countries",
                event.target.value
                  .split(",")
                  .map((code) => code.trim().toUpperCase())
                  .filter(Boolean)
              )
            }
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={form.hasClearRefundPolicy}
            onChange={(event) => update("hasClearRefundPolicy", event.target.checked)}
          />
          Clear refund policy is visible on site
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={form.hasDeliveryProof}
            onChange={(event) => update("hasDeliveryProof", event.target.checked)}
          />
          We keep proof of delivery/fulfillment
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-200 md:col-span-2">
          <input type="checkbox" checked={form.kycReady} onChange={(event) => update("kycReady", event.target.checked)} />
          KYC/KYB documentation is ready for processor review
        </label>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 rounded-md bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-60"
        >
          {loading ? "Analyzing" : "Analyze Stripe Ban Risk"}
        </button>

        {error ? <p className="md:col-span-2 text-sm text-red-300">{error}</p> : null}
      </form>

      {result ? <RiskReport data={result} /> : null}
    </div>
  );
}
