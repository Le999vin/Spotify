import { describe, expect, it } from "vitest";

import { asTrackId } from "@/core/domain/ids";
import { initialPlaybackState, reducePlayback } from "@/core/playback/reducer";

const track1 = asTrackId("track-1");
const track2 = asTrackId("track-2");
const track3 = asTrackId("track-3");

describe("reducePlayback", () => {
  it("sets the queue and starts the selected track", () => {
    const next = reducePlayback(initialPlaybackState, {
      type: "QUEUE_SET",
      trackIds: [track1, track2, track3],
      startIndex: 1,
    });

    expect(next.currentId).toBe(track2);
    expect(next.status).toBe("playing");
    expect(next.queueIndex).toBe(1);
  });

  it("moves next and previous with repeat handling", () => {
    const base = reducePlayback(initialPlaybackState, {
      type: "QUEUE_SET",
      trackIds: [track1, track2],
      startIndex: 0,
    });
    const next = reducePlayback(base, { type: "NEXT" });
    const prev = reducePlayback({ ...next, progressMs: 0 }, { type: "PREV" });
    const repeating = reducePlayback(
      { ...next, repeat: "all", queueIndex: 1, currentId: track2 },
      { type: "NEXT" },
    );
    const repeatOne = reducePlayback(
      { ...next, repeat: "one", currentId: track2, queueIndex: 1, progressMs: 4200 },
      { type: "AUDIO_ENDED" },
    );

    expect(next.currentId).toBe(track2);
    expect(prev.currentId).toBe(track1);
    expect(repeating.currentId).toBe(track1);
    expect(repeatOne.currentId).toBe(track2);
    expect(repeatOne.progressMs).toBe(0);
  });

  it("toggles shuffle deterministically and restores canonical order", () => {
    const base = reducePlayback(initialPlaybackState, {
      type: "QUEUE_SET",
      trackIds: [track1, track2, track3],
      startIndex: 0,
    });
    const shuffled = reducePlayback(base, {
      type: "TOGGLE_SHUFFLE",
      seed: "seed-123",
    });
    const restored = reducePlayback(shuffled, {
      type: "TOGGLE_SHUFFLE",
      seed: "ignored",
    });

    expect(shuffled.shuffle).toBe(true);
    expect(shuffled.seededShuffle?.order).toHaveLength(3);
    expect(restored.shuffle).toBe(false);
    expect(restored.seededShuffle).toBeNull();
    expect(restored.currentId).toBe(track1);
  });

  it("adds, removes, and reorders queue items", () => {
    const base = reducePlayback(initialPlaybackState, {
      type: "QUEUE_SET",
      trackIds: [track1, track2],
      startIndex: 0,
    });
    const withNext = reducePlayback(base, { type: "QUEUE_ADD_NEXT", trackId: track3 });
    const reordered = reducePlayback(withNext, {
      type: "QUEUE_REORDER",
      fromIndex: 2,
      toIndex: 1,
    });
    const removed = reducePlayback(reordered, {
      type: "QUEUE_REMOVE",
      trackId: track2,
    });

    expect(withNext.queue).toEqual([track1, track3, track2]);
    expect(reordered.queue).toEqual([track1, track2, track3]);
    expect(removed.queue).toEqual([track1, track3]);
  });

  it("clamps volume and progress values", () => {
    const withDuration = {
      ...initialPlaybackState,
      currentId: track1,
      durationMs: 5000,
    };

    const volume = reducePlayback(withDuration, { type: "SET_VOLUME", value: 7 });
    const seeked = reducePlayback(withDuration, { type: "SEEK", ms: 9000 });

    expect(volume.volume).toBe(1);
    expect(seeked.progressMs).toBe(5000);
  });
});
