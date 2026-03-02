"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Library, ListPlus, Search, House } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { asPlaylistId } from "@/core/domain/ids";
import { usePlaylistStore } from "@/store/playlistStore";

const navItems = [
  { href: "/home", label: "Home", icon: House },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const playlistsById = usePlaylistStore((store) => store.state.playlistsById);
  const dispatch = usePlaylistStore((store) => store.dispatch);

  const sortedPlaylists = useMemo(
    () =>
      Object.values(playlistsById).sort((left, right) => left.name.localeCompare(right.name)),
    [playlistsById],
  );

  return (
    <div className="glass-panel flex h-[calc(100vh-1.5rem)] flex-col rounded-[1.75rem]">
      <div className="border-b border-white/8 px-5 pb-5 pt-6">
        <Link href="/home" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-lg font-bold text-[var(--accent-strong)]">
            P
          </div>
          <div>
            <p className="font-display text-lg font-semibold">Spotify</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Premium Skeleton
            </p>
          </div>
        </Link>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-white/6 text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-white/4 hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center justify-between px-5 pb-3 pt-2">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Playlists
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Curated and custom mixes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Create playlist">
              <ListPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a playlist</DialogTitle>
              <DialogDescription>
                Add a new empty playlist to your sidebar. You can start dropping tracks into it
                right away.
              </DialogDescription>
            </DialogHeader>
            <Input
              aria-label="Playlist name"
              placeholder="Late-night archive"
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
            />
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsOpen(false);
                  setPlaylistName("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!playlistName.trim()}
                onClick={() => {
                  const nextId = asPlaylistId(`playlist-custom-${Date.now()}`);
                  dispatch({
                    type: "PLAYLIST_CREATE",
                    id: nextId,
                    name: playlistName.trim(),
                  });
                  setPlaylistName("");
                  setIsOpen(false);
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="min-h-0 flex-1 px-3 pb-4">
        <div className="space-y-1">
          {sortedPlaylists.map((playlist) => {
            const active = pathname === `/playlist/${playlist.id}`;

            return (
              <Link
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition-colors",
                  active
                    ? "bg-white/6 text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-white/4 hover:text-[var(--foreground)]",
                )}
              >
                <div
                  className="h-11 w-11 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${playlist.coverUrl ?? ""})`,
                  }}
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{playlist.name}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {playlist.trackIds.length} tracks
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
