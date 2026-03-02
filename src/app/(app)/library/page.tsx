"use client";

import { useMemo } from "react";

import { PlaylistCard } from "@/components/music/PlaylistCard";
import { TrackTable } from "@/components/music/TrackTable";
import { formatCount } from "@/lib/utils";
import { playlistsById as staticPlaylistsById, tracksById } from "@/lib/mock/data";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaylistStore } from "@/store/playlistStore";

export default function LibraryPage() {
  const likedTrackIds = useLibraryStore((store) => store.state.likedTrackIds);
  const playlistsById = usePlaylistStore((store) => store.state.playlistsById);
  const playlists = useMemo(() => Object.values(playlistsById), [playlistsById]);
  const likedTracks = useMemo(
    () => likedTrackIds.map((trackId) => tracksById[trackId]).filter(Boolean),
    [likedTrackIds],
  );
  const recentlyLiked = useMemo(() => likedTracks.slice(-4).reverse(), [likedTracks]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(13,209,179,0.16),rgba(61,140,255,0.08))] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Your library
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold">Pinned, liked, and ready.</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
            {likedTrackIds.length
              ? `You have ${formatCount(likedTrackIds.length, "liked track")} saved.`
              : "Start liking tracks from rows, cards, or the player bar to build your collection."}
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/8 bg-white/4 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Recently liked
          </p>
          <div className="mt-4 space-y-3">
            {recentlyLiked.length ? (
              recentlyLiked.map((track) => (
                <div key={track.id} className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${track.coverUrl})` }}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{track.title}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {track.tags.join(" • ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--muted-foreground)]">
                Like something and it will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Your playlists</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatCount(playlists.length, "playlist")}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={{
                ...playlist,
                coverUrl: playlist.coverUrl ?? staticPlaylistsById[playlist.id]?.coverUrl,
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Liked tracks</h2>
        {likedTrackIds.length ? (
          <TrackTable trackIds={likedTrackIds} contextLabel="Liked track" />
        ) : (
          <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6 text-sm text-[var(--muted-foreground)]">
            Your liked tracks list is empty right now.
          </div>
        )}
      </section>
    </div>
  );
}
