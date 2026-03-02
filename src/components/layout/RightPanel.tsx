"use client";

import { AnimatePresence, motion } from "framer-motion";

import { QueuePanel } from "@/components/music/QueuePanel";
import { Button } from "@/components/ui/button";

type RightPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function RightPanel({ isOpen, onClose }: RightPanelProps) {
  return (
    <div className="hidden xl:block">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.aside
            key="queue"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[320px] p-3"
          >
            <div className="glass-panel h-[calc(100vh-1.5rem)] overflow-hidden rounded-[1.75rem]">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <p className="font-display text-base font-semibold">Queue</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Shape the next run
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Hide
                </Button>
              </div>
              <QueuePanel compact />
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
