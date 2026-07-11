import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Building2, Search, Star, MapPin, ArrowRight, Shield } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/types";

export const metadata: Metadata = {
  title: "Business Directory – Succevia Hub",
  description: "Discover businesses in Liberia. Read reviews, find contact info, and connect with local businesses.",
  keywords: ["liberia business directory", "businesses in liberia", "monrovia businesses"],
  alternates: { canonical: "https://succeviahub.vercel.app/businesses" },
};

export default function BusinessesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-[#25D366]" />
              Business Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Discover Local Businesses</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Find and connect with businesses in Liberia. Read reviews, get directions, and contact them directly.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BUSINESS_CATEGORIES.map((cat) => (
            <Link key={cat} href={`/businesses?category=${cat}`} className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-lg transition-all text-center hover:-translate-y-0.5">
              <Building2 className="w-8 h-8 text-[#25D366] mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-700">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-[#002147] mb-3">Coming Soon</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-8">
            We're building a comprehensive business directory for Liberia.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#003580] transition-all">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}