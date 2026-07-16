import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ServiceRequestCard from "@/components/ServiceRequestCard";
import { SERVICE_CATEGORIES } from "@/types";
import { Wrench, Search, ArrowRight, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Service Requests – Succevia Hub",
  description: "Browse open service requests from people who need tech support, repairs, design, tutoring, and more.",
};

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
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
                <ServiceRequestCard key={req.id} request={req} />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}