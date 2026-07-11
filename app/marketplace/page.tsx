import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ListingsGrid from "@/components/ListingsGrid";
import CountryFilter from "@/components/CountryFilter";
import MarketplaceSort from "@/components/MarketplaceSort";
import { Listing } from "@/types";
import { ShoppingBag, Search, Plus, SlidersHorizontal } from "lucide-react";

interface MarketplacePageProps {
  searchParams: Promise<{ category?: string; q?: string; status?: string; country?: string; sort?: string }>;
}

export const metadata: Metadata = {
  title: "Marketplace – Buy & Sell in Liberia | Succevia Hub",
  description:
    "Liberia's trusted marketplace. Buy and sell phones, laptops, vehicles, fashion, electronics, and more safely via WhatsApp.",
  keywords: [
    "liberia marketplace", "buy and sell liberia", "monrovia marketplace",
    "liberia classifieds", "sell online liberia", "liberia shopping",
  ],
  alternates: {
    canonical: "https://succeviahub.vercel.app/marketplace",
  },
  openGraph: {
    title: "Marketplace – Succevia Hub",
    description: "Buy and sell products safely via WhatsApp in Liberia.",
    url: "https://succeviahub.vercel.app/marketplace",
    siteName: "Succevia Hub",
    type: "website",
  },
};

const MARKETPLACE_CATEGORIES = [
  "All", "Phones", "Laptops", "Electronics", "Vehicles", "Motorcycles",
  "Furniture", "Fashion", "Property", "Agriculture", "Books",
  "Home Appliances", "Other",
];

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "🛍️", Phones: "📱", Laptops: "💻", Electronics: "⚡",
  Vehicles: "🚗", Motorcycles: "🏍️", Furniture: "🪑", Fashion: "👗",
  Property: "🏠", Agriculture: "🌾", Books: "📚", "Home Appliances": "🏡", Other: "📦",
};

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category ?? "All";
  const searchQuery = params?.q ?? "";
  const statusFilter = params?.status === "available" ? "available" : "all";
  const selectedCountry = params?.country ?? "All";
  const sortBy = params?.sort ?? "newest";
  const itemsPerPage = 30;

  let query = supabase
    .from("listings")
    .select(
      "id, created_at, title, description, price, category, image_urls, seller_whatsapp, is_approved, is_negotiable, location, is_sold",
      { count: "exact" }
    )
    .eq("is_approved", true)
    .order("is_sold", { ascending: true })
    .order("created_at", { ascending: false })
    .range(0, itemsPerPage - 1);

  if (selectedCategory !== "All") query = query.eq("category", selectedCategory);
  if (selectedCountry !== "All") query = query.eq("location", selectedCountry);
  if (statusFilter === "available") query = query.eq("is_sold", false);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().replace(/,/g, " ");
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  const { data: listings, error, count } = await query;
  const filtered: Listing[] = (listings ?? []) as Listing[];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#002147] via-[#003580] to-[#0066cc] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-[#25D366] rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4 text-xs text-slate-200">
              <ShoppingBag className="w-3.5 h-3.5 text-[#25D366]" />
              Global Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-balance mb-3">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                Buy & Sell With Confidence
              </span>
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed px-4">
              Browse products from sellers worldwide. Connect directly via WhatsApp. Safe, easy, and free to list.
            </p>

            {/* Search */}
            <form method="GET" className="max-w-2xl mx-auto relative px-4 mb-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search phones, laptops, vehicles, and more..."
                  className="w-full pl-12 pr-16 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-slate-800 text-sm sm:text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 placeholder:text-slate-400 transition-all"
                  aria-label="Search marketplace"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#25D366] hover:bg-[#1da851] p-2.5 rounded-xl text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                {count ?? 0} listings
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                {filtered.filter(l => !l.is_sold).length} available
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                WhatsApp safe
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Category Filters */}
      <section className="bg-white shadow-sm sticky top-[57px] md:top-[60px] z-40 border-b border-slate-100">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden" />

        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto scroll-snap-x scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`/marketplace?category=${cat}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}&status=${statusFilter}${selectedCountry !== "All" ? `&country=${selectedCountry}` : ""}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 scroll-snap-center touch-feedback min-h-[40px] ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#002147] to-[#003580] text-white shadow-md"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
                aria-current={selectedCategory === cat ? "page" : undefined}
              >
                <span className="text-base">{CATEGORY_EMOJIS[cat] || "📦"}</span>
                <span className="text-xs sm:text-sm">{cat}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm animate-slide-down">
            Error loading listings. Please try again later.
          </div>
        )}

        {/* Filter & Sort Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-100 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
              <SlidersHorizontal className="w-4 h-4" />
              Filter:
            </div>
            <div className="flex items-center rounded-lg bg-slate-50 p-0.5 border border-slate-200">
              <a
                href={`/marketplace?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&country=${selectedCountry}`}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                  statusFilter === "all" ? "bg-[#002147] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                All Items
              </a>
              <a
                href={`/marketplace?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&status=available&country=${selectedCountry}`}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                  statusFilter === "available" ? "bg-[#25D366] text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                Available
              </a>
            </div>
            <CountryFilter
              selectedCountry={selectedCountry}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          </div>

          <div className="flex items-center gap-3">
            <MarketplaceSort
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              selectedCountry={selectedCountry}
              sortBy={sortBy}
            />
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#25D366] hover:text-[#1da851] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-100 transition-all whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Sell
            </Link>
          </div>
        </div>

        {/* Results count */}
        <p className="text-slate-500 text-xs sm:text-sm mb-4">
          <span className="font-bold text-[#002147]">{count ?? filtered.length}</span> listing{(count ?? filtered.length) !== 1 ? "s" : ""}
          {selectedCategory !== "All" && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
          {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
          {selectedCountry !== "All" && <span> from {selectedCountry}</span>}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <ShoppingBag className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">No listings found</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto px-4">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term or browse all categories.`
                : statusFilter === "available"
                ? 'No available items right now. Switch to "All Items" above to see sold items too.'
                : "Be the first to list an item. Reach buyers worldwide!"}
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              {searchQuery ? "Post a Listing" : "Be the First to Sell"}
            </Link>
          </div>
        ) : (
          <ListingsGrid
            initialListings={filtered}
            totalItems={count ?? 0}
            itemsPerPage={itemsPerPage}
            category={selectedCategory}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            country={selectedCountry}
          />
        )}
      </section>
    </main>
  );
}