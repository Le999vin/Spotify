"use client";

import { cn } from "@/lib/utils";

export function VisualizerMini({
  playing,
  className,
}: {
  playing: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex h-4 items-end gap-0.5", className)} aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className={cn(
            "w-1 rounded-full bg-[var(--accent-strong)] transition-all",
            playing ? "opacity-100" : "opacity-40",
          )}
          style={{
            height: `${8 + index * 3}px`,
            transformOrigin: "bottom",
            animation: playing
              ? `equalize 0.9s ${index * 0.12}s ease-in-out infinite`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
