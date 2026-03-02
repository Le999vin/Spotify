import type { PlaybackEvent } from "@/core/domain/events";
import type { PlaybackState } from "@/core/domain/types";
import { buildShuffledOrder, reorder } from "@/core/playback/queue";
import { clampProgress, isNearTrackStart } from "@/core/playback/time";
import { clamp } from "@/lib/utils";

const DEFAULT_SHUFFLE_SEED = "pulsefy-default-seed";

export const initialPlaybackState: PlaybackState = {
  status: "idle",
  currentId: null,
  queue: [],
  queueIndex: 0,
  progressMs: 0,
  durationMs: 0,
  volume: 0.72,
  shuffle: false,
  repeat: "off",
  seededShuffle: null,
};

function getActiveOrder(state: PlaybackState) {
  return state.seededShuffle?.order ?? state.queue;
}

function setTrackAtIndex(state: PlaybackState, index: number, status: PlaybackState["status"]) {
  const activeOrder = getActiveOrder(state);
  const nextId = activeOrder[index] ?? null;

  if (!nextId) {
    return {
      ...state,
      status: "idle" as const,
      currentId: null,
      queueIndex: 0,
      progressMs: 0,
      durationMs: 0,
    };
  }

  return {
    ...state,
    currentId: nextId,
    queueIndex: index,
    progressMs: 0,
    durationMs: 0,
    status,
  };
}

function rebuildShuffle(queue: PlaybackState["queue"], seed: string) {
  return {
    seed,
    order: buildShuffledOrder(queue, seed),
  };
}

function withCurrentMappedIndex(state: PlaybackState) {
  const activeOrder = getActiveOrder(state);
  const index = state.currentId ? activeOrder.indexOf(state.currentId) : -1;

  return {
    ...state,
    queueIndex: index >= 0 ? index : 0,
    currentId: index >= 0 ? activeOrder[index] : activeOrder[0] ?? null,
  };
}

function nextTrack(state: PlaybackState): PlaybackState {
  const activeOrder = getActiveOrder(state);

  if (!activeOrder.length || state.currentId === null) {
    return state;
  }

  if (state.repeat === "one") {
    return {
      ...state,
      progressMs: 0,
      status: "playing",
    };
  }

  const nextIndex = state.queueIndex + 1;

  if (nextIndex < activeOrder.length) {
    return setTrackAtIndex(state, nextIndex, "playing");
  }

  if (state.repeat === "all") {
    return setTrackAtIndex(state, 0, "playing");
  }

  return {
    ...state,
    status: "idle",
    progressMs: 0,
  };
}

function previousTrack(state: PlaybackState): PlaybackState {
  const activeOrder = getActiveOrder(state);

  if (!activeOrder.length || state.currentId === null) {
    return state;
  }

  if (!isNearTrackStart(state.progressMs)) {
    return {
      ...state,
      progressMs: 0,
    };
  }

  const previousIndex = state.queueIndex - 1;

  if (previousIndex >= 0) {
    return setTrackAtIndex(state, previousIndex, "playing");
  }

  if (state.repeat === "all") {
    return setTrackAtIndex(state, activeOrder.length - 1, "playing");
  }

  return {
    ...state,
    progressMs: 0,
  };
}

export function reducePlayback(state: PlaybackState, event: PlaybackEvent): PlaybackState {
  switch (event.type) {
    case "PLAY_TRACK": {
      const activeOrder = getActiveOrder(state);
      const existingIndex = activeOrder.indexOf(event.trackId);

      if (existingIndex >= 0) {
        return {
          ...state,
          currentId: event.trackId,
          queueIndex: existingIndex,
          progressMs: 0,
          durationMs: 0,
          status: "playing",
        };
      }

      const nextQueue = [event.trackId];
      const nextShuffle = state.shuffle
        ? {
            seed: state.seededShuffle?.seed ?? DEFAULT_SHUFFLE_SEED,
            order: [event.trackId],
          }
        : null;

      return {
        ...state,
        queue: nextQueue,
        seededShuffle: nextShuffle,
        currentId: event.trackId,
        queueIndex: 0,
        progressMs: 0,
        durationMs: 0,
        status: "playing",
      };
    }

    case "TOGGLE_PLAY": {
      if (!state.currentId) {
        return state;
      }

      return {
        ...state,
        status: state.status === "playing" ? "paused" : "playing",
      };
    }

    case "PAUSE":
      return state.currentId ? { ...state, status: "paused" } : state;

    case "RESUME":
      return state.currentId ? { ...state, status: "playing" } : state;

    case "NEXT":
    case "AUDIO_ENDED":
      return nextTrack(state);

    case "PREV":
      return previousTrack(state);

    case "SEEK":
      return {
        ...state,
        progressMs: clampProgress(event.ms, state.durationMs),
      };

    case "SET_VOLUME":
      return {
        ...state,
        volume: clamp(event.value, 0, 1),
      };

    case "TOGGLE_SHUFFLE": {
      if (!state.queue.length) {
        return {
          ...state,
          shuffle: !state.shuffle,
          seededShuffle: !state.shuffle ? { seed: event.seed, order: [] } : null,
        };
      }

      if (!state.shuffle) {
        const seededShuffle = rebuildShuffle(state.queue, event.seed);
        const nextIndex = state.currentId
          ? seededShuffle.order.indexOf(state.currentId)
          : 0;

        return {
          ...state,
          shuffle: true,
          seededShuffle,
          queueIndex: Math.max(0, nextIndex),
        };
      }

      const nextIndex = state.currentId ? state.queue.indexOf(state.currentId) : 0;

      return {
        ...state,
        shuffle: false,
        seededShuffle: null,
        queueIndex: Math.max(0, nextIndex),
      };
    }

    case "SET_REPEAT":
      return {
        ...state,
        repeat: event.mode,
      };

    case "QUEUE_SET": {
      const nextQueue = [...event.trackIds];
      const safeStartIndex = clamp(event.startIndex, 0, Math.max(nextQueue.length - 1, 0));
      const shuffleSeed = state.seededShuffle?.seed ?? DEFAULT_SHUFFLE_SEED;
      const seededShuffle = state.shuffle ? rebuildShuffle(nextQueue, shuffleSeed) : null;
      const activeOrder = seededShuffle?.order ?? nextQueue;
      const nextCurrent = activeOrder[safeStartIndex] ?? nextQueue[safeStartIndex] ?? null;

      return {
        ...state,
        queue: nextQueue,
        seededShuffle,
        currentId: nextCurrent,
        queueIndex: nextCurrent ? activeOrder.indexOf(nextCurrent) : 0,
        progressMs: 0,
        durationMs: 0,
        status: nextCurrent ? "playing" : "idle",
      };
    }

    case "QUEUE_ADD_NEXT": {
      const currentCanonicalIndex = state.currentId ? state.queue.indexOf(state.currentId) : -1;
      const insertIndex = currentCanonicalIndex >= 0 ? currentCanonicalIndex + 1 : state.queue.length;
      const nextQueue = [...state.queue];
      nextQueue.splice(insertIndex, 0, event.trackId);
      const nextState: PlaybackState = {
        ...state,
        queue: nextQueue,
      };

      if (!state.shuffle || !state.seededShuffle) {
        return withCurrentMappedIndex(nextState);
      }

      const nextOrder = [...state.seededShuffle.order];
      const shuffleInsertIndex = state.queueIndex + 1;
      nextOrder.splice(shuffleInsertIndex, 0, event.trackId);

      return {
        ...nextState,
        seededShuffle: {
          ...state.seededShuffle,
          order: nextOrder,
        },
      };
    }

    case "QUEUE_ADD_END": {
      const nextQueue = [...state.queue, event.trackId];

      if (!state.shuffle || !state.seededShuffle) {
        return {
          ...state,
          queue: nextQueue,
        };
      }

      return {
        ...state,
        queue: nextQueue,
        seededShuffle: {
          ...state.seededShuffle,
          order: [...state.seededShuffle.order, event.trackId],
        },
      };
    }

    case "QUEUE_REMOVE": {
      const nextQueue = state.queue.filter((trackId) => trackId !== event.trackId);
      const nextOrder = getActiveOrder(state).filter((trackId) => trackId !== event.trackId);

      if (!nextOrder.length) {
        return {
          ...state,
          queue: [],
          seededShuffle: state.shuffle
            ? {
                seed: state.seededShuffle?.seed ?? DEFAULT_SHUFFLE_SEED,
                order: [],
              }
            : null,
          currentId: null,
          queueIndex: 0,
          progressMs: 0,
          durationMs: 0,
          status: "idle",
        };
      }

      const nextCurrent =
        state.currentId === event.trackId
          ? nextOrder[Math.min(state.queueIndex, nextOrder.length - 1)]
          : state.currentId;
      const nextState: PlaybackState = {
        ...state,
        queue: nextQueue,
        seededShuffle: state.shuffle
          ? {
              seed: state.seededShuffle?.seed ?? DEFAULT_SHUFFLE_SEED,
              order: nextOrder,
            }
          : null,
        currentId: nextCurrent ?? nextOrder[0],
      };

      return withCurrentMappedIndex(nextState);
    }

    case "QUEUE_REORDER": {
      if (state.shuffle && state.seededShuffle) {
        const nextOrder = reorder(state.seededShuffle.order, event.fromIndex, event.toIndex);

        return withCurrentMappedIndex({
          ...state,
          seededShuffle: {
            ...state.seededShuffle,
            order: nextOrder,
          },
        });
      }

      const nextQueue = reorder(state.queue, event.fromIndex, event.toIndex);

      return withCurrentMappedIndex({
        ...state,
        queue: nextQueue,
      });
    }

    case "AUDIO_TIME_UPDATE":
      return {
        ...state,
        progressMs: clampProgress(event.progressMs, event.durationMs),
        durationMs: Math.max(0, Math.round(event.durationMs)),
      };

    case "AUDIO_BUFFERING":
      return state.currentId ? { ...state, status: "buffering" } : state;

    case "AUDIO_READY":
      if (!state.currentId || state.status === "paused") {
        return state;
      }

      return {
        ...state,
        status: "playing",
      };

    case "AUDIO_ERROR":
      return {
        ...state,
        status: state.currentId ? "error" : state.status,
      };

    default:
      return state;
  }
}
