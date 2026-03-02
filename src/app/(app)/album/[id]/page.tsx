import { Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TrackTable } from "@/components/music/TrackTable";
import { albumsById, artistsById } from "@/lib/mock/data";

type AlbumPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  const album = albumsById[id];

  if (!album) {
    return (
      <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6 text-sm text-[var(--muted-foreground)]">
        This album is not available in the mock catalog.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-white/8 bg-white/4 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
          <div
            className="aspect-square rounded-[1.75rem] bg-cover bg-center"
            style={{ backgroundImage: `url(${album.coverUrl ?? ""})` }}
          />
          <div className="self-end">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Album
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">{album.title}</h1>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              {artistsById[album.artistId]?.name} • {album.year}
            </p>
            <div className="mt-6">
              <Button asChild>
                <span>
                  <Play className="h-4 w-4" />
                  Press any row to play
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <TrackTable trackIds={album.trackIds} contextLabel={album.title} />
    </div>
  );
}
