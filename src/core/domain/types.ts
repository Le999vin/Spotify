import type {
  AlbumId,
  ArtistId,
  PlaylistId,
  TrackId,
  UserId,
} from "@/core/domain/ids";

export type Track = {
  id: TrackId;
  title: string;
  artistId: ArtistId;
  albumId: AlbumId;
  durationMs: number;
  coverUrl: string;
  audioUrl: string | null;
  tags: string[];
  bpm?: number;
  key?: string;
};

export type Album = {
  id: AlbumId;
  title: string;
  artistId: ArtistId;
  year: number;
  trackIds: TrackId[];
  coverUrl?: string;
};

export type Artist = {
  id: ArtistId;
  name: string;
  coverUrl?: string;
  bio?: string;
};

export type Playlist = {
  id: PlaylistId;
  name: string;
  description: string;
  ownerName: string;
  trackIds: TrackId[];
  coverUrl?: string;
};

export type GenreCollection = {
  id: string;
  title: string;
  subtitle: string;
  gradient: string;
};

export type UserProfile = {
  id: UserId;
  name: string;
  headline: string;
  playlistIds: PlaylistId[];
  listeningMinutes: number;
  followerCount: number;
};

export type PlaybackStatus = "idle" | "playing" | "paused" | "buffering" | "error";
export type RepeatMode = "off" | "all" | "one";

export type PlaybackState = {
  status: PlaybackStatus;
  currentId: TrackId | null;
  queue: TrackId[];
  queueIndex: number;
  progressMs: number;
  durationMs: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  seededShuffle: { seed: string; order: TrackId[] } | null;
};

export type LibraryState = {
  likedTrackIds: TrackId[];
};

export type PlaylistState = {
  playlistsById: Record<string, Playlist>;
};
