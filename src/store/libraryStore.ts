"use client";

import { create } from "zustand";

import type { LibraryEvent } from "@/core/domain/events";
import { initialLibraryState, reduceLibrary } from "@/core/library/reducer";
import type { LibraryState } from "@/core/domain/types";

const STORAGE_KEY = "Spotify-library";

type LibraryStore = {
  state: LibraryState;
  dispatch: (event: LibraryEvent) => void;
  hydrate: () => void;
};

export const useLibraryStore = create<LibraryStore>((set) => ({
  state: initialLibraryState,
  dispatch: (event) =>
    set((store) => ({
      state: reduceLibrary(store.state, event),
    })),
  hydrate: () => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<LibraryState>;

      set({
        state: {
          likedTrackIds: Array.isArray(parsed.likedTrackIds) ? parsed.likedTrackIds : [],
        },
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },
}));

useLibraryStore.subscribe((current, previous) => {
  if (typeof window === "undefined") {
    return;
  }

  if (current.state === previous.state) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current.state));
});
