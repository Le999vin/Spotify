"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlaybackStore } from "@/store/playbackStore";

export default function SettingsPage() {
  const playbackState = usePlaybackStore((store) => store.state);
  const dispatch = usePlaybackStore((store) => store.dispatch);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Settings
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Playback preferences</h1>
      </div>

      <section className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6">
        <h2 className="font-display text-2xl font-semibold">Audio defaults</h2>
        <div className="mt-6 space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>Default volume</span>
              <span className="text-[var(--muted-foreground)]">
                {Math.round(playbackState.volume * 100)}%
              </span>
            </div>
            <Slider
              aria-label="Default volume"
              value={[playbackState.volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) =>
                dispatch({ type: "SET_VOLUME", value: value / 100 })
              }
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["off", "all", "one"] as const).map((mode) => (
              <Button
                key={mode}
                variant={playbackState.repeat === mode ? "default" : "secondary"}
                onClick={() => dispatch({ type: "SET_REPEAT", mode })}
              >
                Repeat {mode}
              </Button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="font-medium">Reduced motion</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Placeholder setting for future animation preferences. Current build keeps the default
              motion profile enabled.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/8 bg-white/4 p-6">
        <h2 className="font-display text-2xl font-semibold">About Pulsefy</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
          Pulsefy mirrors familiar music UX patterns while keeping its own name, palette, and
          placeholder artwork. The current frontend runs entirely against local mock data and a
          functional-core playback model.
        </p>
      </section>
    </div>
  );
}
