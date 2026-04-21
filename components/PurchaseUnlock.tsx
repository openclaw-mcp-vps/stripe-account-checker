"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, ShieldAlert } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PurchaseUnlock() {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get("session_id") ?? "";
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [hasAccess, setHasAccess] = useState(false);

  const shouldAutoredeem = useMemo(
    () => Boolean(initialSessionId && status === "idle"),
    [initialSessionId, status]
  );

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/paywall/status", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { paid: boolean };
      setHasAccess(data.paid);
    })();
  }, []);

  useEffect(() => {
    if (!shouldAutoredeem) return;
    void redeem(initialSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoredeem]);

  async function redeem(value: string) {
    if (!value.trim()) {
      setStatus("error");
      setMessage("Enter a Stripe Checkout Session ID to unlock your account.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/paywall/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: value.trim() })
    });

    const body = (await response.json()) as { ok?: boolean; error?: string; message?: string };

    if (!response.ok || !body.ok) {
      setStatus("error");
      setMessage(body.error ?? "We could not verify your purchase yet. Try again in 30 seconds.");
      return;
    }

    setStatus("success");
    setHasAccess(true);
    setMessage(body.message ?? "Purchase verified. Access unlocked.");
  }

  return (
    <Card className="border-cyan-500/30 bg-slate-900/85">
      <CardHeader>
        <CardTitle className="font-heading text-2xl text-slate-50">Unlock your paid workspace</CardTitle>
        <CardDescription className="text-slate-300">
          After checkout, Stripe should redirect you here with <code>session_id</code>. We validate it against webhook receipts and set your secure access cookie.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="sessionId" className="text-sm text-slate-300">
            Stripe Checkout Session ID
          </label>
          <Input
            id="sessionId"
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            placeholder="cs_test_a1b2c3..."
          />
          <p className="text-xs text-slate-400">
            Configure your Stripe Payment Link success URL to include <code>?session_id={'{CHECKOUT_SESSION_ID}'}</code>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => redeem(sessionId)} disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Verifying purchase
              </>
            ) : (
              "Verify and unlock"
            )}
          </Button>
          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? ""}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800"
          >
            Buy now
          </a>
        </div>

        {status === "success" ? (
          <div className="flex items-start gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{message}</p>
          </div>
        ) : null}

        {hasAccess ? (
          <Link href="/assessment" className={cn(buttonVariants({ variant: "secondary" }))}>
            Start Risk Assessment
          </Link>
        ) : null}
      </CardContent>
    </Card>
  );
}
