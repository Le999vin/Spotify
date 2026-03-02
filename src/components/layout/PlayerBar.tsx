"use client";

import { Heart, Laptop2, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, ListMusic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { selectNowPlaying } from "@/core/playback/selectors";
import { formatDuration } from "@/core/playback/time";
import { artistsById, tracksById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaybackStore } from "@/store/playbackStore";

type PlayerBarProps = {
  onToggleQueue: () => void;
  onOpenMobilePlayer: () => void;
};

function repeatLabel(mode: "off" | "all" | "one") {
  if (mode === "one") {
    return "Repeat one";
  }

  if (mode === "all") {
    return "Repeat all";
  }

  return "Repeat off";
}

export function PlayerBar({ onToggleQueue, onOpenMobilePlayer }: PlayerBarProps) {
  const playbackState = usePlaybackStore((store) => store.state);
  const dispatch = usePlaybackStore((store) => store.dispatch);
  const nowPlaying = selectNowPlaying(playbackState, tracksById);
  const likedTrackIds = useLibraryStore((store) => store.state.likedTrackIds);
  const toggleLike = useLibraryStore((store) => store.dispatch);

  const nextRepeatMode =
    playbackState.repeat === "off"
      ? "all"
      : playbackState.repeat === "all"
        ? "one"
        : "off";

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 hidden border-t border-white/8 bg-[rgba(7,17,17,0.88)] backdrop-blur-xl md:block">
      <div className="mx-auto flex h-[92px] items-center gap-4 px-4 md:px-6">
        <button
          type="button"
          aria-label="Open player"
          onClick={onOpenMobilePlayer}
          className="hidden"
        />
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className="h-14 w-14 shrink-0 rounded-2xl bg-cover bg-center"
            style={{
              backgroundImage: `url(${nowPlaying?.coverUrl ?? ""})`,
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {nowPlaying?.title ?? "Select a track"}
            </p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {nowPlaying ? artistsById[nowPlaying.artistId]?.name : "Queue a playlist to begin"}
            </p>
          </div>
          {nowPlaying ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                likedTrackIds.includes(nowPlaying.id) ? "Unlike current track" : "Like current track"
              }
              onClick={() => toggleLike({ type: "TOGGLE_LIKE", trackId: nowPlaying.id })}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  likedTrackIds.includes(nowPlaying.id) && "fill-[var(--accent)] text-[var(--accent)]",
                )}
              />
            </Button>
          ) : null}
        </div>
        <div className="flex flex-[1.2] flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle shuffle"
              onClick={() =>
                dispatch({
                  type: "TOGGLE_SHUFFLE",
                  seed:
                    typeof crypto !== "undefined" && "randomUUID" in crypto
                      ? crypto.randomUUID()
                      : `${Date.now()}`,
                })
              }
            >
              <Shuffle
                className={cn(
                  "h-4 w-4",
                  playbackState.shuffle && "text-[var(--accent-strong)]",
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous track"
              onClick={() => dispatch({ type: "PREV" })}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              aria-label={playbackState.status === "playing" ? "Pause" : "Play"}
              onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
            >
              {playbackState.status === "playing" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next track"
              onClick={() => dispatch({ type: "NEXT" })}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={repeatLabel(playbackState.repeat)}
              onClick={() => dispatch({ type: "SET_REPEAT", mode: nextRepeatMode })}
            >
              {playbackState.repeat === "one" ? (
                <Repeat1 className="h-4 w-4 text-[var(--accent-strong)]" />
              ) : (
                <Repeat
                  className={cn(
                    "h-4 w-4",
                    playbackState.repeat === "all" && "text-[var(--accent-strong)]",
                  )}
                />
              )}
            </Button>
          </div>
          <div className="flex w-full max-w-xl items-center gap-3">
            <span className="w-10 text-right text-xs text-[var(--muted-foreground)]">
              {formatDuration(playbackState.progressMs)}
            </span>
            <Slider
              aria-label="Track progress"
              value={[playbackState.durationMs ? (playbackState.progressMs / playbackState.durationMs) * 100 : 0]}
              max={100}
              step={1}
              onValueChange={([value]) =>
                dispatch({
                  type: "SEEK",
                  ms: Math.round((value / 100) * playbackState.durationMs),
                })
              }
            />
            <span className="w-10 text-xs text-[var(--muted-foreground)]">
              {formatDuration(playbackState.durationMs)}
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle queue"
            onClick={onToggleQueue}
          >
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Connect to a device">
            <Laptop2 className="h-4 w-4" />
          </Button>
          <div className="hidden w-32 items-center gap-3 lg:flex">
            <Slider
              aria-label="Volume"
              value={[playbackState.volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => dispatch({ type: "SET_VOLUME", value: value / 100 })}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
