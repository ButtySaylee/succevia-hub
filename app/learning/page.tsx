"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  BookOpen,
  Search,
  ExternalLink,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  GraduationCap,
  Globe,
  Clock,
  Star,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { certificateProviders, categories } from "@/lib/free-certificates-data";

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [showAllProviders, setShowAllProviders] = useState(false);

  const filteredProviders = useMemo(() => {
    let filtered = certificateProviders;

    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.courses.some((c) => c.name.toLowerCase().includes(query)) ||
          p.features.some((f) => f.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  const displayedProviders = showAllProviders
    ? filteredProviders
    : filteredProviders.slice(0, 12);

  const totalCourses = certificateProviders.reduce(
    (sum, p) => sum + p.courses.length,
    0
  );

  const toggleProvider = (id: string) => {
    setExpandedProvider(expandedProvider === id ? null : id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#002147] via-[#003580] to-[#004a8f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#25D366] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#25D366]" />
              <span className="text-sm text-slate-200 font-medium">
                Free Certificates & Badges
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Learn New Skills with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-emerald-300">
                Free Certificates
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Access thousands of free certificate courses from the world's top
              universities and companies. Level up your career without spending
              a dime.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
              {[
                {
                  icon: GraduationCap,
                  value: `${certificateProviders.length}+`,
                  label: "Providers",
                },
                {
                  icon: Award,
                  value: "10,000+",
                  label: "Free Certificates",
                },
                {
                  icon: Globe,
                  value: "30+",
                  label: "Categories",
                },
                {
                  icon: Users,
                  value: "10M+",
                  label: "Learners Served",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4"
                >
                  <stat.icon className="w-5 h-5 text-[#25D366] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search providers, courses, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 focus:border-[#25D366]/50 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Category Filter */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const count =
                cat.id === "all"
                  ? certificateProviders.length
                  : certificateProviders.filter((p) => p.category === cat.id)
                      .length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setShowAllProviders(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-[#002147] text-white shadow-md"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Info */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#002147]">
              {activeCategory === "all"
                ? "All Free Certificate Providers"
                : categories.find((c) => c.id === activeCategory)?.name ||
                  "Providers"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredProviders.length} provider
              {filteredProviders.length !== 1 ? "s" : ""} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
          {filteredProviders.length > 12 && (
            <button
              onClick={() => setShowAllProviders(!showAllProviders)}
              className="text-sm text-[#002147] font-medium hover:text-[#25D366] transition-colors"
            >
              {showAllProviders ? "Show Less" : "View All"}
            </button>
          )}
        </div>

        {/* Provider Cards */}
        {filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              No providers found
            </h3>
            <p className="text-sm text-slate-400">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {displayedProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Provider Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleProvider(provider.id)}
                >
                  <div className="flex items-start gap-5">
                    {/* Logo */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: provider.color + "15" }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: provider.color }}
                      >
                        {provider.name.charAt(0)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-[#002147] group-hover:text-[#25D366] transition-colors">
                              {provider.name}
                            </h3>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: provider.color + "15",
                                color: provider.color,
                              }}
                            >
                              {provider.courseCount} courses
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed max-w-2xl">
                            {provider.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a
                            href={provider.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs font-medium text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-all"
                            style={{ backgroundColor: provider.color }}
                          >
                            Visit <ExternalLink className="w-3 h-3" />
                          </a>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                            {expandedProvider === provider.id ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {provider.features.map((feature, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Courses */}
                {expandedProvider === provider.id && (
                  <div className="border-t border-slate-100 bg-slate-50/50">
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-[#002147] mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#25D366]" />
                        Featured Free Certificate Courses
                      </h4>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {provider.courses.map((course, i) => (
                          <a
                            key={i}
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#25D366]/30 hover:shadow-sm transition-all group/course"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: provider.color }}
                            >
                              {i + 1}
                            </div>
                            <span className="text-sm text-slate-700 group-hover/course:text-[#002147] transition-colors leading-snug flex-1">
                              {course.name}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover/course:text-[#25D366] transition-colors flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!showAllProviders && filteredProviders.length > 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllProviders(true)}
              className="inline-flex items-center gap-2 bg-[#002147] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#003580] transition-all shadow-md hover:shadow-lg"
            >
              Show All {filteredProviders.length} Providers
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-[#002147] to-[#003580] mt-12">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Award className="w-12 h-12 text-[#25D366] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Start Learning Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg mx-auto">
            All certificates listed here are completely free. No hidden fees, no
            credit card required. Just pure learning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-500 transition-all shadow-lg"
            >
              Browse Marketplace <TrendingUp className="w-4 h-4" />
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
            >
              View Opportunities <Star className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#001a33] text-slate-400 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-lg mb-3">Succevia Hub</h3>
              <p className="text-xs leading-relaxed">
                Liberia's #1 platform for jobs, scholarships, marketplace,
                services, and community opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
                Opportunities
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/marketplace", label: "Marketplace" },
                  { href: "/jobs", label: "Jobs" },
                  { href: "/opportunities", label: "Scholarships" },
                  { href: "/services", label: "Services" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
                Community
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/businesses", label: "Business Directory" },
                  { href: "/community", label: "Communities" },
                  { href: "/learning", label: "Learning Center" },
                  { href: "/events", label: "Events" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
                Account
              </h4>
              <ul className="space-y-2">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/sell", label: "Start Selling" },
                  { href: "/download/android", label: "Mobile App" },
                  { href: "/reset-pin", label: "Reset PIN" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Link
                href="/about"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/dashboard"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/sell"
                className="text-xs text-slate-500 hover:text-white transition-colors"
              >
                Sell
              </Link>
            </div>
            <div className="text-center">
              <p className="text-xs">
                © {new Date().getFullYear()} Succevia Hub · Liberia's
                Opportunity Platform 🇱🇷
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                Built with ❤️ by{" "}
                <a
                  href="https://butty-portfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] font-semibold hover:underline"
                >
                  Butty Saylee
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
