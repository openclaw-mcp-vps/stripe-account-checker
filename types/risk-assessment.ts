export type BusinessCategory =
  | "digital_goods"
  | "saas"
  | "agency"
  | "education"
  | "supplements"
  | "dropshipping"
  | "crypto_related"
  | "adult"
  | "travel"
  | "financial_services"
  | "other";

export interface RiskInput {
  businessName: string;
  websiteUrl: string;
  category: BusinessCategory;
  monthlyVolumeUsd: number;
  avgTicketUsd: number;
  chargebackRatePercent: number;
  refundRatePercent: number;
  countries: string[];
  hasClearRefundPolicy: boolean;
  hasDeliveryProof: boolean;
  kycReady: boolean;
  accountAgeMonths: number;
}

export interface RiskFactor {
  id: string;
  title: string;
  impact: "low" | "medium" | "high";
  scoreDelta: number;
  explanation: string;
  recommendation: string;
}

export interface RiskAssessment {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  summary: string;
  topConcerns: RiskFactor[];
  strengths: string[];
  actionPlan: string[];
  generatedAt: string;
}
