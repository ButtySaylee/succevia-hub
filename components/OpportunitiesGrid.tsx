"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import OpportunityCard from "@/components/OpportunityCard";
import { SkeletonOpportunityGrid } from "@/components/SkeletonCard";
import { Opportunity } from "@/types";

interface OpportunitiesGridProps {
  initialOpportunities: Opportunity[];
  totalItems: number;
  itemsPerPage: number;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}

export default function OpportunitiesGrid({
  initialOpportunities,
  totalItems,
  itemsPerPage,
  searchQuery,
  currentPage,
  totalPages,
}: OpportunitiesGridProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setOpportunities(initialOpportunities);
    setInitialLoading(false);
    setError(null);
  }, [initialOpportunities, searchQuery]);

  const paginationPages = useMemo(() => {
    const pages = new Set<number>();
    pages.add(1);
    pages.add(totalPages);
    pages.add(currentPage);
    if (currentPage - 1 >= 1) pages.add(currentPage - 1);
    if (currentPage + 1 <= totalPages) pages.add(currentPage + 1);
    return Array.from(pages).filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  function isOpportunityNew(createdAt: string): boolean {
    return Date.now() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000; // 3 days
  }

  function buildPageHref(pageNumber: number) {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (pageNumber > 1) params.set("page", String(pageNumber));
    return `/opportunities${params.toString() ? `?${params.toString()}` : ""}`;
  }

  if (initialLoading) {
    return <SkeletonOpportunityGrid count={6} />;
  }

  if (error && opportunities.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Failed to load opportunities</h3>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
          className="inline-flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#003580] transition-colors"
        >
          <Loader2 className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger-animate">
        {opportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            isNew={isOpportunityNew(opp.created_at)}
          />
        ))}
      </div>

      {totalPages > 1 && opportunities.length > 0 && (
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-4">
          <p className="text-xs sm:text-sm text-slate-500">
            Showing page {currentPage} of {totalPages} · {opportunities.length} scholarships on this page · {totalItems} total
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Link
              href={buildPageHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                currentPage === 1
                  ? "pointer-events-none border-slate-200 text-slate-300 bg-white"
                  : "border-[#002147] text-[#002147] bg-white hover:bg-[#002147] hover:text-white"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Link>

            {paginationPages.map((pageNumber, index, array) => {
              const previousPage = array[index - 1];
              const gap = previousPage && pageNumber - previousPage > 1;
              return (
                <span key={pageNumber} className="flex items-center gap-2">
                  {gap && <span className="text-slate-400 text-sm">...</span>}
                  <Link
                    href={buildPageHref(pageNumber)}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    className={`min-w-10 h-10 px-3 rounded-full border text-sm font-semibold inline-flex items-center justify-center transition-all ${
                      pageNumber === currentPage
                        ? "bg-[#002147] text-white border-[#002147]"
                        : "bg-white text-[#002147] border-slate-200 hover:border-[#002147] hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                </span>
              );
            })}

            <Link
              href={buildPageHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                currentPage === totalPages
                  ? "pointer-events-none border-slate-200 text-slate-300 bg-white"
                  : "border-[#002147] text-[#002147] bg-white hover:bg-[#002147] hover:text-white"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}