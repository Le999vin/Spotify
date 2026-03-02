"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play } from "lucide-react";

import { selectQueueView } from "@/core/playback/selectors";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistsById, tracksById } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { usePlaybackStore } from "@/store/playbackStore";

type QueuePanelProps = {
  compact?: boolean;
};

function SortableQueueItem({
  id,
  offset,
}: {
  id: string;
  offset: number;
}) {
  const track = tracksById[id];
  const dispatch = usePlaybackStore((store) => store.dispatch);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  if (!track) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/5",
        isDragging && "bg-white/8 shadow-xl",
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        onClick={() => dispatch({ type: "PLAY_TRACK", trackId: track.id })}
      >
        <div
          className="h-12 w-12 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url(${track.coverUrl})` }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{track.title}</p>
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {artistsById[track.artistId]?.name}
          </p>
        </div>
      </button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Reorder queued track"
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(event) => event.preventDefault()}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>
      <button
        type="button"
        className="sr-only"
        onClick={() =>
          dispatch({
            type: "QUEUE_REORDER",
            fromIndex: offset,
            toIndex: offset,
          })
        }
      />
    </div>
  );
}

export function QueuePanel({ compact = false }: QueuePanelProps) {
  const playbackState = usePlaybackStore((store) => store.state);
  const dispatch = usePlaybackStore((store) => store.dispatch);
  const queueView = selectQueueView(playbackState, tracksById);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const activeIds = queueView.upNext.map((track) => track.id);
  const baseOffset = queueView.previous.length + (queueView.current ? 1 : 0);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const fromIndex = activeIds.findIndex((id) => id === active.id);
    const toIndex = activeIds.findIndex((id) => id === over.id);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    dispatch({
      type: "QUEUE_REORDER",
      fromIndex: baseOffset + fromIndex,
      toIndex: baseOffset + toIndex,
    });
  };

  if (!queueView.current && !queueView.upNext.length) {
    return (
      <div className="flex h-full min-h-[18rem] items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-xl font-semibold">Queue is empty</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Start a playlist or track from Home, Search, or your Library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", compact ? "max-h-[calc(100vh-7rem)]" : "max-h-[36rem]")}>
      <div className="space-y-6 px-5 py-5">
        {queueView.current ? (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Now Playing
            </p>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-3xl border border-white/8 bg-white/4 p-3 text-left transition-colors hover:bg-white/6"
              onClick={() => dispatch({ type: "PLAY_TRACK", trackId: queueView.current!.id })}
            >
              <div
                className="h-16 w-16 rounded-3xl bg-cover bg-center"
                style={{ backgroundImage: `url(${queueView.current.coverUrl})` }}
              />
              <div className="min-w-0">
                <p className="truncate font-semibold">{queueView.current.title}</p>
                <p className="truncate text-sm text-[var(--muted-foreground)]">
                  {artistsById[queueView.current.artistId]?.name}
                </p>
              </div>
              <Play className="ml-auto h-4 w-4 text-[var(--accent-strong)]" />
            </button>
          </section>
        ) : null}

        {queueView.previous.length ? (
          <section>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Previously Played
            </p>
            <div className="space-y-2">
              {queueView.previous.slice(-3).map((track) => (
                <div key={track.id} className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm">
                  <div
                    className="h-10 w-10 rounded-2xl bg-cover bg-center opacity-70"
                    style={{ backgroundImage: `url(${track.coverUrl})` }}
                  />
                  <div className="min-w-0 opacity-70">
                    <p className="truncate">{track.title}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {artistsById[track.artistId]?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Up Next
          </p>
          {queueView.upNext.length ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={activeIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {activeIds.map((id, index) => (
                    <div key={id} className="group">
                      <SortableQueueItem id={id} offset={baseOffset + index} />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">
              Nothing queued after this track yet.
            </p>
          )}
        </section>
      </div>
    </ScrollArea>
  );
}
