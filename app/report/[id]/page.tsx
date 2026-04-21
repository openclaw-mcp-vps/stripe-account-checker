import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { RiskReport } from "@/components/RiskReport";
import { Badge } from "@/components/ui/badge";
import { hasPaidAccess } from "@/lib/auth";
import { getAssessment } from "@/lib/store";

export const dynamic = "force-dynamic";

type ReportPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const paid = await hasPaidAccess();
  if (!paid) {
    redirect("/dashboard?locked=1");
  }

  const assessment = await getAssessment(id);
  if (!assessment) {
    notFound();
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-slate-50">Risk Report</h1>
          <p className="mt-2 text-sm text-slate-400">
            Generated {new Date(assessment.report.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="slate">Report ID: {assessment.id}</Badge>
          <Link
            href="/assessment"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800"
          >
            Run New Assessment
          </Link>
        </div>
      </div>

      <RiskReport report={assessment.report} businessName={assessment.input.businessName} />
    </div>
  );
}
