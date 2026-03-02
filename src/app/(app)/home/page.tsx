import { AlbumCard } from "@/components/music/AlbumCard";
import { ArtistCard } from "@/components/music/ArtistCard";
import { PlaylistCard } from "@/components/music/PlaylistCard";
import { albums, artists, playlists } from "@/lib/mock/data";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="pulsefy-grid relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/4 p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,209,179,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(61,140,255,0.18),transparent_34%)]" />
        <div className="relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Pulsefy
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            A familiar music flow, rebuilt with a cleaner core.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] md:text-base">
            Browse curated mock collections, launch previews, reorder the queue, and shape the
            playback state through pure reducers instead of hidden UI logic.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Recently played</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Playlists with a sharp late-night lean</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {playlists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Recommended albums</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Fresh cuts from the mock catalog</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {albums.slice(0, 4).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold">Favorite artists</h2>
          <p className="text-sm text-[var(--muted-foreground)]">Tap in for top tracks and album runs</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {artists.slice(0, 5).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
}
