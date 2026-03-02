"use client";

import { useEffect, useMemo, useState } from "react";
import { Album, Disc3, Music4, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { rankSearchResults } from "@/core/search/rank";
import {
  albums,
  albumsById,
  artists,
  artistsById,
  playlists,
  tracks,
} from "@/lib/mock/data";
import { usePlaybackStore } from "@/store/playbackStore";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.getAttribute("role") === "textbox" ||
    target.getAttribute("role") === "slider" ||
    target.tagName === "BUTTON"
  );
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const playbackState = usePlaybackStore((store) => store.state);
  const dispatch = usePlaybackStore((store) => store.dispatch);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }

      if (event.code === "Space" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (isEditableTarget(event.target)) {
          return;
        }

        event.preventDefault();

        if (playbackState.currentId) {
          dispatch({ type: "TOGGLE_PLAY" });
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, playbackState.currentId]);

  const results = useMemo(
    () =>
      rankSearchResults(query, {
        tracks,
        playlists,
        artists,
        albums,
        artistsById,
        albumsById,
      }),
    [query],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search Pulsefy"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results for that search.</CommandEmpty>
        {results.tracks.length ? (
          <CommandGroup heading="Tracks">
            {results.tracks.slice(0, 6).map((track) => (
              <CommandItem
                key={track.id}
                value={`${track.title} ${artistsById[track.artistId]?.name ?? ""}`}
                onSelect={() => {
                  const activeOrder = playbackState.seededShuffle?.order ?? playbackState.queue;

                  if (activeOrder.includes(track.id)) {
                    dispatch({ type: "PLAY_TRACK", trackId: track.id });
                  } else {
                    dispatch({
                      type: "QUEUE_SET",
                      trackIds: [track.id],
                      startIndex: 0,
                    });
                  }

                  setOpen(false);
                }}
              >
                <Music4 className="h-4 w-4" />
                <div>
                  <p>{track.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {artistsById[track.artistId]?.name}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        {results.playlists.length ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Playlists">
              {results.playlists.slice(0, 5).map((playlist) => (
                <CommandItem
                  key={playlist.id}
                  value={`${playlist.name} ${playlist.description}`}
                  onSelect={() => {
                    router.push(`/playlist/${playlist.id}`);
                    setOpen(false);
                  }}
                >
                  <Disc3 className="h-4 w-4" />
                  <div>
                    <p>{playlist.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {playlist.ownerName}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
        {results.artists.length ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Artists">
              {results.artists.slice(0, 5).map((artist) => (
                <CommandItem
                  key={artist.id}
                  value={`${artist.name} ${artist.bio ?? ""}`}
                  onSelect={() => {
                    router.push(`/artist/${artist.id}`);
                    setOpen(false);
                  }}
                >
                  <UserRound className="h-4 w-4" />
                  <div>
                    <p>{artist.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {artist.bio ?? "Artist"}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
        {results.albums.length ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Albums">
              {results.albums.slice(0, 4).map((album) => (
                <CommandItem
                  key={album.id}
                  value={`${album.title} ${artistsById[album.artistId]?.name ?? ""}`}
                  onSelect={() => {
                    router.push(`/album/${album.id}`);
                    setOpen(false);
                  }}
                >
                  <Album className="h-4 w-4" />
                  <div>
                    <p>{album.title}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {artistsById[album.artistId]?.name}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : null}
        {!query ? (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quick Shortcuts">
              <CommandItem
                value="search"
                onSelect={() => {
                  router.push("/search");
                  setOpen(false);
                }}
              >
                <Search className="h-4 w-4" />
                Open Search
              </CommandItem>
            </CommandGroup>
          </>
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}
