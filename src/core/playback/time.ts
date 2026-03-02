import { clamp } from "@/lib/utils";

export function clampProgress(progressMs: number, durationMs: number) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return Math.max(0, Math.round(progressMs));
  }

  return clamp(Math.round(progressMs), 0, Math.round(durationMs));
}

export function formatDuration(ms: number) {
  const safe = Math.max(0, Math.floor(ms));
  const minutes = Math.floor(safe / 60000);
  const seconds = Math.floor((safe % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function isNearTrackStart(progressMs: number, thresholdMs = 3000) {
  return Math.max(0, progressMs) <= thresholdMs;
}
