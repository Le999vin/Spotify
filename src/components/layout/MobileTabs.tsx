"use client";

import Link from "next/link";
import { House, Library, Pause, Play, Search } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { selectNowPlaying } from "@/core/playback/selectors";
import { artistsById, tracksById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { usePlaybackStore } from "@/store/playbackStore";

type MobileTabsProps = {
  onOpenPlayer: () => void;
};

const tabs = [
  { href: "/home", label: "Home", icon: House },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export function MobileTabs({ onOpenPlayer }: MobileTabsProps) {
  const pathname = usePathname();
  const playbackState = usePlaybackStore((store) => store.state);
  const dispatch = usePlaybackStore((store) => store.dispatch);
  const nowPlaying = selectNowPlaying(playbackState, tracksById);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[rgba(7,17,17,0.94)] backdrop-blur-xl md:hidden">
      {nowPlaying ? (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-3 rounded-3xl border border-white/8 bg-white/4 px-3 py-3">
            <button
              type="button"
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              onClick={onOpenPlayer}
            >
              <div
                className="h-11 w-11 shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${nowPlaying.coverUrl})` }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{nowPlaying.title}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {artistsById[nowPlaying.artistId]?.name}
                </p>
              </div>
            </button>
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
          </div>
        </div>
      ) : null}
      <nav className="grid grid-cols-3 px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-xs font-medium transition-colors",
                active
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
