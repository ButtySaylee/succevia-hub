"use client";

import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import { Listing } from "@/types";

interface ListingsGridProps {
  initialListings: Listing[];
  totalItems: number;
  itemsPerPage: number;
  category: string;
  searchQuery: string;
  statusFilter: string;
  country: string;
}

export default function ListingsGrid({
  initialListings,
  totalItems,
  itemsPerPage,
  category,
  searchQuery,
  statusFilter,
  country,
}: ListingsGridProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = listings.length < totalItems;

  function isListingNew(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
  }

  async function loadMore() {
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams();
    params.set("page", nextPage.toString());
    if (category !== "All") params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (country !== "All") params.set("country", country);

    try {
      const res = await fetch(`/api/listings/paginate?${params}`);
      const data = (await res.json()) as { listings: Listing[] };
      // Append new items — never replace existing ones
      setListings((prev) => [...prev, ...data.listings]);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {listings.map((listing) => (
          <ItemCard key={listing.id} listing={listing} isNew={isListingNew(listing.created_at)} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Showing {listings.length} of {totalItems} listings
          </p>
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-full shadow hover:bg-[#002147] hover:text-white transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Load More Items
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
