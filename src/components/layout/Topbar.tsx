"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, PanelRightOpen, PanelRightClose } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TopbarProps = {
  isQueueOpen: boolean;
  onToggleQueue: () => void;
};

export function Topbar({ isQueueOpen, onToggleQueue }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = pathname === "/search";
  const query = searchParams.get("q") ?? "";
  const [value, setValue] = useState(query);

  useEffect(() => {
    setValue(query);
  }, [query]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[var(--background-overlay)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Go forward"
            onClick={() => router.forward()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-w-0 flex-1">
          {isSearchPage ? (
            <Input
              aria-label="Search music"
              value={value}
              placeholder="Search tracks, playlists, artists"
              className="max-w-xl"
              onChange={(event) => {
                const nextValue = event.target.value;
                setValue(nextValue);

                startTransition(() => {
                  const nextParams = new URLSearchParams(searchParams.toString());

                  if (nextValue.trim()) {
                    nextParams.set("q", nextValue);
                  } else {
                    nextParams.delete("q");
                  }

                  const nextQuery = nextParams.toString();
                  router.replace(nextQuery ? `/search?${nextQuery}` : "/search");
                });
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="md:hidden"
                aria-label="Open search"
                onClick={() => router.push("/search")}
              >
                <Search className="h-4 w-4" />
              </Button>
              <div className="hidden md:block">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
                >
                  <Search className="h-4 w-4" />
                  Quick search
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label={isQueueOpen ? "Hide queue" : "Show queue"}
            className="hidden xl:inline-flex"
            onClick={onToggleQueue}
          >
            {isQueueOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
          <Link
            href="/settings"
            className={cn(
              "hidden rounded-full border border-white/8 bg-white/4 px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)] md:inline-flex",
              pathname === "/settings" && "text-[var(--foreground)]",
            )}
          >
            Settings
          </Link>
        </div>
      </div>
    </header>
  );
}
