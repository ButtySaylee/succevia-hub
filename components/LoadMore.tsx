"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoadMoreProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  category: string;
  searchQuery: string;
  statusFilter: string;
}

export default function LoadMore({
  currentPage,
  totalItems,
  itemsPerPage,
  category,
  searchQuery,
  statusFilter,
}: LoadMoreProps) {
  const router = useRouter();
  const hasMore = currentPage * itemsPerPage < totalItems;
  const itemsShown = Math.min(currentPage * itemsPerPage, totalItems);

  if (!hasMore) return null;

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams();
    params.set("page", nextPage.toString());
    if (category !== "All") params.set("category", category);
    if (searchQuery) params.set("q", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-slate-500 mb-4">
        Showing {itemsShown} of {totalItems} listings
      </p>
      <button
        onClick={handleLoadMore}
        className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-full shadow hover:bg-[#002147] hover:text-white transition-all"
      >
        <ChevronDown className="w-4 h-4" />
        Load More Items
      </button>
    </div>
  );
}
