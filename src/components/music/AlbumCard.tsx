"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

import type { Album } from "@/core/domain/types";
import { Button } from "@/components/ui/button";
import { artistsById } from "@/lib/mock/data";
import { usePlaybackStore } from "@/store/playbackStore";

export function AlbumCard({ album }: { album: Album }) {
  const dispatch = usePlaybackStore((store) => store.dispatch);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }}>
      <Link
        href={`/album/${album.id}`}
        className="group relative block rounded-[1.75rem] border border-white/8 bg-white/4 p-4 transition-colors hover:bg-white/6"
      >
        <div
          className="aspect-square rounded-[1.4rem] bg-cover bg-center"
          style={{ backgroundImage: `url(${album.coverUrl ?? ""})` }}
        />
        <div className="pt-4">
          <p className="truncate font-semibold">{album.title}</p>
          <p className="mt-1 truncate text-sm text-[var(--muted-foreground)]">
            {artistsById[album.artistId]?.name} • {album.year}
          </p>
        </div>
        <Button
          size="icon"
          aria-label={`Play ${album.title}`}
          className="absolute bottom-[4.75rem] right-6 translate-y-2 opacity-0 shadow-2xl transition-all group-hover:translate-y-0 group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dispatch({
              type: "QUEUE_SET",
              trackIds: album.trackIds,
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
