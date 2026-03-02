"use client";

import { create } from "zustand";
import { toast } from "sonner";

import type { PlaybackEvent } from "@/core/domain/events";
import type { PlaybackState } from "@/core/domain/types";
import { reducePlayback, initialPlaybackState } from "@/core/playback/reducer";
import { selectIsPlaying } from "@/core/playback/selectors";
import { tracksById } from "@/lib/mock/data";

const STORAGE_KEY = "pulsefy-playback";

type PlaybackStore = {
  state: PlaybackState;
  lastError: string | null;
  dispatch: (event: PlaybackEvent) => void;
  hydratePreferences: () => void;
  setVolume: (value: number) => void;
};

type Snapshot = Pick<PlaybackState, "currentId" | "status" | "volume" | "progressMs" | "durationMs">;

class AudioController {
  private audio: HTMLAudioElement | null = null;
  private snapshot: Snapshot | null = null;
  private isBound = false;

  private ensureAudio(dispatch: PlaybackStore["dispatch"]) {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.audio) {
      this.audio = new window.Audio();
      this.audio.preload = "metadata";
    }

    if (!this.isBound) {
      this.audio.addEventListener("timeupdate", () => {
        dispatch({
          type: "AUDIO_TIME_UPDATE",
          progressMs: this.audio ? this.audio.currentTime * 1000 : 0,
          durationMs: this.audio && Number.isFinite(this.audio.duration)
            ? this.audio.duration * 1000
            : 0,
        });
      });
      this.audio.addEventListener("waiting", () => {
        dispatch({ type: "AUDIO_BUFFERING" });
      });
      this.audio.addEventListener("playing", () => {
        dispatch({ type: "AUDIO_READY" });
      });
      this.audio.addEventListener("ended", () => {
        dispatch({ type: "AUDIO_ENDED" });
      });
      this.audio.addEventListener("error", () => {
        dispatch({
          type: "AUDIO_ERROR",
          message: "Playback failed. Try another preview.",
        });
      });
      this.isBound = true;
    }

    return this.audio;
  }

  sync(state: PlaybackState, dispatch: PlaybackStore["dispatch"]) {
    const audio = this.ensureAudio(dispatch);

    if (!audio) {
      return;
    }

    const track = state.currentId ? tracksById[state.currentId] ?? null : null;
    const previousTrackId = this.snapshot?.currentId ?? null;
    const trackChanged = previousTrackId !== state.currentId;

    if (!track) {
      audio.pause();
      this.snapshot = {
        currentId: state.currentId,
        status: state.status,
        volume: state.volume,
        progressMs: state.progressMs,
        durationMs: state.durationMs,
      };
      return;
    }

    if (trackChanged) {
      if (!track.audioUrl) {
        if (selectIsPlaying(state)) {
          dispatch({ type: "PAUSE" });
          toast.message("Preview not available");
        }
      } else {
        audio.src = track.audioUrl;
        audio.currentTime = 0;
      }
    }

    if (track.audioUrl) {
      const shouldPlay = selectIsPlaying(state);

      if (Math.abs(audio.volume - state.volume) > 0.01) {
        audio.volume = state.volume;
      }

      if (
        Math.abs(audio.currentTime * 1000 - state.progressMs) > 1400 &&
        state.durationMs > 0
      ) {
        audio.currentTime = state.progressMs / 1000;
      }

      if (shouldPlay) {
        void audio.play().catch(() => {
          dispatch({
            type: "AUDIO_ERROR",
            message: "Autoplay was blocked by the browser.",
          });
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }

    this.snapshot = {
      currentId: state.currentId,
      status: state.status,
      volume: state.volume,
      progressMs: state.progressMs,
      durationMs: state.durationMs,
    };
  }
}

const controller = new AudioController();

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  state: initialPlaybackState,
  lastError: null,
  dispatch: (event) =>
    set((store) => ({
      state: reducePlayback(store.state, event),
      lastError: event.type === "AUDIO_ERROR" ? event.message : store.lastError,
    })),
  hydratePreferences: () => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<PlaybackState>;

      set((store) => ({
        state: {
          ...store.state,
          volume: typeof parsed.volume === "number" ? parsed.volume : store.state.volume,
          repeat:
            parsed.repeat === "all" || parsed.repeat === "one" || parsed.repeat === "off"
              ? parsed.repeat
              : store.state.repeat,
          shuffle: typeof parsed.shuffle === "boolean" ? parsed.shuffle : store.state.shuffle,
        },
      }));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },
  setVolume: (value) =>
    set((store) => ({
      state: reducePlayback(store.state, { type: "SET_VOLUME", value }),
    })),
}));

usePlaybackStore.subscribe((current, previous) => {
  if (current.state === previous.state) {
    return;
  }

  controller.sync(current.state, usePlaybackStore.getState().dispatch);

  if (typeof window !== "undefined") {
    const previousState = previous.state;
    const nextState = current.state;

    if (
      previousState.volume !== nextState.volume ||
      previousState.repeat !== nextState.repeat ||
      previousState.shuffle !== nextState.shuffle
    ) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          volume: nextState.volume,
          repeat: nextState.repeat,
          shuffle: nextState.shuffle,
        }),
      );
    }
  }
});
