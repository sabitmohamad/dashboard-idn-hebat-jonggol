import { GlassCard } from "./GlassCard";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <GlassCard key={i} className="!p-4">
            <div className="skeleton-shimmer h-3 w-24 rounded" />
            <div className="skeleton-shimmer mt-4 h-8 w-16 rounded" />
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <GlassCard className="xl:col-span-3">
          <div className="flex flex-col items-center py-10">
            <div className="skeleton-shimmer h-28 w-28 rounded-full" />
            <div className="skeleton-shimmer mt-5 h-5 w-36 rounded" />
            <div className="skeleton-shimmer mt-2 h-3 w-28 rounded" />
            <div className="skeleton-shimmer mt-6 h-16 w-40 rounded-2xl" />
          </div>
        </GlassCard>

        <GlassCard className="xl:col-span-5">
          <div className="skeleton-shimmer mb-4 h-4 w-40 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-12 w-full rounded-xl" />
            ))}
          </div>
        </GlassCard>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <GlassCard>
            <div className="skeleton-shimmer mb-4 h-4 w-32 rounded" />
            <div className="flex items-center gap-4">
              <div className="skeleton-shimmer h-36 w-36 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton-shimmer h-8 w-full rounded" />
                <div className="skeleton-shimmer h-8 w-full rounded" />
                <div className="skeleton-shimmer h-8 w-full rounded" />
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="skeleton-shimmer mb-4 h-4 w-32 rounded" />
            <div className="space-y-2">
              <div className="skeleton-shimmer h-16 w-full rounded-xl" />
              <div className="skeleton-shimmer h-16 w-full rounded-xl" />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
