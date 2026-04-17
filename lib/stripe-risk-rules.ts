import { RiskAssessment, RiskFactor, RiskInput } from "@/types/risk-assessment";

const elevatedCategories = new Set<RiskInput["category"]>([
  "crypto_related",
  "adult",
  "dropshipping",
  "supplements",
  "financial_services"
]);

const highRiskCountries = new Set(["RU", "BY", "IR", "KP", "SY", "CU", "AF", "MM"]);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function factor(
  id: string,
  title: string,
  impact: RiskFactor["impact"],
  scoreDelta: number,
  explanation: string,
  recommendation: string
): RiskFactor {
  return { id, title, impact, scoreDelta, explanation, recommendation };
}

export function analyzeStripeRisk(input: RiskInput): RiskAssessment {
  const concerns: RiskFactor[] = [];
  const strengths: string[] = [];

  if (elevatedCategories.has(input.category)) {
    concerns.push(
      factor(
        "category-risk",
        "Business category has elevated acquiring scrutiny",
        "high",
        22,
        "Stripe and card networks apply tighter monitoring to your current business model due to higher fraud and dispute incidence trends.",
        "Document product legitimacy, supplier provenance, and clear customer authorization logs before scaling spend."
      )
    );
  } else {
    strengths.push("Your business category is typically easier to underwrite than known high-risk segments.");
  }

  if (input.chargebackRatePercent >= 0.9) {
    concerns.push(
      factor(
        "chargeback-rate",
        "Chargeback rate is above card-network tolerance",
        "high",
        30,
        "Your projected dispute ratio exceeds the threshold where payment processors usually escalate reserve holds or restrictions.",
        "Implement 3DS for risky transactions, improve descriptor clarity, and add post-purchase confirmation emails with support contact."
      )
    );
  } else if (input.chargebackRatePercent >= 0.6) {
    concerns.push(
      factor(
        "chargeback-rate",
        "Chargeback rate is trending toward risk limits",
        "medium",
        14,
        "You are below hard limits but close enough to trigger additional risk reviews as volume increases.",
        "Set a weekly dispute dashboard and start pre-dispute alerts through card network dispute products."
      )
    );
  } else {
    strengths.push("Your chargeback projection is currently inside a healthier processing range.");
  }

  if (input.refundRatePercent > 12) {
    concerns.push(
      factor(
        "refund-rate",
        "High refund ratio indicates product-experience mismatch",
        "medium",
        12,
        "High refund rates often signal expectation gaps and can indirectly increase disputes and compliance reviews.",
        "Rewrite offer and delivery claims to reduce buyer confusion, and add order confirmation with timeline expectations."
      )
    );
  }

  if (!input.hasClearRefundPolicy) {
    concerns.push(
      factor(
        "refund-policy",
        "Missing visible refund policy",
        "high",
        16,
        "Processors expect clear, accessible policy disclosures before checkout.",
        "Publish a plain-language refund policy in your footer and checkout flow, including time windows and contact paths."
      )
    );
  } else {
    strengths.push("A clear refund policy reduces underwriting uncertainty.");
  }

  if (!input.hasDeliveryProof) {
    concerns.push(
      factor(
        "delivery-proof",
        "Weak fulfillment evidence",
        "medium",
        9,
        "Lack of proof of delivery or usage makes representment harder during disputes.",
        "Capture shipment tracking IDs, license issuance logs, or signed service acceptance records for every transaction."
      )
    );
  } else {
    strengths.push("You are collecting fulfillment evidence that strengthens dispute defense.");
  }

  if (!input.kycReady) {
    concerns.push(
      factor(
        "kyc-readiness",
        "Incomplete KYC/KYB readiness",
        "high",
        18,
        "Insufficient legal entity or beneficial-owner documentation commonly delays onboarding or triggers account limits.",
        "Prepare incorporation docs, proof of operations, beneficial ownership records, and clear website business identity signals."
      )
    );
  } else {
    strengths.push("KYC/KYB readiness lowers onboarding friction.");
  }

  if (input.monthlyVolumeUsd > 75000 && input.accountAgeMonths < 6) {
    concerns.push(
      factor(
        "velocity",
        "High payment velocity on a new account",
        "medium",
        11,
        "Rapid volume growth on young entities can trigger rolling reserve checks.",
        "Increase volume gradually and maintain a 90-day cash buffer to absorb temporary reserves."
      )
    );
  }

  if (input.avgTicketUsd > 1200) {
    concerns.push(
      factor(
        "high-ticket",
        "High average order value",
        "medium",
        8,
        "Large ticket sizes raise fraud and post-purchase dispute exposure.",
        "Add step-up verification and manual review for first-time high-ticket buyers."
      )
    );
  }

  const exposedHighRiskCountries = input.countries.filter((country) => highRiskCountries.has(country.toUpperCase()));
  if (exposedHighRiskCountries.length > 0) {
    concerns.push(
      factor(
        "geo-exposure",
        "Sales exposure in sanctioned or high-risk regions",
        "high",
        25,
        `Your current market list includes regions with elevated compliance risk: ${exposedHighRiskCountries.join(", ")}.`,
        "Block unsupported geographies at checkout and document your sanctions-screening controls."
      )
    );
  } else {
    strengths.push("No immediate sanctions-region exposure detected in your declared markets.");
  }

  const baseScore = 18;
  const score = clamp(baseScore + concerns.reduce((sum, concern) => sum + concern.scoreDelta, 0), 0, 100);

  let level: RiskAssessment["level"] = "low";
  if (score >= 75) level = "critical";
  else if (score >= 55) level = "high";
  else if (score >= 30) level = "moderate";

  const summaryMap: Record<RiskAssessment["level"], string> = {
    low: "Your profile currently indicates low Stripe restriction risk if current controls remain in place.",
    moderate: "Your profile is workable, but specific weaknesses could trigger reserve holds as volume increases.",
    high: "Your profile has multiple risk markers that may cause onboarding delays or account limits.",
    critical: "Your current setup has severe policy and fraud-risk flags that materially increase ban or hold probability."
  };

  const concernPlan = concerns
    .sort((a, b) => b.scoreDelta - a.scoreDelta)
    .slice(0, 5)
    .map((item) => item.recommendation);

  const baselinePlan = [
    "Run monthly policy audits against prohibited business activity and card-network monitoring thresholds.",
    "Keep evidence packs ready: fulfillment logs, customer support transcripts, and KYC documents.",
    "Set internal alerts for chargebacks crossing 0.65% and refunds crossing 10%."
  ];

  const actionPlan = Array.from(new Set([...concernPlan, ...baselinePlan]));

  return {
    score,
    level,
    summary: summaryMap[level],
    topConcerns: concerns.sort((a, b) => b.scoreDelta - a.scoreDelta).slice(0, 6),
    strengths: strengths.slice(0, 5),
    actionPlan,
    generatedAt: new Date().toISOString()
  };
}
