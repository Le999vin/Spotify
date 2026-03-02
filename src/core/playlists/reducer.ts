import type { PlaylistEvent } from "@/core/domain/events";
import type { PlaylistState } from "@/core/domain/types";
import { reorder } from "@/core/playback/queue";

export const initialPlaylistState: PlaylistState = {
  playlistsById: {},
};

export function reducePlaylists(
  state: PlaylistState,
  event: PlaylistEvent,
): PlaylistState {
  switch (event.type) {
    case "PLAYLIST_CREATE":
      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [event.id]: {
            id: event.id,
            name: event.name,
            description: "A fresh Spotify mix ready for your next session.",
            ownerName: "You",
            trackIds: [],
          },
        },
      };

    case "PLAYLIST_RENAME": {
      const playlist = state.playlistsById[event.id];

      if (!playlist) {
        return state;
      }

      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [event.id]: {
            ...playlist,
            name: event.name,
          },
        },
      };
    }

    case "PLAYLIST_ADD_TRACK": {
      const playlist = state.playlistsById[event.id];

      if (!playlist) {
        return state;
      }

      const nextTrackIds = [...playlist.trackIds];
      const insertPosition =
        typeof event.position === "number"
          ? Math.max(0, Math.min(event.position, nextTrackIds.length))
          : nextTrackIds.length;
      nextTrackIds.splice(insertPosition, 0, event.trackId);

      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [event.id]: {
            ...playlist,
            trackIds: nextTrackIds,
          },
        },
      };
    }

    case "PLAYLIST_REMOVE_TRACK": {
      const playlist = state.playlistsById[event.id];

      if (!playlist) {
        return state;
      }

      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [event.id]: {
            ...playlist,
            trackIds: playlist.trackIds.filter((trackId) => trackId !== event.trackId),
          },
        },
      };
    }

    case "PLAYLIST_REORDER_TRACK": {
      const playlist = state.playlistsById[event.id];

      if (!playlist) {
        return state;
      }

      return {
        ...state,
        playlistsById: {
          ...state.playlistsById,
          [event.id]: {
            ...playlist,
            trackIds: reorder(playlist.trackIds, event.from, event.to),
          },
        },
      };
    }

    default:
      return state;
  }
}
