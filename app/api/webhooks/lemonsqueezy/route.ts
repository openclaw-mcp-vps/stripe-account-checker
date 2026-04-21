import { NextResponse } from "next/server";

import { handleStripeWebhook } from "@/lib/stripe-webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (request.headers.get("stripe-signature")) {
    return handleStripeWebhook(request);
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "This endpoint is retained for backwards compatibility. Payments now use Stripe webhooks at /api/webhooks/stripe."
    },
    { status: 410 }
  );
}
