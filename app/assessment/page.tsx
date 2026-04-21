import { redirect } from "next/navigation";

import { AssessmentForm } from "@/components/AssessmentForm";
import { hasPaidAccess } from "@/lib/auth";

export const metadata = {
  title: "Assessment"
};

export default async function AssessmentPage() {
  const paid = await hasPaidAccess();
  if (!paid) {
    redirect("/dashboard?locked=1");
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-heading text-4xl text-slate-50">Stripe Suspension Risk Assessment</h1>
        <p className="mt-3 text-slate-300">
          Complete this 3-step profile to estimate how likely Stripe is to suspend or heavily restrict your account.
        </p>
      </div>
      <AssessmentForm />
    </div>
  );
}
