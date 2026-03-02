"use client";

import { Heart, MoreHorizontal, Play } from "lucide-react";

import type { TrackId } from "@/core/domain/ids";
import { Button } from "@/components/ui/button";
import { VisualizerMini } from "@/components/music/VisualizerMini";
import { TrackContextMenu } from "@/components/music/TrackContextMenu";
import { selectIsPlaying } from "@/core/playback/selectors";
import { formatDuration } from "@/core/playback/time";
import { artistsById, albumsById, tracksById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaybackStore } from "@/store/playbackStore";

type TrackRowProps = {
  trackId: TrackId;
  index: number;
  queueTrackIds: TrackId[];
};

export function TrackRow({ trackId, index, queueTrackIds }: TrackRowProps) {
  const track = tracksById[trackId];
  const playbackState = usePlaybackStore((store) => store.state);
  const playbackDispatch = usePlaybackStore((store) => store.dispatch);
  const likedTrackIds = useLibraryStore((store) => store.state.likedTrackIds);
  const libraryDispatch = useLibraryStore((store) => store.dispatch);

  if (!track) {
    return null;
  }

  const isCurrentTrack = playbackState.currentId === track.id;
  const isPlaying = selectIsPlaying(playbackState);

  return (
    <TrackContextMenu track={track}>
      <div
        className={cn(
          "group grid grid-cols-[40px_minmax(0,1.5fr)_minmax(0,1fr)_72px_88px] items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-colors hover:bg-white/5",
          isCurrentTrack && "bg-white/6",
        )}
      >
        <button
          type="button"
          aria-label={`Play ${track.title}`}
          onClick={() =>
            playbackDispatch({
              type: "QUEUE_SET",
              trackIds: queueTrackIds,
              startIndex: index,
            })
          }
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--foreground)]"
        >
          {isCurrentTrack ? (
            <VisualizerMini playing={isPlaying} />
          ) : (
            <>
              <span className="group-hover:opacity-0">{index + 1}</span>
              <Play className="absolute h-3.5 w-3.5 opacity-0 group-hover:opacity-100" />
            </>
          )}
        </button>
        <button
          type="button"
          className="min-w-0 text-left"
          onClick={() =>
            playbackDispatch({
              type: "QUEUE_SET",
              trackIds: queueTrackIds,
              startIndex: index,
            })
          }
        >
          <p className={cn("truncate font-medium", isCurrentTrack && "text-[var(--accent-strong)]")}>
            {track.title}
          </p>
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {artistsById[track.artistId]?.name}
          </p>
        </button>
        <div className="min-w-0">
          <p className="truncate text-[var(--muted-foreground)]">
            {albumsById[track.albumId]?.title}
          </p>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          {formatDuration(track.durationMs)}
        </span>
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              likedTrackIds.includes(track.id) ? "Unlike this track" : "Like this track"
            }
            onClick={(event) => {
              event.stopPropagation();
              libraryDispatch({ type: "TOGGLE_LIKE", trackId: track.id });
            }}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                likedTrackIds.includes(track.id) && "fill-[var(--accent)] text-[var(--accent)]",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More actions available in the context menu"
            onClick={(event) => event.preventDefault()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TrackContextMenu>
  );
}
