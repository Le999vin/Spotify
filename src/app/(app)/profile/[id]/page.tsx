import { PlaylistCard } from "@/components/music/PlaylistCard";
import { currentUser, playlistsById } from "@/lib/mock/data";
import { formatCount } from "@/lib/utils";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;

  if (id !== currentUser.id) {
    return (
      <div className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6 text-sm text-[var(--muted-foreground)]">
        This profile is not present in the current mock dataset.
      </div>
    );
  }

  const profilePlaylists = currentUser.playlistIds
    .map((playlistId) => playlistsById[playlistId])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/8 bg-white/4 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Profile
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold md:text-6xl">{currentUser.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
          {currentUser.headline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[var(--muted-foreground)]">
          <span>{formatCount(currentUser.listeningMinutes, "minute")}</span>
          <span>{formatCount(currentUser.followerCount, "follower")}</span>
          <span>{formatCount(currentUser.playlistIds.length, "public playlist")}</span>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Public playlists</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {profilePlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </div>
  );
}
