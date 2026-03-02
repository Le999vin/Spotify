import { describe, expect, it } from "vitest";

import { asTrackId } from "@/core/domain/ids";
import { buildShuffledOrder, reorder } from "@/core/playback/queue";

const ids = [asTrackId("track-1"), asTrackId("track-2"), asTrackId("track-3"), asTrackId("track-4")];

describe("playback queue helpers", () => {
  it("reorders entries safely", () => {
    expect(reorder(ids, 0, 2)).toEqual([
      asTrackId("track-2"),
      asTrackId("track-3"),
      asTrackId("track-1"),
      asTrackId("track-4"),
    ]);

    expect(reorder(ids, -1, 2)).toEqual(ids);
  });

  it("builds deterministic shuffled order from a seed", () => {
    const first = buildShuffledOrder(ids, "seed-123");
    const second = buildShuffledOrder(ids, "seed-123");
    const third = buildShuffledOrder(ids, "seed-456");

    expect(first).toEqual(second);
    expect(first).not.toEqual(third);
    expect([...first].sort()).toEqual([...ids].sort());
  });
});
