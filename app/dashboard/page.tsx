import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { PurchaseUnlock } from "@/components/PurchaseUnlock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPaidAccess } from "@/lib/auth";

export const metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const paid = await hasPaidAccess();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="font-heading text-4xl text-slate-50">Dashboard</h1>
        <p className="max-w-2xl text-slate-300">
          Manage access to your Stripe Account Checker workspace. This page is where purchase verification happens after Stripe hosted checkout.
        </p>
      </div>

      {paid ? (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <CardTitle className="text-emerald-100">Access active</CardTitle>
            </div>
            <CardDescription className="text-emerald-100/90">
              Your cookie is active on this device. You can run assessments immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/assessment"
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-300"
            >
              Launch assessment
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Badge variant="warning" className="w-fit">
          Access locked until purchase is verified
        </Badge>
      )}

      <PurchaseUnlock />
    </div>
  );
}
