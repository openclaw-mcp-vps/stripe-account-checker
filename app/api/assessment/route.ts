import { NextResponse } from "next/server";
import { z } from "zod";

import { calculateRiskReport } from "@/lib/risk-calculator";
import { createAssessment } from "@/lib/store";

export const runtime = "nodejs";

const assessmentApiSchema = z.object({
  businessName: z.string().min(2),
  businessModel: z.enum([
    "saas",
    "marketplace",
    "fintech",
    "crypto",
    "money-services",
    "adult",
    "gambling",
    "supplements",
    "travel",
    "telemedicine",
    "other"
  ]),
  businessDescription: z.string().min(40),
  countriesOfOperation: z.array(z.string().min(2)).min(1),
  customerRegions: z.array(z.string().min(2)).min(1),
  monthlyVolumeUsd: z.number().min(1000),
  averageTicketUsd: z.number().positive(),
  chargebackRatePct: z.number().min(0).max(100),
  refundRatePct: z.number().min(0).max(100),
  crossBorderPct: z.number().min(0).max(100),
  fulfillmentDelayDays: z.number().min(0).max(365),
  supportSlaHours: z.number().min(1).max(168),
  usesPreorders: z.boolean(),
  holdsCustomerFunds: z.boolean(),
  facilitatesPayouts: z.boolean(),
  sanctionsScreening: z.boolean(),
  clearRefundPolicy: z.boolean(),
  kycAmlProgram: z.enum(["none", "basic", "advanced"]),
  legalEntityAgeMonths: z.number().min(0).max(600),
  founderExperienceYears: z.number().min(0).max(50),
  hasPriorProcessorTermination: z.boolean(),
  riskKeywords: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const input = assessmentApiSchema.parse(body);

    const report = calculateRiskReport(input);
    const record = await createAssessment(input, report);

    return NextResponse.json({
      id: record.id,
      report
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid assessment payload.", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Unable to process assessment right now. Please retry."
      },
      { status: 500 }
    );
  }
}
