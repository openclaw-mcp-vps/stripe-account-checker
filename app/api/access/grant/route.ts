import { NextResponse } from "next/server";
import { z } from "zod";
import { grantAccessCookie, hasSuccessfulPurchase } from "@/lib/lemonsqueezy";

const schema = z.object({
  orderId: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Missing order ID." }, { status: 400 });
    }

    const paid = await hasSuccessfulPurchase(parsed.data.orderId);
    if (!paid) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Purchase not found yet. Wait for webhook delivery, then retry activation. Ensure your Lemon Squeezy webhook points to /api/webhooks/lemonsqueezy."
        },
        { status: 403 }
      );
    }

    await grantAccessCookie(parsed.data.orderId);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, message: "Unexpected server error." }, { status: 500 });
  }
}
