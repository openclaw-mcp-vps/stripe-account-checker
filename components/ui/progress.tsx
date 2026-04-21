import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

function Progress({ className, value, ...props }: ProgressProps) {
  const width = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-800", className)}
      {...props}
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export { Progress };
