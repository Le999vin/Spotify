"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[#031515] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        ghost:
          "bg-transparent text-[var(--foreground)] hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        secondary:
          "bg-white/6 text-[var(--foreground)] hover:bg-white/9 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        outline:
          "border border-white/10 bg-transparent text-[var(--foreground)] hover:border-white/20 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        destructive:
          "bg-[var(--danger)] text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
