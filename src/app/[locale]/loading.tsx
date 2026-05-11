export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header card skeleton */}
      <div className="rounded-2xl bg-(--muted) p-6 mb-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20" />
          <div className="flex-1">
            <div className="h-5 bg-white/20 rounded w-1/2 mb-2" />
            <div className="h-3 bg-white/20 rounded w-3/4" />
          </div>
        </div>
      </div>

      {/* Form skeleton */}
      <div className="bg-(--card) border border-(--border) rounded-2xl p-6 space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-3 bg-(--muted) rounded w-28 mb-2" />
            <div className="h-10 bg-(--muted) rounded-lg w-full" />
          </div>
        ))}
        <div className="h-11 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl" />
      </div>

      {/* Result skeleton */}
      <div className="mt-4 bg-(--card) border border-(--border) rounded-2xl p-5 animate-pulse">
        <div className="h-3 bg-(--muted) rounded w-20 mb-3" />
        <div className="h-8 bg-(--muted) rounded w-1/3" />
      </div>
    </div>
  );
}
