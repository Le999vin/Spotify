"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import type { Playlist } from "@/core/domain/types";
import { Button } from "@/components/ui/button";
import { usePlaybackStore } from "@/store/playbackStore";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const dispatch = usePlaybackStore((store) => store.dispatch);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <Link
        href={`/playlist/${playlist.id}`}
        className="group relative block rounded-[1.75rem] border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/6"
      >
        <div
          className="aspect-square rounded-[1.4rem] bg-cover bg-center"
          style={{ backgroundImage: `url(${playlist.coverUrl ?? ""})` }}
        />
        <div className="pt-4">
          <p className="truncate font-semibold">{playlist.name}</p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {playlist.description}
          </p>
        </div>
        <Button
          size="icon"
          aria-label={`Play ${playlist.name}`}
          className="absolute bottom-[5.25rem] right-6 translate-y-2 opacity-0 shadow-2xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: "QUEUE_SET",
              trackIds: playlist.trackIds,
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
