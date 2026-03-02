"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { selectNowPlaying } from "@/core/playback/selectors";
import { formatDuration } from "@/core/playback/time";
import { artistsById, tracksById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaybackStore } from "@/store/playbackStore";

type NowPlayingSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NowPlayingSheet({ isOpen, onClose }: NowPlayingSheetProps) {
  const router = useRouter();
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
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 500 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] border-t border-white/8 bg-[var(--background-elevated)] px-5 pb-8 pt-5 md:hidden"
          >
            <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/10" />
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Now Playing
              </p>
              <Button variant="ghost" size="icon" aria-label="Close player" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="aspect-square rounded-[2rem] bg-cover bg-center"
              style={{ backgroundImage: `url(${nowPlaying?.coverUrl ?? ""})` }}
            />
            <div className="mt-6 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">
                  {nowPlaying?.title ?? "Select a track"}
                </p>
                <p className="truncate text-sm text-[var(--muted-foreground)]">
                  {nowPlaying ? artistsById[nowPlaying.artistId]?.name : "Spotify"}
                </p>
              </div>
              {nowPlaying ? (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={likedTrackIds.includes(nowPlaying.id) ? "Unlike track" : "Like track"}
                  onClick={() => toggleLike({ type: "TOGGLE_LIKE", trackId: nowPlaying.id })}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      likedTrackIds.includes(nowPlaying.id) && "fill-[var(--accent)] text-[var(--accent)]",
                    )}
                  />
                </Button>
              ) : null}
            </div>
            <div className="mt-6 space-y-2">
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
              <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
                <span>{formatDuration(playbackState.progressMs)}</span>
                <span>{formatDuration(playbackState.durationMs)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
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
              <Button variant="ghost" size="icon" aria-label="Previous" onClick={() => dispatch({ type: "PREV" })}>
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button size="icon" aria-label="Toggle play" onClick={() => dispatch({ type: "TOGGLE_PLAY" })}>
                {playbackState.status === "playing" ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next" onClick={() => dispatch({ type: "NEXT" })}>
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Repeat mode"
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
            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  onClose();
                  router.push("/queue");
                }}
              >
                <ListMusic className="h-4 w-4" />
                Queue
              </Button>
              <div className="flex-1">
                <Slider
                  aria-label="Volume"
                  value={[playbackState.volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([value]) =>
                    dispatch({
                      type: "SET_VOLUME",
                      value: value / 100,
                    })
                  }
                />
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
