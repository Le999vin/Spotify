import { describe, expect, it } from "vitest";

import { asPlaylistId, asTrackId } from "@/core/domain/ids";
import { initialPlaylistState, reducePlaylists } from "@/core/playlists/reducer";

describe("reducePlaylists", () => {
  it("creates, renames, mutates, and reorders playlist tracks", () => {
    const playlistId = asPlaylistId("playlist-test");
    const created = reducePlaylists(initialPlaylistState, {
      type: "PLAYLIST_CREATE",
      id: playlistId,
      name: "Test",
    });
    const renamed = reducePlaylists(created, {
      type: "PLAYLIST_RENAME",
      id: playlistId,
      name: "Renamed",
    });
    const withTracks = reducePlaylists(
      reducePlaylists(renamed, {
        type: "PLAYLIST_ADD_TRACK",
        id: playlistId,
        trackId: asTrackId("track-1"),
      }),
      {
        type: "PLAYLIST_ADD_TRACK",
        id: playlistId,
        trackId: asTrackId("track-2"),
      },
    );
    const reordered = reducePlaylists(withTracks, {
      type: "PLAYLIST_REORDER_TRACK",
      id: playlistId,
      from: 1,
      to: 0,
    });
    const removed = reducePlaylists(reordered, {
      type: "PLAYLIST_REMOVE_TRACK",
      id: playlistId,
      trackId: asTrackId("track-1"),
    });

    expect(renamed.playlistsById[playlistId].name).toBe("Renamed");
    expect(withTracks.playlistsById[playlistId].trackIds).toEqual([
      asTrackId("track-1"),
      asTrackId("track-2"),
    ]);
    expect(reordered.playlistsById[playlistId].trackIds).toEqual([
      asTrackId("track-2"),
      asTrackId("track-1"),
    ]);
    expect(removed.playlistsById[playlistId].trackIds).toEqual([asTrackId("track-2")]);
  });
});
