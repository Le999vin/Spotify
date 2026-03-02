import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shimmer rounded-2xl bg-white/6", className)}
      {...props}
    />
  );
}

export { Skeleton };
