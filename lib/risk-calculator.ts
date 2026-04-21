import { RISK_CREDITS, STRIPE_RISK_RULES, type RiskCategory } from "@/lib/stripe-rules";

export type BusinessModel =
  | "saas"
  | "marketplace"
  | "fintech"
  | "crypto"
  | "money-services"
  | "adult"
  | "gambling"
  | "supplements"
  | "travel"
  | "telemedicine"
  | "other";

export type KycLevel = "none" | "basic" | "advanced";

export type AssessmentInput = {
  businessName: string;
  businessModel: BusinessModel;
  businessDescription: string;
  countriesOfOperation: string[];
  customerRegions: string[];
  monthlyVolumeUsd: number;
  averageTicketUsd: number;
  chargebackRatePct: number;
  refundRatePct: number;
  crossBorderPct: number;
  fulfillmentDelayDays: number;
  supportSlaHours: number;
  usesPreorders: boolean;
  holdsCustomerFunds: boolean;
  facilitatesPayouts: boolean;
  sanctionsScreening: boolean;
  clearRefundPolicy: boolean;
  kycAmlProgram: KycLevel;
  legalEntityAgeMonths: number;
  founderExperienceYears: number;
  hasPriorProcessorTermination: boolean;
  riskKeywords: string[];
};

export type TriggeredRule = {
  id: string;
  title: string;
  category: RiskCategory;
  weight: number;
  reason: string;
  recommendation: string;
};

export type CategoryScore = {
  category: RiskCategory;
  score: number;
};

export type RiskReportData = {
  score: number;
  band: "Low" | "Moderate" | "High" | "Critical";
  suspensionLikelihood: string;
  summary: string;
  triggeredRules: TriggeredRule[];
  recommendations: string[];
  categoryScores: CategoryScore[];
  generatedAt: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const toBand = (score: number): RiskReportData["band"] => {
  if (score < 25) return "Low";
  if (score < 50) return "Moderate";
  if (score < 75) return "High";
  return "Critical";
};

const likelihoodCopy: Record<RiskReportData["band"], string> = {
  Low: "Low likelihood of suspension if controls are implemented before launch.",
  Moderate:
    "Moderate likelihood of payout holds or enhanced monitoring unless risk controls improve.",
  High: "High likelihood of account restrictions or reserve requirements during onboarding.",
  Critical: "Critical suspension risk. Stripe onboarding is likely to fail without major remediation."
};

const summaryCopy: Record<RiskReportData["band"], string> = {
  Low: "Your model is generally Stripe-compatible with a few operational improvements.",
  Moderate:
    "Your model can work on Stripe, but current controls leave visible underwriting gaps.",
  High: "Your current setup is likely to trigger manual review and restrictive controls quickly.",
  Critical: "Your current setup conflicts with multiple high-risk Stripe enforcement triggers."
};

export function calculateRiskReport(input: AssessmentInput): RiskReportData {
  const baseScore = 10;
  const triggeredRules = STRIPE_RISK_RULES.filter((rule) => rule.match(input)).map((rule) => ({
    id: rule.id,
    title: rule.title,
    category: rule.category,
    weight: rule.weight,
    reason: rule.reason,
    recommendation: rule.recommendation
  }));

  const ruleScore = triggeredRules.reduce((acc, rule) => acc + rule.weight, 0);
  const creditScore = RISK_CREDITS.filter((credit) => credit.applies(input)).reduce(
    (acc, credit) => acc + credit.score,
    0
  );

  let score = baseScore + ruleScore + creditScore;

  if (input.monthlyVolumeUsd >= 250000) score += 6;
  if (input.monthlyVolumeUsd >= 1000000) score += 8;
  if (input.businessModel === "fintech" && input.kycAmlProgram === "none") score += 12;

  score = clamp(Math.round(score), 1, 99);

  const band = toBand(score);

  const categoryAccumulator = new Map<RiskCategory, number>([
    ["business_model", 0],
    ["compliance", 0],
    ["transactions", 0],
    ["operations", 0],
    ["history", 0]
  ]);

  for (const rule of triggeredRules) {
    categoryAccumulator.set(rule.category, (categoryAccumulator.get(rule.category) ?? 0) + rule.weight);
  }

  for (const credit of RISK_CREDITS) {
    if (credit.applies(input)) {
      categoryAccumulator.set(credit.category, Math.max(0, (categoryAccumulator.get(credit.category) ?? 0) + credit.score));
    }
  }

  const recommendations = Array.from(
    new Set([
      ...triggeredRules.map((rule) => rule.recommendation),
      "Publish a transparent terms of service and prohibited-use policy before onboarding.",
      "Run a 90-day soft-launch with capped volume and weekly risk metric reviews.",
      "Maintain a documented incident-response process for chargebacks, fraud, and sanctions alerts."
    ])
  ).slice(0, 7);

  return {
    score,
    band,
    suspensionLikelihood: likelihoodCopy[band],
    summary: summaryCopy[band],
    triggeredRules,
    recommendations,
    categoryScores: Array.from(categoryAccumulator.entries()).map(([category, value]) => ({
      category,
      score: clamp(value, 0, 40)
    })),
    generatedAt: new Date().toISOString()
  };
}
