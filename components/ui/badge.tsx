import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-cyan-500/40 bg-cyan-500/15 text-cyan-200",
        slate: "border-slate-600 bg-slate-800 text-slate-200",
        warning: "border-amber-500/40 bg-amber-500/15 text-amber-200",
        danger: "border-rose-500/40 bg-rose-500/15 text-rose-200",
        success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
