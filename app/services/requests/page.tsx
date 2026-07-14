import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { SERVICE_CATEGORIES } from "@/types";
import { Wrench, Search, ArrowRight, Clock, MapPin, ChevronLeft, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Requests – Succevia Hub",
  description: "Browse open service requests from people who need tech support, repairs, design, tutoring, and more.",
};

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
}

function getCategoryIcon(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.icon ?? "🛠️";
}

// Extract image_urls from the name field (which stores JSON {n, i})
function getImageUrls(req: any): string[] {
  if (req.image_urls && Array.isArray(req.image_urls) && req.image_urls.length > 0) {
    return req.image_urls;
  }
  // Fallback: check if name field contains embedded JSON with image URLs
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (parsed.i && Array.isArray(parsed.i)) return parsed.i;
    } catch {}
  }
  return [];
}

function getUserName(req: any): string | null {
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (parsed.n) return parsed.n;
    } catch {}
  }
  // Legacy: return name directly if it's a plain string
  return req.name || null;
}

interface ServiceRequestsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ServiceRequestsPage({ searchParams }: ServiceRequestsPageProps) {
  const params = await searchParams;
  const categoryFilter = params?.category ?? "";
  const searchQuery = params?.q ?? "";

  let query = supabase
    .from("service_requests")
    .select("*", { count: "exact" })
    .eq("status", "open")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (categoryFilter) {
    query = query.eq("category", categoryFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().replace(/,/g, " ");
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: requests, error, count } = await query;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-10 right-10 w-60 h-60 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#25D366] rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2.5 bg-[#25D366] rounded-2xl shadow-lg shadow-green-500/30">
                <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Service Requests
              </h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Browse open service requests and offer your help. From tech support to home repairs, find people who need your services.
            </p>

            {/* Search */}
            <form method="GET" className="max-w-xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search service requests..."
                  className="w-full bg-white/95 backdrop-blur text-slate-800 placeholder-slate-400 rounded-2xl pl-12 pr-16 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 shadow-2xl transition-all"
                  aria-label="Search service requests"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-5 py-2 rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 min-h-[40px]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                href="/services/request"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-4 py-2 rounded-full text-sm transition-all shadow-lg"
              >
                <Wrench className="w-4 h-4" />
                Post a Request
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs text-slate-200 transition-all"
              >
                Browse Categories
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/services/requests"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !categoryFilter ? "bg-[#002147] text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            All
          </Link>
          {SERVICE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/services/requests?category=${cat.id}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === cat.id ? "bg-[#002147] text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.icon} {cat.label}
            </Link>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm animate-slide-down">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              Failed to load service requests. Please try again later.
            </div>
          </div>
        )}

        {!error && (!requests || requests.length === 0) ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <Wrench className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">No open requests</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              {searchQuery || categoryFilter
                ? "No requests match your search. Try different keywords or category."
                : "There are no service requests right now. Be the first to post one!"}
            </p>
            <Link
              href="/services/request"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              {searchQuery || categoryFilter ? "Post a Request" : "Be the First to Request"}
            </Link>
          </div>
        ) : requests && requests.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-4">
              <span className="font-bold text-[#002147]">{count ?? requests.length}</span> open request{(count ?? requests.length) !== 1 ? "s" : ""}
              {categoryFilter && <span> in <span className="font-semibold">{getCategoryLabel(categoryFilter)}</span></span>}
              {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {requests.map((req: any) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className="p-5">
                {/* Image */}
                {(() => { const urls = getImageUrls(req); return urls.length > 0 ? (
                  <div className="relative h-40 bg-slate-100 rounded-xl overflow-hidden mb-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urls[0]}
                      alt={req.title}
                      className="w-full h-full object-cover"
                    />
                    {urls.length > 1 && (
                      <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        +{urls.length - 1}
                      </span>
                    )}
                  </div>
                ) : null; })()}

                {/* Category badge */}
                <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold">
                        <span className="text-base">{getCategoryIcon(req.category)}</span>
                        {getCategoryLabel(req.category)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${URGENCY_COLORS[req.urgency] ?? "bg-slate-100 text-slate-600"}`}>
                        {req.urgency}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-bold text-[#002147] text-sm sm:text-base leading-tight line-clamp-2 mb-2">
                      {req.title}
                    </h2>

                    {/* Description */}
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 mb-4">
                      {req.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                      {req.budget && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#25D366]">{req.budget}</span>
                          <span className="text-slate-300">—</span>
                          <span>{req.service_mode === "online" ? "Online" : req.service_mode === "in_person" ? "In-Person" : "Online/In-Person"}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {req.county || req.city
                          ? [req.city, req.county].filter(Boolean).join(", ")
                          : req.country}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Contact button */}
                    <a
                      href={`https://wa.me/${req.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold text-sm py-2.5 rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-95"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Contact via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}