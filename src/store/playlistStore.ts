"use client";

import { create } from "zustand";

import type { PlaylistEvent } from "@/core/domain/events";
import type { PlaylistState } from "@/core/domain/types";
import { reducePlaylists } from "@/core/playlists/reducer";
import { playlistsById } from "@/lib/mock/data";

const STORAGE_KEY = "pulsefy-playlists";

const defaultPlaylistState: PlaylistState = {
  playlistsById: { ...playlistsById },
};

type PlaylistStore = {
  state: PlaylistState;
  dispatch: (event: PlaylistEvent) => void;
  hydrate: () => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  state: defaultPlaylistState,
  dispatch: (event) =>
    set((store) => ({
      state: reducePlaylists(store.state, event),
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
      const parsed = JSON.parse(raw) as Partial<PlaylistState>;
      set({
        state: {
          playlistsById: {
            ...defaultPlaylistState.playlistsById,
            ...(parsed.playlistsById ?? {}),
          },
        },
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  },
}));

usePlaylistStore.subscribe((current, previous) => {
  if (typeof window === "undefined") {
    return;
  }

  if (current.state === previous.state) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current.state));
});
