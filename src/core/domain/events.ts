import type { PlaylistId, TrackId } from "@/core/domain/ids";
import type { RepeatMode } from "@/core/domain/types";

export type PlaybackEvent =
  | { type: "PLAY_TRACK"; trackId: TrackId }
  | { type: "TOGGLE_PLAY" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SEEK"; ms: number }
  | { type: "SET_VOLUME"; value: number }
  | { type: "TOGGLE_SHUFFLE"; seed: string }
  | { type: "SET_REPEAT"; mode: RepeatMode }
  | { type: "QUEUE_SET"; trackIds: TrackId[]; startIndex: number }
  | { type: "QUEUE_ADD_NEXT"; trackId: TrackId }
  | { type: "QUEUE_ADD_END"; trackId: TrackId }
  | { type: "QUEUE_REMOVE"; trackId: TrackId }
  | { type: "QUEUE_REORDER"; fromIndex: number; toIndex: number }
  | { type: "AUDIO_TIME_UPDATE"; progressMs: number; durationMs: number }
  | { type: "AUDIO_BUFFERING" }
  | { type: "AUDIO_READY" }
  | { type: "AUDIO_ENDED" }
  | { type: "AUDIO_ERROR"; message: string };

export type LibraryEvent = { type: "TOGGLE_LIKE"; trackId: TrackId };

export type PlaylistEvent =
  | { type: "PLAYLIST_CREATE"; id: PlaylistId; name: string }
  | { type: "PLAYLIST_RENAME"; id: PlaylistId; name: string }
  | { type: "PLAYLIST_ADD_TRACK"; id: PlaylistId; trackId: TrackId; position?: number }
  | { type: "PLAYLIST_REMOVE_TRACK"; id: PlaylistId; trackId: TrackId }
  | { type: "PLAYLIST_REORDER_TRACK"; id: PlaylistId; from: number; to: number };
