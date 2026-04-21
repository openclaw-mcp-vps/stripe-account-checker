import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  title: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
};

export function PricingCard({ title, price, cadence, description, features }: PricingCardProps) {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "";

  return (
    <Card className="relative overflow-hidden border-cyan-500/30 bg-slate-900/90 shadow-[0_0_50px_-30px_rgba(34,211,238,0.7)]">
      <div className="absolute -top-16 right-[-80px] h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <CardHeader className="space-y-3">
        <Badge variant="default" className="w-fit">
          Fintech Tools
        </Badge>
        <CardTitle className="font-heading text-3xl text-slate-50">{title}</CardTitle>
        <CardDescription className="text-base text-slate-300">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="font-heading text-5xl text-slate-50">{price}</p>
          <p className="mt-1 text-sm text-slate-400">{cadence}</p>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="grid gap-3">
          <a
            href={paymentLink}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Buy Access
          </a>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full")}
          >
            I already purchased
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
