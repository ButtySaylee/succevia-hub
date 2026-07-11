export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-[#002147] to-[#003580] py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="h-8 w-40 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="h-4 w-64 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="h-12 max-w-xl w-full bg-white/10 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-4 w-24 bg-slate-200 rounded-full mb-5 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden p-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full animate-pulse w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded-full animate-pulse" />
              <div className="h-3 bg-slate-100 rounded-full animate-pulse w-2/3" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}