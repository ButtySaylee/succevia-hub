import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import OpportunitiesGrid from "@/components/OpportunitiesGrid";
import { Opportunity } from "@/types";
import { Briefcase, GraduationCap, Search } from "lucide-react";

interface OpportunitiesPageProps {
  searchParams: Promise<{ type?: string; q?: string }>;
}

export const metadata: Metadata = {
  title: "Browse Opportunities – Succevia Hub",
  description:
    "Discover job and scholarship opportunities posted by Succevia Hub. Apply today and take the next step in your career or education.",
  keywords: [
    "jobs in liberia",
    "scholarships liberia",
    "succevia hub opportunities",
    "monrovia jobs",
    "liberia scholarship",
  ],
  alternates: {
    canonical: "https://succeviahub.vercel.app/opportunities",
  },
};

const typeFilters = [
  { value: "all", label: "All", icon: null },
  { value: "job", label: "Jobs", icon: Briefcase },
  { value: "scholarship", label: "Scholarships", icon: GraduationCap },
];

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const params = await searchParams;
  const typeFilter = params?.type === "job" || params?.type === "scholarship" ? params.type : "all";
  const searchQuery = params?.q ?? "";
  const itemsPerPage = 12;

  const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function parseDeadlineMonth(deadline: string | undefined): number {
    if (!deadline) return 13; // No deadline goes last
    const month = MONTH_ORDER.find(m => deadline.includes(m));
    return month ? MONTH_ORDER.indexOf(month) : 13;
  }

  let query = supabaseAdmin
    .from("opportunities")
    .select(
      "id, created_at, title, description, type, organization, location, deadline, requirements, application_url, image_url, is_active",
      { count: "exact" }
    )
    .eq("is_active", true);

  if (typeFilter !== "all") {
    query = query.eq("type", typeFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.trim().replace(/,/g, " ");
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,organization.ilike.%${q}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("[opportunities/page] Failed to fetch opportunities:", error.message);
  }

  let opportunities: Opportunity[] = (data ?? []) as Opportunity[];

  // Sort by month order (January to December)
  opportunities = opportunities.sort((a, b) => {
    const monthA = parseDeadlineMonth(a.deadline);
    const monthB = parseDeadlineMonth(b.deadline);
    if (monthA !== monthB) return monthA - monthB;
    
    // If same month, sort by newest first
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Apply pagination after sorting
  opportunities = opportunities.slice(0, itemsPerPage);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#002147] to-[#003580] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Briefcase className="w-8 h-8 text-[#25D366]" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Opportunities
            </h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6">
            Browse job openings and scholarship opportunities.
          </p>

          {/* Search */}
          <form method="GET" className="max-w-xl mx-auto flex gap-2">
            <input type="hidden" name="type" value={typeFilter !== "all" ? typeFilter : ""} />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search opportunities..."
                className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] shadow"
              />
            </div>
            <button
              type="submit"
              className="bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-5 py-3 rounded-full text-sm transition-all shadow"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Type filter */}
      <div className="bg-white border-b border-slate-200 sticky top-[64px] z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {typeFilters.map(({ value, label, icon: Icon }) => (
            <Link
              key={value}
              href={`/opportunities?type=${value}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                typeFilter === value
                  ? "bg-[#002147] text-white shadow"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {(searchQuery || typeFilter !== "all") && (
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
            {count != null && (
              <span>
                <span className="font-bold text-[#002147]">{count}</span> result{count !== 1 ? "s" : ""}
              </span>
            )}
            {(searchQuery || typeFilter !== "all") && (
              <Link
                href="/opportunities"
                className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-2 transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}

        <OpportunitiesGrid
          initialOpportunities={opportunities}
          totalItems={count ?? 0}
          itemsPerPage={itemsPerPage}
          typeFilter={typeFilter}
          searchQuery={searchQuery}
        />
      </div>
    </main>
  );
}
