import type { LibraryEvent } from "@/core/domain/events";
import type { LibraryState } from "@/core/domain/types";

export const initialLibraryState: LibraryState = {
  likedTrackIds: [],
};

export function reduceLibrary(state: LibraryState, event: LibraryEvent): LibraryState {
  switch (event.type) {
    case "TOGGLE_LIKE":
      return state.likedTrackIds.includes(event.trackId)
        ? {
            ...state,
            likedTrackIds: state.likedTrackIds.filter((trackId) => trackId !== event.trackId),
          }
        : {
            ...state,
            likedTrackIds: [...state.likedTrackIds, event.trackId],
          };

    default:
      return state;
  }
}
