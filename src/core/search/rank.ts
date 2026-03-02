import type { Album, Artist, Playlist, Track } from "@/core/domain/types";
import { normalizeText, tokenizeQuery } from "@/core/search/normalize";

type SearchCatalog = {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
  albums: Album[];
  artistsById: Record<string, Artist>;
  albumsById: Record<string, Album>;
};

function scoreTokens(tokens: string[], fields: string[]) {
  return tokens.reduce((score, token) => {
    return (
      score +
      fields.reduce((fieldScore, field, index) => {
        const normalized = normalizeText(field);

        if (!normalized) {
          return fieldScore;
        }

        if (normalized === token) {
          return fieldScore + Math.max(1, 12 - index * 2);
        }

        if (normalized.startsWith(token)) {
          return fieldScore + Math.max(1, 8 - index);
        }

        if (normalized.includes(token)) {
          return fieldScore + Math.max(1, 4 - index);
        }

        return fieldScore;
      }, 0)
    );
  }, 0);
}

export function rankSearchResults(query: string, data: SearchCatalog) {
  const tokens = tokenizeQuery(query);

  if (!tokens.length) {
    return {
      tracks: [] as Track[],
      playlists: [] as Playlist[],
      artists: [] as Artist[],
      albums: [] as Album[],
    };
  }

  const rankedTracks = data.tracks
    .map((track) => ({
      item: track,
      score: scoreTokens(tokens, [
        track.title,
        ...(track.tags ?? []),
        data.artistsById[track.artistId]?.name ?? "",
        data.albumsById[track.albumId]?.title ?? "",
      ]),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  const rankedPlaylists = data.playlists
    .map((playlist) => ({
      item: playlist,
      score: scoreTokens(tokens, [playlist.name, playlist.description, playlist.ownerName]),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  const rankedArtists = data.artists
    .map((artist) => ({
      item: artist,
      score: scoreTokens(tokens, [artist.name, artist.bio ?? ""]),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  const rankedAlbums = data.albums
    .map((album) => ({
      item: album,
      score: scoreTokens(tokens, [album.title, data.artistsById[album.artistId]?.name ?? ""]),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  return {
    tracks: rankedTracks,
    playlists: rankedPlaylists,
    artists: rankedArtists,
    albums: rankedAlbums,
  };
}
