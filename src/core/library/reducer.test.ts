import { describe, expect, it } from "vitest";

import { asTrackId } from "@/core/domain/ids";
import { initialLibraryState, reduceLibrary } from "@/core/library/reducer";

describe("reduceLibrary", () => {
  it("toggles a liked track on and off", () => {
    const trackId = asTrackId("track-7");
    const liked = reduceLibrary(initialLibraryState, {
      type: "TOGGLE_LIKE",
      trackId,
    });
    const unliked = reduceLibrary(liked, {
      type: "TOGGLE_LIKE",
      trackId,
    });

    expect(liked.likedTrackIds).toEqual([trackId]);
    expect(unliked).toEqual(initialLibraryState);
  });
});
