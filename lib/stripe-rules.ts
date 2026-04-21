import type { AssessmentInput } from "@/lib/risk-calculator";

export type RiskCategory =
  | "business_model"
  | "compliance"
  | "transactions"
  | "operations"
  | "history";

export type StripeRiskRule = {
  id: string;
  title: string;
  category: RiskCategory;
  weight: number;
  reason: string;
  recommendation: string;
  match: (input: AssessmentInput) => boolean;
};

const riskyVerticals = new Set([
  "crypto",
  "marketplace",
  "money-services",
  "adult",
  "gambling",
  "supplements",
  "travel",
  "telemedicine"
]);

const banKeywords = [
  "offshore",
  "anonymous",
  "synthetic identity",
  "high-yield",
  "signals",
  "binary options",
  "cbd",
  "escrow"
];

export const STRIPE_RISK_RULES: StripeRiskRule[] = [
  {
    id: "prohibited-vertical",
    title: "Business model falls in a frequently restricted vertical",
    category: "business_model",
    weight: 20,
    reason:
      "Certain industries are monitored heavily and can be suspended quickly when controls are weak.",
    recommendation:
      "Prepare documented compliance controls and a backup processor before launch.",
    match: (input) => riskyVerticals.has(input.businessModel)
  },
  {
    id: "holds-funds",
    title: "Platform holds customer or merchant funds",
    category: "business_model",
    weight: 18,
    reason:
      "Holding third-party funds increases money transmitter and safeguarding risk.",
    recommendation:
      "Avoid custody where possible and use regulated payout rails with clear fund flow docs.",
    match: (input) => input.holdsCustomerFunds || input.facilitatesPayouts
  },
  {
    id: "weak-kyc",
    title: "KYC/AML controls are missing or basic",
    category: "compliance",
    weight: 14,
    reason:
      "Stripe reviews AML posture closely when onboarding risk-sensitive businesses.",
    recommendation:
      "Implement tiered KYC checks, sanctions screening, and a manual escalation workflow.",
    match: (input) => input.kycAmlProgram !== "advanced"
  },
  {
    id: "no-sanctions-screening",
    title: "No sanctions screening while serving international customers",
    category: "compliance",
    weight: 12,
    reason:
      "Cross-border businesses without sanctions controls face immediate enforcement risk.",
    recommendation:
      "Add sanctions and PEP checks before account creation and on recurring intervals.",
    match: (input) => input.crossBorderPct > 30 && !input.sanctionsScreening
  },
  {
    id: "high-chargebacks",
    title: "Projected chargeback rate is above Stripe comfort zone",
    category: "transactions",
    weight: 16,
    reason:
      "Chargebacks above roughly 0.75% can trigger reserve requirements or account suspension.",
    recommendation:
      "Tighten fraud filters, improve descriptor clarity, and add a pre-dispute refund policy.",
    match: (input) => input.chargebackRatePct >= 0.75
  },
  {
    id: "high-refunds",
    title: "Projected refund rate is elevated",
    category: "transactions",
    weight: 10,
    reason:
      "High refund volume signals customer dissatisfaction and increases monitoring risk.",
    recommendation:
      "Add clearer expectations at checkout and shorten support response time for billing disputes.",
    match: (input) => input.refundRatePct >= 12
  },
  {
    id: "large-ticket",
    title: "Large average ticket size",
    category: "transactions",
    weight: 8,
    reason:
      "Large transactions create concentration risk and higher potential dispute losses.",
    recommendation:
      "Add staged billing, identity checks for high-value orders, and signed service terms.",
    match: (input) => input.averageTicketUsd >= 2500
  },
  {
    id: "delayed-fulfillment",
    title: "Long delay between payment and fulfillment",
    category: "operations",
    weight: 10,
    reason:
      "Delayed fulfillment increases the chance of disputes and negative balance exposure.",
    recommendation:
      "Capture payment closer to delivery date or provide milestone-based invoicing.",
    match: (input) => input.fulfillmentDelayDays > 14 || input.usesPreorders
  },
  {
    id: "weak-support",
    title: "Support response time is too slow",
    category: "operations",
    weight: 6,
    reason:
      "Unresolved support tickets often become disputes and card network complaints.",
    recommendation:
      "Set a 24-hour first-response SLA and expose a one-click refund path.",
    match: (input) => input.supportSlaHours > 24
  },
  {
    id: "new-entity",
    title: "Legal entity is very new",
    category: "history",
    weight: 8,
    reason:
      "New entities with little processing history are under tighter scrutiny.",
    recommendation:
      "Launch with conservative volume limits and document founder track record.",
    match: (input) => input.legalEntityAgeMonths < 6
  },
  {
    id: "prior-termination",
    title: "Prior processor termination or frozen account",
    category: "history",
    weight: 20,
    reason:
      "Previous terminations are a major negative signal during underwriting.",
    recommendation:
      "Disclose prior incidents proactively with remediation evidence and updated controls.",
    match: (input) => input.hasPriorProcessorTermination
  },
  {
    id: "keyword-risk",
    title: "Description includes high-risk terms",
    category: "business_model",
    weight: 8,
    reason:
      "Risk keywords in public copy can trigger manual review or pre-emptive restrictions.",
    recommendation:
      "Revise marketing copy and compliance docs to clearly state allowed, lawful use cases.",
    match: (input) => {
      const haystack = `${input.businessDescription} ${input.riskKeywords.join(" ")}`.toLowerCase();
      return banKeywords.some((keyword) => haystack.includes(keyword));
    }
  }
];

export const RISK_CREDITS = [
  {
    id: "advanced-kyc-credit",
    category: "compliance" as const,
    score: -8,
    applies: (input: AssessmentInput) => input.kycAmlProgram === "advanced"
  },
  {
    id: "strong-policy-credit",
    category: "operations" as const,
    score: -6,
    applies: (input: AssessmentInput) => input.clearRefundPolicy && input.supportSlaHours <= 12
  },
  {
    id: "low-cross-border-credit",
    category: "transactions" as const,
    score: -4,
    applies: (input: AssessmentInput) => input.crossBorderPct <= 15
  },
  {
    id: "experienced-founder-credit",
    category: "history" as const,
    score: -4,
    applies: (input: AssessmentInput) => input.founderExperienceYears >= 5
  }
];
