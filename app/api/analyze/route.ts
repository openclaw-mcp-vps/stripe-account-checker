import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeStripeRisk } from "@/lib/stripe-risk-rules";

const requestSchema = z.object({
  businessName: z.string().min(2),
  websiteUrl: z.string().url(),
  category: z.enum([
    "digital_goods",
    "saas",
    "agency",
    "education",
    "supplements",
    "dropshipping",
    "crypto_related",
    "adult",
    "travel",
    "financial_services",
    "other"
  ]),
  monthlyVolumeUsd: z.number().min(0).max(50_000_000),
  avgTicketUsd: z.number().min(0).max(500_000),
  chargebackRatePercent: z.number().min(0).max(100),
  refundRatePercent: z.number().min(0).max(100),
  countries: z.array(z.string().min(2).max(3)).min(1),
  hasClearRefundPolicy: z.boolean(),
  hasDeliveryProof: z.boolean(),
  kycReady: z.boolean(),
  accountAgeMonths: z.number().min(0).max(600)
});

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as unknown;
    const parsed = requestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input payload",
          errors: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const assessment = analyzeStripeRisk(parsed.data);
    return NextResponse.json({ assessment }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unexpected server error" }, { status: 500 });
  }
}
