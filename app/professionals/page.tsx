import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { UserCheck, Search, Star, Shield, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hire Professionals – Succevia Hub",
  description: "Find and hire skilled professionals in Liberia. Freelancers, technicians, designers, developers, and more.",
  keywords: ["hire professionals liberia", "freelancers liberia", "service providers liberia"],
  alternates: { canonical: "https://succeviahub.vercel.app/professionals" },
};

export default function ProfessionalsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-[#25D366]" />
              Professional Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Hire Top Professionals</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Find skilled freelancers and service providers. Browse portfolios, read reviews, and hire with confidence.
            </p>
            <form className="max-w-xl mx-auto" method="GET">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                <input type="search" name="q" placeholder="Search by skill, name, or category..." className="w-full pl-12 pr-16 py-3.5 rounded-2xl bg-white/95 text-slate-800 text-sm shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#25D366] hover:bg-[#1da851] p-2.5 rounded-xl text-white transition-all shadow-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-50 rounded-2xl mb-6">
            <UserCheck className="w-10 h-10 text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#002147] mb-3">Coming Soon</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            We're building a directory of Liberia's top professionals. 
            Service providers will be able to create profiles and get hired.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/services" className="inline-flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#003580] transition-all">
              Request a Service <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#002147] hover:text-white transition-all">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}