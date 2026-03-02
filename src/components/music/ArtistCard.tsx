"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import type { Artist } from "@/core/domain/types";
import { Button } from "@/components/ui/button";
import { tracks } from "@/lib/mock/data";
import { usePlaybackStore } from "@/store/playbackStore";

export function ArtistCard({ artist }: { artist: Artist }) {
  const dispatch = usePlaybackStore((store) => store.dispatch);
  const artistTrackIds = tracks
    .filter((track) => track.artistId === artist.id)
    .slice(0, 5)
    .map((track) => track.id);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <Link
        href={`/artist/${artist.id}`}
        className="group relative block rounded-[1.75rem] border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/6"
      >
        <div
          className="aspect-square rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.coverUrl ?? ""})` }}
        />
        <div className="pt-4">
          <p className="truncate font-semibold">{artist.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {artist.bio ?? "Artist"}
          </p>
        </div>
        <Button
          size="icon"
          aria-label={`Play ${artist.name}`}
          className="absolute bottom-[4.75rem] right-6 translate-y-2 opacity-0 shadow-2xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: "QUEUE_SET",
              trackIds: artistTrackIds,
              startIndex: 0,
            });
          }}
        >
          <Play className="h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
}
