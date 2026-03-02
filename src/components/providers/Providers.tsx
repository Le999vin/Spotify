"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import { CommandPalette } from "@/components/music/CommandPalette";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlaylistStore } from "@/store/playlistStore";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Hydrate once without subscribing the provider tree to external stores.
    usePlaybackStore.getState().hydratePreferences();
    useLibraryStore.getState().hydrate();
    usePlaylistStore.getState().hydrate();
  }, []);

  return (
    <>
      {children}
      <CommandPalette />
      <Toaster position="top-center" theme="dark" richColors closeButton />
    </>
  );
}
