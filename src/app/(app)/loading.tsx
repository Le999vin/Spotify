import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-[2rem]" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="aspect-square rounded-[1.75rem]" />
        <Skeleton className="aspect-square rounded-[1.75rem]" />
        <Skeleton className="aspect-square rounded-[1.75rem]" />
      </div>
      <Skeleton className="h-80 rounded-[1.75rem]" />
    </div>
  );
}
