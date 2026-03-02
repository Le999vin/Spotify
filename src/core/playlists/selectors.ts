import type { PlaylistId } from "@/core/domain/ids";
import type { PlaylistState, Track } from "@/core/domain/types";

export function selectPlaylistById(state: PlaylistState, id: PlaylistId) {
  return state.playlistsById[id] ?? null;
}

export function selectPlaylistTracks(
  state: PlaylistState,
  id: PlaylistId,
  tracksById: Record<string, Track>,
) {
  const playlist = selectPlaylistById(state, id);

  if (!playlist) {
    return [];
  }

  return playlist.trackIds
    .map((trackId) => tracksById[trackId])
    .filter(Boolean);
}

export function selectPlaylistList(state: PlaylistState) {
  return Object.values(state.playlistsById);
}
