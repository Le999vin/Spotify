type Brand<Value, Name extends string> = Value & {
  readonly __brand: Name;
};

export type TrackId = Brand<string, "TrackId">;
export type AlbumId = Brand<string, "AlbumId">;
export type ArtistId = Brand<string, "ArtistId">;
export type PlaylistId = Brand<string, "PlaylistId">;
export type UserId = Brand<string, "UserId">;

export const asTrackId = (value: string) => value as TrackId;
export const asAlbumId = (value: string) => value as AlbumId;
export const asArtistId = (value: string) => value as ArtistId;
export const asPlaylistId = (value: string) => value as PlaylistId;
export const asUserId = (value: string) => value as UserId;
