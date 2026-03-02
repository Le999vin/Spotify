import type { PlaybackState, Track } from "@/core/domain/types";

export function selectActiveOrder(state: PlaybackState) {
  return state.seededShuffle?.order ?? state.queue;
}

export function selectNowPlaying(
  state: PlaybackState,
  tracksById: Record<string, Track>,
) {
  return state.currentId ? tracksById[state.currentId] ?? null : null;
}

export function selectQueueView(
  state: PlaybackState,
  tracksById: Record<string, Track>,
) {
  const activeOrder = selectActiveOrder(state);
  const current = state.currentId ? tracksById[state.currentId] ?? null : null;
  const previous = activeOrder
    .slice(0, state.queueIndex)
    .map((trackId) => tracksById[trackId])
    .filter(Boolean);
  const upNext = activeOrder
    .slice(state.queueIndex + 1)
    .map((trackId) => tracksById[trackId])
    .filter(Boolean);

  return {
    current,
    previous,
    upNext,
    activeOrder,
  };
}

export function selectProgressPercent(state: PlaybackState) {
  if (!state.durationMs) {
    return 0;
  }

  return Math.min(100, Math.max(0, (state.progressMs / state.durationMs) * 100));
}

export function selectIsPlaying(state: PlaybackState) {
  return state.status === "playing" || state.status === "buffering";
}

export function selectCurrentTrackIndex(state: PlaybackState) {
  return state.currentId ? state.queueIndex : -1;
}
