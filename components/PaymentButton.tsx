"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  label?: string;
};

export default function PaymentButton({ label = "Buy" }: Props) {
  const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
  const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const checkoutHref =
    storeId && productId
      ? `https://checkout.lemonsqueezy.com/buy/${productId}?embed=1&media=0&logo=0&store=${storeId}`
      : "#";

  async function claimAccess() {
    if (!orderId.trim()) {
      setStatus("Enter your Lemon Squeezy order ID to activate access.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus(null);
      const response = await fetch("/api/access/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderId.trim() })
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        setStatus(payload.message ?? "Unable to validate your purchase yet.");
        return;
      }

      setStatus("Access activated. Redirecting to dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("Unexpected error while activating access.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />

      {storeId && productId ? (
        <a
          className="lemonsqueezy-button inline-flex h-10 items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          href={checkoutHref}
        >
          {label}
        </a>
      ) : (
        <Button type="button" variant="outline" className="cursor-not-allowed border-slate-700 bg-slate-700 text-slate-300" disabled>
          Set Lemon Squeezy env vars
        </Button>
      )}

      <div className="max-w-sm space-y-2 rounded-md border border-slate-700 bg-slate-900/70 p-3">
        <p className="text-xs text-slate-300">
          After payment, paste your Lemon Squeezy order ID to unlock this browser session.
        </p>
        <div className="flex gap-2">
          <input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Order ID"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-blue-500/50 focus:ring"
          />
          <Button
            type="button"
            onClick={claimAccess}
            variant="outline"
            size="sm"
            disabled={submitting}
            className="px-3"
          >
            {submitting ? "Checking" : "Activate"}
          </Button>
        </div>
        {status ? <p className="text-xs text-slate-300">{status}</p> : null}
      </div>
    </div>
  );
}
