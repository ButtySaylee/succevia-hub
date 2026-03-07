import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import LoadMore from "@/components/LoadMore";
import { Listing, CATEGORIES, CATEGORY_ICONS } from "@/types";
import { ShoppingBag, Search, Plus } from "lucide-react";

interface HomePageProps {
  searchParams: Promise<{ category?: string; q?: string; status?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "GbanaMarket – Buy and Sell Products Online",
  description:
    "GbanaMarket is an online marketplace where users can buy and sell products easily. Shop trusted sellers in Liberia.",
  keywords: [
    "gbanamarket",
    "online marketplace",
    "buy and sell",
    "liberia marketplace",
    "monrovia shopping",
    "classified ads",
  ],
  alternates: {
    canonical: "https://gbanamarket.vercel.app",
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const selectedCategory = params?.category ?? "All";
  const searchQuery = params?.q ?? "";
  const statusFilter = params?.status === "available" ? "available" : "all";
  const parsedPage = Number.parseInt(params?.page ?? "1", 10);
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const itemsPerPage = 30;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage - 1;

  let query = supabase
    .from("listings")
    .select(
      "id, created_at, title, description, price, category, image_urls, seller_whatsapp, is_approved, is_negotiable, location, is_sold",
      { count: "exact" }
    )
    .eq("is_approved", true)
    .order("is_sold", { ascending: true })
    .order("created_at", { ascending: false })
    .range(startIndex, endIndex);

  if (selectedCategory !== "All") {
    query = query.eq("category", selectedCategory);
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
      <section className="bg-gradient-to-br from-[#002147] to-[#003580] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingBag className="w-8 h-8 text-[#25D366]" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Gbana Market
            </h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6">
            {"Liberia's trusted marketplace. Buy and sell used & new items safely via WhatsApp."}
          </p>

          {/* Search — hidden input preserves the active category */}
          <form method="GET" className="max-w-lg mx-auto relative">
            <input type="hidden" name="category" value={selectedCategory} />
            <input type="hidden" name="status" value={statusFilter} />
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search listings..."
              className="w-full pl-5 pr-14 py-3 rounded-full bg-white text-slate-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#25D366] p-2 rounded-full text-white"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white shadow-sm sticky top-[65px] z-40 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={
                searchQuery
                  ? `/?category=${cat}&q=${encodeURIComponent(searchQuery)}&status=${statusFilter}`
                  : `/?category=${cat}&status=${statusFilter}`
              }
              className={
                selectedCategory === cat
                  ? "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-[#002147] text-white shadow"
                  : "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              }
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Listings Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
            Error loading listings. Please try again later.
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No listings found
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : "Be the first to list an item in this category!"}
            </p>
            <a
              href="/sell"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#1da851] transition-all"
            >
              <Plus className="w-4 h-4" />
              Post a Listing
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <p className="text-slate-600 font-medium text-sm">
                  <span className="font-bold text-[#002147]">{count ?? filtered.length}</span>{" "}
                  listing{(count ?? filtered.length) !== 1 ? "s" : ""}{" "}
                  {selectedCategory !== "All"
                    ? `in ${selectedCategory}`
                    : statusFilter === "available"
                    ? "available"
                    : "listed"}
                  {searchQuery && (
                    <span className="ml-1 text-slate-400">
                      for &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </p>
                <div className="flex items-center rounded-full bg-slate-100 p-1">
                  <a
                    href={`/?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&status=all`}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      statusFilter === "all"
                        ? "bg-[#002147] text-white"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    All
                  </a>
                  <a
                    href={`/?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}&status=available`}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                      statusFilter === "available"
                        ? "bg-[#002147] text-white"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Available
                  </a>
                </div>
              </div>
              <a
                href="/sell"
                className="flex items-center gap-1 text-xs font-semibold text-[#25D366] hover:text-[#1da851] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Sell an item
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((listing) => (
                <ItemCard key={listing.id} listing={listing} />
              ))}
            </div>

              <LoadMore
                currentPage={currentPage}
                totalItems={count ?? 0}
                itemsPerPage={itemsPerPage}
                category={selectedCategory}
                searchQuery={searchQuery}
                statusFilter={statusFilter}
              />
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#002147] text-slate-400 text-center text-xs py-6 mt-10">
        <p>© {new Date().getFullYear()} Gbana Market · Monrovia, Liberia 🇱🇷</p>
        <p className="mt-1">Built with trust for the Liberian community</p>
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
