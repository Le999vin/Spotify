"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import type { TrackId } from "@/core/domain/ids";
import { TrackRow } from "@/components/music/TrackRow";

type TrackTableProps = {
  trackIds: TrackId[];
  contextLabel?: string;
  showHeader?: boolean;
};

export function TrackTable({
  trackIds,
  contextLabel = "Tracks",
  showHeader = true,
}: TrackTableProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const shouldVirtualize = trackIds.length > 50;
  // TanStack Virtual manages its own mutable internals; skipping the compiler warning here is expected.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: shouldVirtualize ? trackIds.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const renderedTrackIds = useMemo(
    () => (shouldVirtualize ? virtualItems.map((item) => trackIds[item.index]) : trackIds),
    [shouldVirtualize, trackIds, virtualItems],
  );

  return (
    <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-3 md:p-4">
      {showHeader ? (
        <div className="grid grid-cols-[40px_minmax(0,1.5fr)_minmax(0,1fr)_72px_88px] gap-3 px-3 pb-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          <span>#</span>
          <span>{contextLabel}</span>
          <span>Album</span>
          <span>Time</span>
          <span className="text-right">Actions</span>
        </div>
      ) : null}
      <div
        ref={parentRef}
        className={shouldVirtualize ? "max-h-[30rem] overflow-auto" : ""}
      >
        {shouldVirtualize ? (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualItems.map((item) => (
              <div
                key={item.key}
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${item.start}px)` }}
              >
                <TrackRow
                  trackId={trackIds[item.index]}
                  index={item.index}
                  queueTrackIds={trackIds}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {renderedTrackIds.map((trackId, index) => (
              <TrackRow
                key={trackId}
                trackId={trackId}
                index={index}
                queueTrackIds={trackIds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
