import { CardSkeleton } from "@/components/feedback/CardSkeleton";

export default function SquadsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-24 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
