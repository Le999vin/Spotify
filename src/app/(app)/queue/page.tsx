"use client";

import { QueuePanel } from "@/components/music/QueuePanel";

export default function QueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Queue
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Mobile queue view</h1>
      </div>
      <div className="overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/4">
        <QueuePanel />
      </div>
    </div>
  );
}
