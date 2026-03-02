export function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded mb-6" />
      <div className="mb-6">
        <div className="flex gap-2 mb-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="h-7 w-2/3 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="h-20 bg-gray-100 rounded-xl" />
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-40 bg-gray-100 rounded-xl mb-6" />
      <div className="h-48 bg-gray-100 rounded-xl" />
    </div>
  );
}
