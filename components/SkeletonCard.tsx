export function SkeletonImage() {
  return <div className="skeleton-image rounded-none" />;
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton-line ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card animate-fade-in">
      <SkeletonImage />
      <div className="p-4 space-y-3">
        <SkeletonLine className="w-3/4 skeleton-line-lg" />
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <SkeletonLine className="w-20 skeleton-line-lg" />
          <SkeletonLine className="w-16 skeleton-line-sm" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-animate">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonOpportunityCard() {
  return (
    <div className="skeleton-card animate-fade-in">
      <SkeletonImage />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <SkeletonLine className="w-16 skeleton-line-sm" />
          <SkeletonLine className="w-12 skeleton-line-sm" />
        </div>
        <SkeletonLine className="w-full skeleton-line-lg" />
        <SkeletonLine className="w-3/4" />
        <SkeletonLine className="w-full" />
        <div className="flex items-center gap-4 pt-2">
          <SkeletonLine className="w-24" />
          <SkeletonLine className="w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonOpportunityGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-animate">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonOpportunityCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDashboardStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8 stagger-animate">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4 space-y-2">
          <div className="skeleton-line w-6 h-6 rounded-lg mx-auto" />
          <SkeletonLine className="w-12 skeleton-line-xl mx-auto" />
          <SkeletonLine className="w-16 skeleton-line-sm mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonListingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 animate-fade-in">
      <SkeletonImage />
      <div className="p-4 space-y-3">
        <SkeletonLine className="w-3/4 skeleton-line-lg" />
        <SkeletonLine className="w-full" />
        <div className="flex gap-2 pt-2">
          <SkeletonLine className="flex-1 skeleton-line-lg" />
          <SkeletonLine className="w-12 skeleton-line-lg" />
          <SkeletonLine className="w-12 skeleton-line-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-animate">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonListingCard key={i} />
      ))}
    </div>
  );
}