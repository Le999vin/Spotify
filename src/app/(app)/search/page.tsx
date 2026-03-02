import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { TrackTable } from "@/components/music/TrackTable";
import { rankSearchResults } from "@/core/search/rank";
import {
  albums,
  albumsById,
  artists,
  artistsById,
  genreCollections,
  playlists,
  tracks,
} from "@/lib/mock/data";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const queryValue = resolvedSearchParams.q;
  const query = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? "";
  const results = rankSearchResults(query, {
    tracks,
    playlists,
    artists,
    albums,
    artistsById,
    albumsById,
  });

  if (!query) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl font-semibold">Browse all</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Start with Spotify collections, then narrow the query from the topbar.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {genreCollections.map((collection) => (
            <div
              key={collection.id}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/8 p-5"
              style={{ background: collection.gradient }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(7,17,17,0.4))]" />
              <div className="relative">
                <p className="font-display text-2xl font-semibold">{collection.title}</p>
                <p className="mt-2 max-w-48 text-sm text-white/78">{collection.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold">Results for “{query}”</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Track results are ranked with a lightweight client-side scorer from the pure search core.
        </p>
      </div>

      {results.tracks.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Tracks</h2>
          <TrackTable trackIds={results.tracks.slice(0, 12).map((track) => track.id)} />
        </section>
      ) : null}

      {results.playlists.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Playlists</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {results.playlists.slice(0, 4).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      ) : null}

      {results.albums.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Albums</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {results.albums.slice(0, 4).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      ) : null}

      {results.artists.length ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">Artists</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {results.artists.slice(0, 5).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
