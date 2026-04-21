import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { upsertPurchaseSession } from "@/lib/store";

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: {
      id?: string;
      customer_details?: {
        email?: string | null;
      } | null;
    };
  };
};

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function verifyStripeSignature(signatureHeader: string, body: string, secret: string) {
  const parts = signatureHeader.split(",").map((pair) => pair.trim());
  const timestamp = parts.find((pair) => pair.startsWith("t="))?.slice(2);
  const signatures = parts
    .filter((pair) => pair.startsWith("v1="))
    .map((pair) => pair.slice(3))
    .filter(Boolean);

  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}.${body}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");

  return signatures.some((signature) => safeCompare(signature, expected));
}

export async function handleStripeWebhook(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  if (!verifyStripeSignature(signature, rawBody, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: StripeEvent;

  try {
    event = JSON.parse(rawBody) as StripeEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const sessionId = event.data.object.id;
    if (sessionId) {
      await upsertPurchaseSession(sessionId, event.data.object.customer_details?.email ?? null);
    }
  }

  return NextResponse.json({ received: true });
}
