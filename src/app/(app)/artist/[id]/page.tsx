import { AlbumCard } from "@/components/music/AlbumCard";
import { TrackTable } from "@/components/music/TrackTable";
import { albums, artistTopTracks, artistsById } from "@/lib/mock/data";

type ArtistPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { id } = await params;
  const artist = artistsById[id];

  if (!artist) {
    return (
      <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6 text-sm text-[var(--muted-foreground)]">
        That artist does not exist in this mock catalog.
      </div>
    );
  }

  const topTracks = artistTopTracks[artist.id] ?? [];
  const artistAlbums = albums.filter((album) => album.artistId === artist.id);

  return (
    <div className="space-y-8">
      <section
        className="overflow-hidden rounded-[2rem] border border-white/8 p-6 md:p-8"
        style={{
          background:
            "linear-gradient(135deg, rgba(13,209,179,0.14), rgba(61,140,255,0.12), rgba(7,17,17,0.8))",
        }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end">
          <div
            className="h-36 w-36 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${artist.coverUrl ?? ""})` }}
          />
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Artist
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">{artist.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
              {artist.bio}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Top tracks</h2>
        <TrackTable trackIds={topTracks.map((track) => track.id)} contextLabel={artist.name} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Albums</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {artistAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
}
