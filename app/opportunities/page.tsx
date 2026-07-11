import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import OpportunitiesGrid from "@/components/OpportunitiesGrid";
import { Opportunity } from "@/types";
import { GraduationCap, Search, Sparkles, ArrowRight } from "lucide-react";

interface OpportunitiesPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "Scholarships – Succevia Hub",
  description:
    "Discover scholarship opportunities for bachelor's, master's, PhD, and training programs worldwide. Apply today and fund your education.",
  keywords: [
    "scholarships liberia",
    "international scholarships",
    "study abroad scholarships",
    "fully funded scholarships",
    "bachelor scholarships",
    "masters scholarships",
    "phd scholarships",
    "liberia scholarship",
  ],
  alternates: {
    canonical: "https://succeviahub.vercel.app/opportunities",
  },
  openGraph: {
    title: "Scholarships – Succevia Hub",
    description: "Discover scholarship opportunities worldwide. Apply today and fund your education.",
    url: "https://succeviahub.vercel.app/opportunities",
    siteName: "Succevia Hub",
    type: "website",
    locale: "en_US",
  },
};

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q ?? "";
  const currentPage = Math.max(1, Number(params?.page ?? "1"));
  const itemsPerPage = 12;

  const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function parseDeadlineMonth(deadline: string | undefined): number {
    if (!deadline) return 13;
    const month = MONTH_ORDER.find(m => deadline.includes(m));
    return month ? MONTH_ORDER.indexOf(month) : 13;
  }

  const baseSelectFields =
    "id, created_at, title, description, type, organization, location, deadline, requirements, application_url, image_url, is_active";

  const selectFields = (includeVisibility: boolean) =>
    includeVisibility ? `${baseSelectFields}, is_visible` : baseSelectFields;

  async function fetchScholarships(includeVisibility: boolean) {
    let query = supabaseAdmin
      .from("opportunities")
      .select(selectFields(includeVisibility), { count: "exact" })
      .eq("is_active", true)
      .eq("type", "scholarship");

    if (includeVisibility) {
      query = query.eq("is_visible", true);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().replace(/,/g, " ");
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,organization.ilike.%${q}%`);
    }

    return query;
  }

  let { data, count, error } = await fetchScholarships(true);

  if (error && /is_visible/i.test(error.message)) {
    const fallback = await fetchScholarships(false);
    data = fallback.data;
    count = fallback.count;
    error = fallback.error;
  }

  if (error) {
    console.error("[opportunities/page] Failed to fetch scholarships:", error.message);
  }

  let opportunities = ((data ?? []) as unknown as Opportunity[]).map((opportunity) => ({
    ...opportunity,
    is_visible: opportunity.is_visible ?? true,
  }));
  const totalCount = count ?? opportunities.length;

  opportunities = opportunities.sort((a, b) => {
    const monthA = parseDeadlineMonth(a.deadline);
    const monthB = parseDeadlineMonth(b.deadline);
    if (monthA !== monthB) return monthA - monthB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const pageIndex = Math.min(currentPage, totalPages);
  const start = (pageIndex - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  opportunities = opportunities.slice(start, end);

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
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Scholarships
              </h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Discover scholarships for bachelor's, master's, PhD, and training programs worldwide. 
              Fund your education and achieve your dreams.
            </p>

            {/* Search */}
            <form method="GET" className="max-w-xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search scholarships by title, organization, or country..."
                  className="w-full bg-white/95 backdrop-blur text-slate-800 placeholder-slate-400 rounded-2xl pl-12 pr-16 py-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 shadow-2xl transition-all"
                  aria-label="Search scholarships"
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
                href="/jobs"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs text-slate-200 transition-all"
              >
                Looking for jobs?
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Active filters indicator */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-5 text-sm animate-fade-in">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                <span className="font-bold text-[#002147]">{totalCount}</span> result{totalCount !== 1 ? "s" : ""}
                {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
              </span>
            </div>
            <Link
              href="/opportunities"
              className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-2 transition-colors ml-1"
            >
              Clear filters
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm animate-slide-down">
            Failed to load scholarships. Please try again later.
          </div>
        )}

        <OpportunitiesGrid
          initialOpportunities={opportunities}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          searchQuery={searchQuery}
          currentPage={pageIndex}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}