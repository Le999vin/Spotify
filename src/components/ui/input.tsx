"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-full border border-white/8 bg-white/5 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] shadow-sm transition-colors outline-none focus-visible:border-white/15 focus-visible:bg-white/7",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
