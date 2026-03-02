"use client";

import { Heart, PlusCircle, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { toast } from "sonner";

import type { Track } from "@/core/domain/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useLibraryStore } from "@/store/libraryStore";
import { usePlaybackStore } from "@/store/playbackStore";
import { usePlaylistStore } from "@/store/playlistStore";

type TrackContextMenuProps = {
  track: Track;
  children: ReactNode;
};

export function TrackContextMenu({ track, children }: TrackContextMenuProps) {
  const router = useRouter();
  const likedTrackIds = useLibraryStore((store) => store.state.likedTrackIds);
  const libraryDispatch = useLibraryStore((store) => store.dispatch);
  const playbackDispatch = usePlaybackStore((store) => store.dispatch);
  const playlistDispatch = usePlaylistStore((store) => store.dispatch);
  const playlistsById = usePlaylistStore((store) => store.state.playlistsById);
  const playlists = useMemo(() => Object.values(playlistsById), [playlistsById]);
  const isLiked = likedTrackIds.includes(track.id);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={() => playbackDispatch({ type: "QUEUE_ADD_END", trackId: track.id })}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to queue
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => libraryDispatch({ type: "TOGGLE_LIKE", trackId: track.id })}
        >
          <Heart className="mr-2 h-4 w-4" />
          {isLiked ? "Unlike" : "Like"}
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => router.push(`/artist/${track.artistId}`)}>
          Go to artist
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => toast.success("Share link copied (mock).")}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Add to playlist</ContextMenuLabel>
        {playlists.slice(0, 6).map((playlist) => (
          <ContextMenuItem
            key={playlist.id}
            inset
            onSelect={() =>
              playlistDispatch({
                type: "PLAYLIST_ADD_TRACK",
                id: playlist.id,
                trackId: track.id,
              })
            }
          >
            {playlist.name}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
