export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-[#002147] to-[#003580] py-12 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="h-9 w-56 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="h-12 max-w-lg w-full bg-white/10 rounded-full mx-auto animate-pulse" />
        </div>
      </div>

      {/* Category tabs skeleton */}
      <div className="bg-white shadow-sm py-2 px-4">
        <div className="max-w-6xl mx-auto flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-4 w-32 bg-slate-200 rounded-full mb-5 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-slate-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-full animate-pulse w-4/5" />
                <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
