import type { TrackId } from "@/core/domain/ids";
import type { LibraryState, Track } from "@/core/domain/types";

export function selectLikedSet(state: LibraryState) {
  return new Set(state.likedTrackIds);
}

export function selectIsLiked(state: LibraryState, trackId: TrackId) {
  return state.likedTrackIds.includes(trackId);
}

export function selectLikedTracks(
  state: LibraryState,
  tracksById: Record<string, Track>,
) {
  return state.likedTrackIds
    .map((trackId) => tracksById[trackId])
    .filter(Boolean);
}
