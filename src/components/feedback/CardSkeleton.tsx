export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="h-4 w-16 bg-gray-100 rounded-full mb-2" />
          <div className="h-5 w-3/4 bg-gray-100 rounded mb-1" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <div className="h-4 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}
