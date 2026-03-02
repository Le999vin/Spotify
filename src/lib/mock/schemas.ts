import { z } from "zod";

export const trackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artistId: z.string(),
  albumId: z.string(),
  durationMs: z.number().int().positive(),
  coverUrl: z.string(),
  audioUrl: z.string().nullable(),
  tags: z.array(z.string()),
  bpm: z.number().int().positive().optional(),
  key: z.string().optional(),
});

export const albumSchema = z.object({
  id: z.string(),
  title: z.string(),
  artistId: z.string(),
  year: z.number().int(),
  trackIds: z.array(z.string()),
  coverUrl: z.string().optional(),
});

export const artistSchema = z.object({
  id: z.string(),
  name: z.string(),
  coverUrl: z.string().optional(),
  bio: z.string().optional(),
});

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerName: z.string(),
  trackIds: z.array(z.string()),
  coverUrl: z.string().optional(),
});

export const genreCollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  gradient: z.string(),
});
