"use client";

import { ArrowUpDown } from "lucide-react";

interface MarketplaceSortProps {
  selectedCategory: string;
  searchQuery: string;
  statusFilter: string;
  selectedCountry: string;
  sortBy: string;
}

export default function MarketplaceSort({
  selectedCategory,
  searchQuery,
  statusFilter,
  selectedCountry,
  sortBy,
}: MarketplaceSortProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
      <ArrowUpDown className="w-4 h-4" />
      <select
        className="bg-transparent text-sm font-semibold focus:outline-none"
        defaultValue={sortBy}
        onChange={(e) => {
          const params = new URLSearchParams();
          if (selectedCategory !== "All") params.set("category", selectedCategory);
          if (searchQuery) params.set("q", searchQuery);
          if (statusFilter !== "all") params.set("status", statusFilter);
          if (selectedCountry !== "All") params.set("country", selectedCountry);
          if (e.target.value !== "newest") params.set("sort", e.target.value);
          window.location.href = `/marketplace?${params.toString()}`;
        }}
        aria-label="Sort listings"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
      </select>
    </div>
  );
}