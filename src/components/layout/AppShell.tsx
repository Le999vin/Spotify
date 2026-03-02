"use client";

import { Suspense, useState, type ReactNode } from "react";

import { MobileTabs } from "@/components/layout/MobileTabs";
import { PlayerBar } from "@/components/layout/PlayerBar";
import { RightPanel } from "@/components/layout/RightPanel";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { NowPlayingSheet } from "@/components/music/NowPlayingSheet";

export function AppShell({ children }: { children: ReactNode }) {
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  const [isMobilePlayerOpen, setIsMobilePlayerOpen] = useState(false);

  return (
    <div className="relative min-h-screen text-[var(--foreground)]">
      <div className="flex min-h-screen flex-col">
        <div className="flex min-h-screen flex-1 overflow-hidden pb-28 md:pb-32">
          <aside className="hidden shrink-0 p-3 md:block md:w-[280px]">
            <Sidebar />
          </aside>
          <div className="flex min-w-0 flex-1 flex-col">
            <Suspense fallback={<div className="h-16 border-b border-white/8 bg-[var(--background-overlay)]" />}>
              <Topbar
                isQueueOpen={isQueueOpen}
                onToggleQueue={() => setIsQueueOpen((value) => !value)}
              />
            </Suspense>
            <main className="soft-scroll relative flex-1 overflow-y-auto px-4 pb-44 pt-6 md:px-6">
              {children}
            </main>
          </div>
          <RightPanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
        </div>
      </div>
      <PlayerBar
        onToggleQueue={() => setIsQueueOpen((value) => !value)}
        onOpenMobilePlayer={() => setIsMobilePlayerOpen(true)}
      />
      <MobileTabs onOpenPlayer={() => setIsMobilePlayerOpen(true)} />
      <NowPlayingSheet
        isOpen={isMobilePlayerOpen}
        onClose={() => setIsMobilePlayerOpen(false)}
      />
    </div>
  );
}
