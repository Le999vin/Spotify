"use client";

import { Shuffle, Play } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { TrackTable } from "@/components/music/TrackTable";
import { createArtworkDataUrl, playlistsById as staticPlaylistsById } from "@/lib/mock/data";
import { formatCount } from "@/lib/utils";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlaylistStore } from "@/store/playlistStore";

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const playlist = usePlaylistStore((store) => store.state.playlistsById[params.id]);
  const dispatch = usePlaybackStore((store) => store.dispatch);

  if (!playlist) {
    return (
      <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6 text-sm text-[var(--muted-foreground)]">
        That playlist does not exist in this mock library.
      </div>
    );
  }

  const coverUrl =
    playlist.coverUrl ??
    staticPlaylistsById[playlist.id]?.coverUrl ??
    createArtworkDataUrl(playlist.id, playlist.name);

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/4">
        <div className="grid gap-6 p-6 md:grid-cols-[220px_minmax(0,1fr)] md:p-8">
          <div
            className="aspect-square rounded-[1.75rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div className="self-end">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Playlist
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">{playlist.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
              {playlist.description}
            </p>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {playlist.ownerName} • {formatCount(playlist.trackIds.length, "track")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                className="min-w-28"
                onClick={() =>
                  dispatch({
                    type: "QUEUE_SET",
                    trackIds: playlist.trackIds,
                    startIndex: 0,
                  })
                }
              >
                <Play className="h-4 w-4" />
                Play
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({
                    type: "TOGGLE_SHUFFLE",
                    seed:
                      typeof crypto !== "undefined" && "randomUUID" in crypto
                        ? crypto.randomUUID()
                        : `${Date.now()}`,
                  });
                  if (playlist.trackIds.length) {
                    dispatch({
                      type: "QUEUE_SET",
                      trackIds: playlist.trackIds,
                      startIndex: 0,
                    });
                  }
                }}
              >
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </div>
        </div>
      </section>
      <TrackTable trackIds={playlist.trackIds} contextLabel={playlist.name} />
    </div>
  );
}
