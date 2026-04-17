import { NextResponse } from "next/server";
import { storeSuccessfulPurchase, verifyWebhookSignature } from "@/lib/lemonsqueezy";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    meta?: { event_name?: string };
    data?: { attributes?: { order_id?: number | string; user_email?: string; status?: string } };
  };

  const eventName = payload.meta?.event_name ?? "unknown";
  const orderId = String(payload.data?.attributes?.order_id ?? "").trim();
  const status = String(payload.data?.attributes?.status ?? "").trim().toLowerCase();
  const email = payload.data?.attributes?.user_email ?? null;

  if (!orderId) {
    return NextResponse.json({ message: "Missing order_id" }, { status: 400 });
  }

  if (["order_created", "subscription_created", "subscription_updated"].includes(eventName)) {
    await storeSuccessfulPurchase(orderId, email, status || "paid");
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
