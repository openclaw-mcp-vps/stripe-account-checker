import { NextResponse } from "next/server";
import { z } from "zod";

import { grantPaidAccess } from "@/lib/auth";
import { redeemPurchaseSession } from "@/lib/store";

export const runtime = "nodejs";

const redeemSchema = z.object({
  sessionId: z.string().min(10)
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const payload = redeemSchema.parse(body);

    const purchase = await redeemPurchaseSession(payload.sessionId);

    if (!purchase) {
      return NextResponse.json(
        {
          ok: false,
          error: "Purchase not found yet. Wait for Stripe webhook delivery and retry."
        },
        { status: 404 }
      );
    }

    await grantPaidAccess(30);

    return NextResponse.json({
      ok: true,
      message: "Purchase verified. Your access has been unlocked on this device."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: "Invalid session id." }, { status: 400 });
    }

    return NextResponse.json({ ok: false, error: "Redemption failed." }, { status: 500 });
  }
}
