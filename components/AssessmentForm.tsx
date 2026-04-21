"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const assessmentSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
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
  businessDescription: z
    .string()
    .min(40, "Add enough detail for a meaningful risk evaluation (minimum 40 characters)."),
  countriesOfOperation: z.string().min(2, "List at least one operating country."),
  customerRegions: z.string().min(2, "List your target customer regions."),
  monthlyVolumeUsd: z.number().min(1000, "Monthly volume should be at least $1,000."),
  averageTicketUsd: z.number().min(1, "Average ticket must be greater than zero."),
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
  riskKeywords: z.string().optional()
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const stepFields: Array<Array<keyof AssessmentFormValues>> = [
  [
    "businessName",
    "businessModel",
    "businessDescription",
    "countriesOfOperation",
    "customerRegions",
    "legalEntityAgeMonths",
    "founderExperienceYears",
    "riskKeywords"
  ],
  [
    "monthlyVolumeUsd",
    "averageTicketUsd",
    "chargebackRatePct",
    "refundRatePct",
    "crossBorderPct",
    "fulfillmentDelayDays",
    "supportSlaHours",
    "usesPreorders"
  ],
  [
    "holdsCustomerFunds",
    "facilitatesPayouts",
    "sanctionsScreening",
    "clearRefundPolicy",
    "kycAmlProgram",
    "hasPriorProcessorTermination"
  ]
];

const modelOptions = [
  { value: "saas", label: "SaaS" },
  { value: "marketplace", label: "Marketplace" },
  { value: "fintech", label: "Fintech" },
  { value: "crypto", label: "Crypto" },
  { value: "money-services", label: "Money services" },
  { value: "adult", label: "Adult content" },
  { value: "gambling", label: "Gambling" },
  { value: "supplements", label: "Supplements" },
  { value: "travel", label: "Travel" },
  { value: "telemedicine", label: "Telemedicine" },
  { value: "other", label: "Other" }
] as const;

export function AssessmentForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      businessName: "",
      businessModel: "saas",
      businessDescription: "",
      countriesOfOperation: "United States",
      customerRegions: "United States, Canada, United Kingdom",
      monthlyVolumeUsd: 25000,
      averageTicketUsd: 120,
      chargebackRatePct: 0.35,
      refundRatePct: 4,
      crossBorderPct: 20,
      fulfillmentDelayDays: 0,
      supportSlaHours: 12,
      usesPreorders: false,
      holdsCustomerFunds: false,
      facilitatesPayouts: false,
      sanctionsScreening: true,
      clearRefundPolicy: true,
      kycAmlProgram: "basic",
      legalEntityAgeMonths: 12,
      founderExperienceYears: 4,
      hasPriorProcessorTermination: false,
      riskKeywords: ""
    }
  });

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  async function handleNext() {
    const valid = await trigger(stepFields[step]);
    if (valid) {
      setSubmitError(null);
      setStep((current) => Math.min(current + 1, 2));
    }
  }

  async function onSubmit(values: AssessmentFormValues) {
    setSubmitError(null);
    const payload = {
      ...values,
      countriesOfOperation: values.countriesOfOperation
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      customerRegions: values.customerRegions
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      riskKeywords: values.riskKeywords
        ? values.riskKeywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : []
    };

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setSubmitError(body.error ?? "Assessment failed. Please review your inputs and try again.");
      return;
    }

    const body = (await response.json()) as { id: string };
    router.push(`/report/${body.id}`);
  }

  return (
    <Card className="border-cyan-500/20 bg-slate-900/90">
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-4">
          <Badge variant="slate">Step {step + 1} of 3</Badge>
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            Built from Stripe risk patterns
          </div>
        </div>
        <Progress value={progress} />
        <CardTitle className="font-heading text-2xl text-slate-50">
          {step === 0 && "Business profile"}
          {step === 1 && "Transaction and dispute profile"}
          {step === 2 && "Compliance and controls"}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {step === 0 && "Describe your model and where you operate so the tool can flag policy-sensitive exposure."}
          {step === 1 && "Model realistic ticket size, volume, and fulfillment behavior to estimate operational stress risk."}
          {step === 2 && "Show how strong your fraud, AML, and support controls are before Stripe reviews your account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {step === 0 ? <BusinessStep register={register} errors={errors} /> : null}
          {step === 1 ? <TransactionsStep register={register} errors={errors} /> : null}
          {step === 2 ? <ComplianceStep register={register} errors={errors} /> : null}

          {submitError ? (
            <div className="flex items-start gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
              disabled={step === 0 || isSubmitting}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < 2 ? (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Analyzing Stripe risk..." : "Generate Risk Report"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

type StepProps = {
  register: ReturnType<typeof useForm<AssessmentFormValues>>["register"];
  errors: ReturnType<typeof useForm<AssessmentFormValues>>["formState"]["errors"];
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-rose-300">{message}</p>;
}

function BusinessStep({ register, errors }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="businessName">Business name</Label>
        <Input id="businessName" {...register("businessName")} placeholder="Orbitly Labs" />
        <FieldError message={errors.businessName?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessModel">Business model</Label>
        <select
          id="businessModel"
          className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
          {...register("businessModel")}
        >
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError message={errors.businessModel?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="legalEntityAgeMonths">Legal entity age (months)</Label>
        <Input id="legalEntityAgeMonths" type="number" {...register("legalEntityAgeMonths", { valueAsNumber: true })} />
        <FieldError message={errors.legalEntityAgeMonths?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="founderExperienceYears">Founder experience (years)</Label>
        <Input
          id="founderExperienceYears"
          type="number"
          {...register("founderExperienceYears", { valueAsNumber: true })}
        />
        <FieldError message={errors.founderExperienceYears?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="countriesOfOperation">Operating countries</Label>
        <Input
          id="countriesOfOperation"
          {...register("countriesOfOperation")}
          placeholder="United States, Germany"
        />
        <FieldError message={errors.countriesOfOperation?.message} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="customerRegions">Customer regions</Label>
        <Input
          id="customerRegions"
          {...register("customerRegions")}
          placeholder="United States, Canada, EU"
        />
        <FieldError message={errors.customerRegions?.message} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="businessDescription">What do you sell and how is it delivered?</Label>
        <Textarea
          id="businessDescription"
          {...register("businessDescription")}
          placeholder="We sell recurring analytics software for ecommerce founders with instant dashboard access after purchase."
        />
        <FieldError message={errors.businessDescription?.message} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="riskKeywords">Risk-sensitive terms used in your marketing (comma separated)</Label>
        <Input id="riskKeywords" {...register("riskKeywords")} placeholder="crypto rewards, escrow, offshore" />
        <FieldError message={errors.riskKeywords?.message} />
      </div>
    </div>
  );
}

function TransactionsStep({ register, errors }: StepProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="monthlyVolumeUsd">Projected monthly volume (USD)</Label>
        <Input id="monthlyVolumeUsd" type="number" {...register("monthlyVolumeUsd", { valueAsNumber: true })} />
        <FieldError message={errors.monthlyVolumeUsd?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="averageTicketUsd">Average transaction size (USD)</Label>
        <Input id="averageTicketUsd" type="number" {...register("averageTicketUsd", { valueAsNumber: true })} />
        <FieldError message={errors.averageTicketUsd?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chargebackRatePct">Expected chargeback rate (%)</Label>
        <Input id="chargebackRatePct" type="number" step="0.01" {...register("chargebackRatePct", { valueAsNumber: true })} />
        <FieldError message={errors.chargebackRatePct?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="refundRatePct">Expected refund rate (%)</Label>
        <Input id="refundRatePct" type="number" step="0.01" {...register("refundRatePct", { valueAsNumber: true })} />
        <FieldError message={errors.refundRatePct?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="crossBorderPct">Cross-border transactions (%)</Label>
        <Input id="crossBorderPct" type="number" step="0.01" {...register("crossBorderPct", { valueAsNumber: true })} />
        <FieldError message={errors.crossBorderPct?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fulfillmentDelayDays">Days until delivery starts</Label>
        <Input
          id="fulfillmentDelayDays"
          type="number"
          {...register("fulfillmentDelayDays", { valueAsNumber: true })}
        />
        <FieldError message={errors.fulfillmentDelayDays?.message} />
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="supportSlaHours">Support first-response SLA (hours)</Label>
        <Input id="supportSlaHours" type="number" {...register("supportSlaHours", { valueAsNumber: true })} />
        <FieldError message={errors.supportSlaHours?.message} />
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300 sm:col-span-2">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("usesPreorders")}
        />
        Customers pay before the product or service is delivered (pre-orders, pre-sales, deposits).
      </label>
    </div>
  );
}

function ComplianceStep({ register, errors }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kycAmlProgram">KYC/AML maturity</Label>
          <select
            id="kycAmlProgram"
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100"
            {...register("kycAmlProgram")}
          >
            <option value="none">None</option>
            <option value="basic">Basic checks</option>
            <option value="advanced">Advanced controls</option>
          </select>
          <FieldError message={errors.kycAmlProgram?.message} />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("holdsCustomerFunds")}
        />
        We hold customer or merchant funds before settlement.
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("facilitatesPayouts")}
        />
        We route or orchestrate payouts to third parties.
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("sanctionsScreening")}
        />
        We screen users and counterparties against sanctions/PEP lists.
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("clearRefundPolicy")}
        />
        We publish a clear refund policy before checkout.
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-cyan-400"
          {...register("hasPriorProcessorTermination")}
        />
        A prior payment processor has terminated, frozen, or restricted our account.
      </label>

      <FieldError message={errors.hasPriorProcessorTermination?.message} />
    </div>
  );
}
