import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CalendarDays, Search, MapPin, Clock, ArrowRight, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Events – Succevia Hub",
  description: "Discover events in Liberia. Workshops, seminars, conferences, and networking events.",
  keywords: ["events liberia", "workshops monrovia", "networking events liberia"],
  alternates: { canonical: "https://succeviahub.vercel.app/events" },
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <CalendarDays className="w-3.5 h-3.5 text-[#25D366]" />
              Events
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Discover Events Near You</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Find workshops, seminars, conferences, and networking opportunities.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">
          <CalendarDays className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-[#002147] mb-3">Coming Soon</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Events and networking opportunities are coming soon.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#003580] transition-all">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}