import { Skeleton } from "./ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div>
      <Skeleton className="h-71.75 w-full rounded-xl mb-2 animate-pulse bg-[#767676]" />
      <Skeleton className="h-4 w-full mb-2 bg-[#767676]" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-15 bg-[#767676]"/>
        <Skeleton className="h-3 w-15 bg-[#767676]"/>
      </div>
    </div>
  );
}
