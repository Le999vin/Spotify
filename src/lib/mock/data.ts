import {
  asAlbumId,
  asArtistId,
  asPlaylistId,
  asTrackId,
  asUserId,
} from "@/core/domain/ids";
import type {
  Album,
  Artist,
  GenreCollection,
  Playlist,
  Track,
  UserProfile,
} from "@/core/domain/types";
import {
  albumSchema,
  artistSchema,
  genreCollectionSchema,
  playlistSchema,
  trackSchema,
} from "@/lib/mock/schemas";

const artworkPalette = [
  ["#0e2a2a", "#1aa88f", "#88f4d5"],
  ["#102a38", "#256ed8", "#59b0ff"],
  ["#24152e", "#7f4ef3", "#cfbeff"],
  ["#281611", "#d97706", "#ffc45f"],
  ["#10211c", "#0f9b74", "#7bf3c4"],
];

export function createArtworkDataUrl(seed: string, label: string) {
  const colors = artworkPalette[
    Math.abs(seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) %
      artworkPalette.length
  ];
  const [bg, mid, fg] = colors;
  const safeLabel = label.slice(0, 18);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="50%" stop-color="${mid}" />
          <stop offset="100%" stop-color="${fg}" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" rx="44" fill="url(#g)" />
      <circle cx="315" cy="85" r="56" fill="rgba(255,255,255,0.12)" />
      <circle cx="90" cy="320" r="92" fill="rgba(255,255,255,0.08)" />
      <text x="36" y="336" font-family="Arial, sans-serif" font-size="32" fill="rgba(255,255,255,0.88)">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function toRecord<T extends { id: string }>(items: T[]) {
  return Object.fromEntries(items.map((item) => [item.id, item])) as Record<string, T>;
}

const rawArtists = artistSchema.array().parse([
  {
    id: "artist-1",
    name: "Aural Coast",
    bio: "Warm synth textures built for late train rides.",
    coverUrl: createArtworkDataUrl("artist-1", "Aural Coast"),
  },
  {
    id: "artist-2",
    name: "Cyan Avenue",
    bio: "Glass-clean pop structures with neon hooks.",
    coverUrl: createArtworkDataUrl("artist-2", "Cyan Avenue"),
  },
  {
    id: "artist-3",
    name: "Marble Echo",
    bio: "Soft-focus grooves and velvet low-end.",
    coverUrl: createArtworkDataUrl("artist-3", "Marble Echo"),
  },
  {
    id: "artist-4",
    name: "Static Bloom",
    bio: "Edge-lit indie electronics with fast kick patterns.",
    coverUrl: createArtworkDataUrl("artist-4", "Static Bloom"),
  },
  {
    id: "artist-5",
    name: "North Current",
    bio: "Cool-toned alt-pop from the shoreline.",
    coverUrl: createArtworkDataUrl("artist-5", "North Current"),
  },
  {
    id: "artist-6",
    name: "Echo Vale",
    bio: "Ambient pulsework for focused sessions.",
    coverUrl: createArtworkDataUrl("artist-6", "Echo Vale"),
  },
  {
    id: "artist-7",
    name: "Harbor Phase",
    bio: "Percussive club cuts with a cinematic finish.",
    coverUrl: createArtworkDataUrl("artist-7", "Harbor Phase"),
  },
  {
    id: "artist-8",
    name: "Solar Motel",
    bio: "Sunlit hooks and patient bass lines.",
    coverUrl: createArtworkDataUrl("artist-8", "Solar Motel"),
  },
  {
    id: "artist-9",
    name: "Velvet Circuit",
    bio: "After-hours club textures built for the quiet city.",
    coverUrl: createArtworkDataUrl("artist-9", "Velvet Circuit"),
  },
  {
    id: "artist-10",
    name: "Tide Theory",
    bio: "Minimalist rhythm studies and tidal drones.",
    coverUrl: createArtworkDataUrl("artist-10", "Tide Theory"),
  },
]);

export const artists: Artist[] = rawArtists.map((artist) => ({
  ...artist,
  id: asArtistId(artist.id),
}));

const albumSpecs = [
  { id: "album-1", title: "Drift Signal", artistId: "artist-1", year: 2024, range: [1, 4] },
  { id: "album-2", title: "Midnight Relay", artistId: "artist-2", year: 2025, range: [5, 8] },
  { id: "album-3", title: "Glass Hours", artistId: "artist-3", year: 2023, range: [9, 12] },
  { id: "album-4", title: "Electric Tides", artistId: "artist-4", year: 2022, range: [13, 16] },
  { id: "album-5", title: "Daybreak Codes", artistId: "artist-5", year: 2021, range: [17, 20] },
  { id: "album-6", title: "Quiet Neon", artistId: "artist-6", year: 2020, range: [21, 24] },
  { id: "album-7", title: "Coast Protocol", artistId: "artist-7", year: 2025, range: [25, 27] },
  { id: "album-8", title: "Velvet Motion", artistId: "artist-8", year: 2024, range: [28, 30] },
];

const rawAlbums = albumSchema.array().parse(
  albumSpecs.map((album) => ({
    id: album.id,
    title: album.title,
    artistId: album.artistId,
    year: album.year,
    trackIds: Array.from(
      { length: album.range[1] - album.range[0] + 1 },
      (_, index) => `track-${album.range[0] + index}`,
    ),
    coverUrl: createArtworkDataUrl(album.id, album.title),
  })),
);

export const albums: Album[] = rawAlbums.map((album) => ({
  ...album,
  id: asAlbumId(album.id),
  artistId: asArtistId(album.artistId),
  trackIds: album.trackIds.map((trackId) => asTrackId(trackId)),
}));

const trackTitles = [
  "Aurora Lane",
  "Low Tide Memory",
  "Blue Static",
  "Afterline",
  "Glassline",
  "Sleepless Harbor",
  "Metro Bloom",
  "Day Signal",
  "Night Ribbon",
  "Polaroid Rain",
  "Mirage Code",
  "Open Frequency",
  "Hollow Neon",
  "Signal Fire",
  "Paper Satellites",
  "Silver Fade",
  "Morning Current",
  "Slate Horizon",
  "Golden Syntax",
  "Runway Quiet",
  "Winter Pulse",
  "Soft Circuit",
  "Afterglow Keys",
  "Deep Frame",
  "Harbor Dress",
  "Parallel Coast",
  "Blue Motel",
  "Moonstep",
  "Velvet Chrome",
  "Last Window",
];

const trackKeys = ["C#m", "F#m", "Am", "Dm", "G", "Bm"];
const trackTags = [
  ["night", "focus", "synthwave"],
  ["drive", "coastal", "indie"],
  ["late", "groove", "glass"],
  ["sunset", "bass", "warm"],
  ["club", "neon", "pulse"],
];

const rawTracks = trackSchema.array().parse(
  trackTitles.map((title, index) => {
    const number = index + 1;
    const album = rawAlbums.find((item) => item.trackIds.includes(`track-${number}`));
    const playable = number <= 12;

    return {
      id: `track-${number}`,
      title,
      artistId: album?.artistId ?? "artist-1",
      albumId: album?.id ?? "album-1",
      durationMs: 144000 + ((number * 17000) % 132000),
      coverUrl: createArtworkDataUrl(`track-${number}`, title),
      audioUrl: playable ? `/audio/preview-${((number - 1) % 3) + 1}.wav` : null,
      tags: trackTags[index % trackTags.length],
      bpm: number % 3 === 0 ? 92 + ((number * 7) % 46) : undefined,
      key: number % 4 === 0 ? trackKeys[index % trackKeys.length] : undefined,
    };
  }),
);

export const tracks: Track[] = rawTracks.map((track) => ({
  ...track,
  id: asTrackId(track.id),
  artistId: asArtistId(track.artistId),
  albumId: asAlbumId(track.albumId),
}));

const rawPlaylists = playlistSchema.array().parse([
  {
    id: "playlist-1",
    name: "After Hours Lift",
    description: "Sleek pulse-pop for midnight momentum.",
    ownerName: "Spotify",
    trackIds: ["track-2", "track-5", "track-7", "track-9", "track-12", "track-15", "track-19"],
    coverUrl: createArtworkDataUrl("playlist-1", "After Hours"),
  },
  {
    id: "playlist-2",
    name: "Coastline Focus",
    description: "Steady grooves for long-focus blocks.",
    ownerName: "Spotify",
    trackIds: ["track-1", "track-3", "track-6", "track-11", "track-14", "track-22", "track-23", "track-26"],
    coverUrl: createArtworkDataUrl("playlist-2", "Coastline"),
  },
  {
    id: "playlist-3",
    name: "Studio Dawn",
    description: "Open-framed hooks and early light.",
    ownerName: "Spotify",
    trackIds: ["track-4", "track-8", "track-10", "track-13", "track-16", "track-18"],
    coverUrl: createArtworkDataUrl("playlist-3", "Studio Dawn"),
  },
  {
    id: "playlist-4",
    name: "Soft Motion",
    description: "Calm club pressure for slower rooms.",
    ownerName: "Spotify",
    trackIds: ["track-17", "track-18", "track-19", "track-20", "track-21", "track-24", "track-27"],
    coverUrl: createArtworkDataUrl("playlist-4", "Soft Motion"),
  },
  {
    id: "playlist-5",
    name: "City Glass",
    description: "Reflective pop for neon commutes.",
    ownerName: "Mara Vale",
    trackIds: ["track-5", "track-6", "track-7", "track-8", "track-20", "track-28", "track-29"],
    coverUrl: createArtworkDataUrl("playlist-5", "City Glass"),
  },
  {
    id: "playlist-6",
    name: "Quiet Current",
    description: "Deep ambient edges without losing the pulse.",
    ownerName: "Niko Hart",
    trackIds: ["track-9", "track-10", "track-11", "track-21", "track-22", "track-23", "track-24", "track-30"],
    coverUrl: createArtworkDataUrl("playlist-6", "Quiet Current"),
  },
  {
    id: "playlist-7",
    name: "Harbor Run",
    description: "Fast-footed percussion with a coastal push.",
    ownerName: "Spotify",
    trackIds: ["track-12", "track-13", "track-14", "track-25", "track-26", "track-27", "track-28", "track-29", "track-30"],
    coverUrl: createArtworkDataUrl("playlist-7", "Harbor Run"),
  },
  {
    id: "playlist-8",
    name: "Velvet Code",
    description: "Smooth hooks, richer lows, cleaner edges.",
    ownerName: "Spotify",
    trackIds: ["track-3", "track-6", "track-12", "track-18", "track-24", "track-27", "track-30"],
    coverUrl: createArtworkDataUrl("playlist-8", "Velvet Code"),
  },
]);

export const playlists: Playlist[] = rawPlaylists.map((playlist) => ({
  ...playlist,
  id: asPlaylistId(playlist.id),
  trackIds: playlist.trackIds.map((trackId) => asTrackId(trackId)),
}));

const rawGenres = genreCollectionSchema.array().parse([
  {
    id: "genre-neon-pulse",
    title: "Neon Pulse",
    subtitle: "Glossy motion and deep-cut hooks.",
    gradient: "linear-gradient(135deg, #113c40, #0dd1b3)",
  },
  {
    id: "genre-late-focus",
    title: "Late Focus",
    subtitle: "Clean rhythm for long-form concentration.",
    gradient: "linear-gradient(135deg, #172a45, #3d8cff)",
  },
  {
    id: "genre-coast-drive",
    title: "Coast Drive",
    subtitle: "Open-road warmth with a soft kick.",
    gradient: "linear-gradient(135deg, #2a1b18, #ff914d)",
  },
  {
    id: "genre-quiet-club",
    title: "Quiet Club",
    subtitle: "Understated pressure for after-midnight rooms.",
    gradient: "linear-gradient(135deg, #25143b, #ab7dff)",
  },
]);

export const genreCollections: GenreCollection[] = rawGenres;

export const artistsById = toRecord(artists);
export const albumsById = toRecord(albums);
export const tracksById = toRecord(tracks);
export const playlistsById = toRecord(playlists);

export const currentUser: UserProfile = {
  id: asUserId("profile-you"),
  name: "Lena Parker",
  headline: "Collecting calm pulse and sharp hooks.",
  playlistIds: [playlists[0].id, playlists[2].id, playlists[6].id],
  listeningMinutes: 12480,
  followerCount: 238,
};

export const artistTopTracks: Record<string, Track[]> = Object.fromEntries(
  artists.map((artist) => [
    artist.id,
    tracks.filter((track) => track.artistId === artist.id).slice(0, 5),
  ]),
);
