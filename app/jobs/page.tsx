import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { filterExpired } from "@/lib/opportunity-utils";
import Navbar from "@/components/Navbar";
import { Opportunity } from "@/types";
import { Briefcase, Search, MapPin, Clock, Building2, ArrowRight, Sparkles, Filter } from "lucide-react";

interface JobsPageProps {
  searchParams: Promise<{ q?: string; sector?: string; type?: string }>;
}

export const metadata: Metadata = {
  title: "Jobs in Liberia – Succevia Hub",
  description: "Find government, NGO, and private sector jobs in Liberia. Full-time, part-time, remote, internships, and more.",
  keywords: [
    "liberia jobs", "monrovia jobs", "ngo jobs liberia", "government jobs liberia",
    "hiring liberia", "jobs in liberia", "liberia career opportunities",
  ],
  alternates: { canonical: "https://succeviahub.vercel.app/jobs" },
  openGraph: {
    title: "Jobs in Liberia – Succevia Hub",
    description: "Find government, NGO, and private sector jobs in Liberia. Full-time, part-time, remote, internships.",
    url: "https://succeviahub.vercel.app/jobs",
    siteName: "Succevia Hub",
    type: "website",
  },
};

const JOB_TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "internship", label: "Internship" },
  { value: "volunteer", label: "Volunteer" },
];

const SECTOR_FILTERS = [
  { value: "all", label: "All Sectors" },
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
  { value: "private", label: "Private Sector" },
  { value: "international", label: "International" },
];

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const searchQuery = params?.q ?? "";
  const sectorFilter = params?.sector ?? "all";
  const typeFilter = params?.type ?? "all";
  const itemsPerPage = 20;

  let query = supabaseAdmin
    .from("opportunities")
    .select(
      "id, created_at, title, description, type, organization, location, deadline, requirements, application_url, image_url, is_active",
      { count: "exact" }
    )
    .eq("is_active", true)
    .eq("type", "job");

  if (searchQuery.trim()) {
    const q = searchQuery.trim().replace(/,/g, " ");
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,organization.ilike.%${q}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("[jobs/page] Failed to fetch jobs:", error.message);
  }

  let jobs: Opportunity[] = (data ?? []) as Opportunity[];
  jobs = filterExpired(jobs);

  // Sort by deadline (closest first), then newest
  jobs = jobs.sort((a, b) => {
    const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    if (dateA !== dateB) return dateA - dateB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalCount = jobs.length;
  jobs = jobs.slice(0, itemsPerPage);

  // Stats
  const stats = {
    total: totalCount,
    government: 0,
    ngo: 0,
    private: 0,
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#002147] via-[#003580] to-[#0066cc] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
        />
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-80 h-80 bg-[#25D366] rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <Briefcase className="w-3.5 h-3.5 text-[#25D366]" />
              Job Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Find Your Next Career Opportunity</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Browse jobs from government, NGOs, and private sector. Your dream job is waiting.
            </p>

            {/* Search */}
            <form method="GET" className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input
                  type="search"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search jobs by title, organization, or keyword..."
                  className="w-full pl-12 pr-36 py-3.5 rounded-2xl bg-white/95 backdrop-blur text-slate-800 text-sm sm:text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 placeholder:text-slate-400 transition-all"
                  aria-label="Search jobs"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                  <select
                    name="type"
                    defaultValue={typeFilter}
                    className="bg-slate-100 text-slate-700 text-xs rounded-lg px-2 py-2 hidden sm:block border-0 focus:ring-2 focus:ring-[#25D366]"
                    aria-label="Filter by job type"
                  >
                    {JOB_TYPE_FILTERS.map(jt => (
                      <option key={jt.value} value={jt.value}>{jt.label}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-[#25D366] hover:bg-[#1da851] p-2.5 rounded-xl text-white transition-all hover:scale-105 shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#25D366]" />
                {totalCount} job{totalCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#25D366]" />
                Government & NGO
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#25D366]" />
                Apply today
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Active filters indicator */}
        {(searchQuery || typeFilter !== "all" || sectorFilter !== "all") && (
          <div className="flex items-center gap-2 mb-5 text-sm animate-fade-in">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 text-slate-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                <span className="font-bold text-[#002147]">{totalCount}</span> result{totalCount !== 1 ? "s" : ""}
                {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
              </span>
            </div>
            <Link
              href="/jobs"
              className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-2 transition-colors ml-1"
            >
              Clear filters
            </Link>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm animate-slide-down">
            Failed to load jobs. Please try again later.
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-4">
              <Briefcase className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">No jobs found</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto px-4">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term or browse all jobs.`
                : "No job openings are currently available. Check back soon or browse other opportunities."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 bg-[#002147] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                View Scholarships
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-2xl transition-all hover:bg-slate-50 active:scale-95"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-slate-500 text-xs sm:text-sm mb-4">
              <span className="font-bold text-[#002147]">{totalCount}</span> job{totalCount !== 1 ? "s" : ""}
              {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
            </p>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 card-hover group"
                >
                  <div className="p-5 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#002147] to-[#003580] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-bold text-[#002147] text-sm sm:text-base line-clamp-2 group-hover:text-[#25D366] transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {job.organization}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.location && (
                        <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      )}
                      {job.deadline && (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3" />
                          {job.deadline}
                        </span>
                      )}
                    </div>

                    {/* Action */}
                    <a
                      href={job.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#002147] hover:bg-[#003580] text-white text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-95"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More / View All */}
            {totalCount > itemsPerPage && (
              <div className="text-center mt-8">
                <Link
                  href="/opportunities?type=job"
                  className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:bg-slate-50 active:scale-95"
                >
                  View All Jobs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}