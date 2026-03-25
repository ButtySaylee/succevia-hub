import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ListingsGrid from "@/components/ListingsGrid";
import CountryFilter from "@/components/CountryFilter";
import { Listing, CATEGORIES, CATEGORY_ICONS, GLOBAL_COUNTRIES } from "@/types";
import { ShoppingBag, Search, Plus } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ category?: string; q?: string; status?: string; country?: string }>;
}

export const metadata: Metadata = {
  title: "Succevia Hub – Global Jobs, Scholarships & Marketplace",
  description:
    "The world's trusted hub for jobs, scholarships, and buying & selling items safely via WhatsApp.",
  keywords: [
    "succevia hub",
    "global jobs",
    "international scholarships",
    "online marketplace",
    "buy and sell worldwide",
    "global marketplace",
    "international trading",
    "classified ads",
    "worldwide commerce",
    "global e-commerce",
  ],
  alternates: {
    canonical: "https://succeviahub.vercel.app",
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category ?? "All";
  const searchQuery = params?.q ?? "";
  const statusFilter = params?.status === "available" ? "available" : "all";
  const selectedCountry = params?.country ?? "All";
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

  if (selectedCategory !== "All") {
    query = query.eq("category", selectedCategory);
  }

  if (selectedCountry !== "All") {
    query = query.eq("location", selectedCountry);
  }

  if (statusFilter === "available") {
    query = query.eq("is_sold", false);
  }

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
      <section className="bg-gradient-to-br from-[#002147] via-[#003580] to-[#0066cc] text-white py-16 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-[#25D366] rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-20 left-1/3 w-60 h-60 bg-blue-400 rounded-full mix-blend-overlay filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-[#25D366] rounded-full animate-bounce">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent">
              Succevia Hub
            </h1>
          </div>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {"The world's trusted hub for jobs, scholarships, and buying & selling items safely via WhatsApp."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a
              href="#listings"
              className="group inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-8 py-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-green-500/30 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
              Shop Worldwide
              <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </a>
            <a
              href="/sell"
              className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 border border-white/20 active:scale-95"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Sell Globally
              <div className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </a>
          </div>

          {/* Enhanced Search */}
          <form method="GET" className="max-w-2xl mx-auto relative group">
            <input type="hidden" name="category" value={selectedCategory} />
            <input type="hidden" name="status" value={statusFilter} />
            <input type="hidden" name="country" value={selectedCountry} />
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search listings worldwide..."
                className="w-full pl-6 pr-16 py-4 rounded-2xl bg-white/95 backdrop-blur text-slate-800 text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 placeholder:text-slate-500 transition-all duration-300 group-hover:shadow-green-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#25D366] hover:bg-[#1da851] p-3 rounded-xl text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Stats or Features */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#25D366]">180+</div>
              <div className="text-slate-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#25D366]">Safe</div>
              <div className="text-slate-300">Trading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#25D366]">24/7</div>
              <div className="text-slate-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white shadow-lg sticky top-[65px] z-40 border-b border-slate-100 relative">
        {/* Left fade indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none md:hidden"></div>

        {/* Right fade indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none md:hidden"></div>

        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto scroll-snap-x scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={
                  searchQuery || selectedCountry !== "All"
                    ? `/?category=${cat}&q=${encodeURIComponent(searchQuery)}&status=${statusFilter}&country=${selectedCountry}`
                    : `/?category=${cat}&status=${statusFilter}`
                }
                className={`${
                  selectedCategory === cat
                    ? "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap bg-gradient-to-r from-[#002147] to-[#003580] text-white shadow-lg transform hover:scale-105 transition-all duration-200 scroll-snap-center touch-feedback min-h-[44px]"
                    : "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all duration-200 hover:scale-105 hover:shadow-md scroll-snap-center touch-feedback min-h-[44px]"
                }`}
              >
                <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section id="listings" className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
            Error loading listings. Please try again later.
          </div>
        )}

        {/* Filter bar — always visible so users can always switch back to All */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter:
            </span>
            <div className="flex items-center rounded-full bg-slate-50 p-1 border border-slate-200">
              <a
                href={`/?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&country=${selectedCountry}`}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  statusFilter === "all"
                    ? "bg-gradient-to-r from-[#002147] to-[#003580] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white"
                }`}
              >
                All Items
              </a>
              <a
                href={`/?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&status=available&country=${selectedCountry}`}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  statusFilter === "available"
                    ? "bg-gradient-to-r from-[#25D366] to-[#1da851] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-800 hover:bg-white"
                }`}
              >
                Available Only
              </a>
            </div>

            {/* Country Filter */}
            <CountryFilter
              selectedCountry={selectedCountry}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
            />
          </div>
          <a
            href="/sell"
            className="flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:text-[#1da851] transition-all duration-200 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full"
          >
            <Plus className="w-4 h-4" />
            Sell an item
          </a>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="relative mb-8">
              <div className="text-8xl mb-4 animate-bounce">🌍</div>
              <div className="absolute -top-2 -right-8 text-4xl animate-spin-slow">✨</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3 bg-gradient-to-r from-[#002147] to-[#003580] bg-clip-text text-transparent">
              No listings found
            </h2>
            <p className="text-slate-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term or browse all categories.`
                : statusFilter === "available"
                ? "No available items right now. Switch to \"All Items\" above to see sold items too."
                : "Be the first to list an item in this category and reach buyers worldwide!"}
            </p>
            <a
              href="/sell"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Post Your First Listing
            </a>
          </div>
        ) : (
          <>
            <p className="text-slate-600 font-medium text-sm mb-5">
              <span className="font-bold text-[#002147]">{count ?? filtered.length}</span>{" "}
              listing{(count ?? filtered.length) !== 1 ? "s" : ""}{" "}
              {selectedCategory !== "All"
                ? `in ${selectedCategory}`
                : statusFilter === "available"
                ? "available"
                : "listed"}
              {selectedCountry !== "All" && (
                <span className="ml-1 text-slate-400">
                  from {selectedCountry}
                </span>
              )}
              {searchQuery && (
                <span className="ml-1 text-slate-400">
                  for &ldquo;{searchQuery}&rdquo;
                </span>
              )}
            </p>

            <ListingsGrid
              initialListings={filtered}
              totalItems={count ?? 0}
              itemsPerPage={itemsPerPage}
              category={selectedCategory}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              country={selectedCountry}
            />
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#002147] text-slate-400 text-center text-xs py-6 mt-10">
        <p>© {new Date().getFullYear()} Succevia Hub · Global Marketplace 🌍</p>
        <p className="mt-1">Connecting the world through commerce</p>
        <p className="mt-2 text-slate-500">
          Owned & developed by{" "}
          <a
            href="https://butty-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] font-semibold hover:underline"
          >
            Butty Saylee
          </a>
        </p>
      </footer>
    </main>
  );
}
