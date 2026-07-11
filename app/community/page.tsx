import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Users, Search, MessageCircle, ArrowRight, Globe, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Community – Succevia Hub",
  description: "Join communities in Liberia. Connect with professionals, students, entrepreneurs, and more.",
  keywords: ["liberia community", "professional network liberia", "join groups liberia"],
  alternates: { canonical: "https://succeviahub.vercel.app/community" },
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative bg-gradient-to-br from-[#002147] to-[#003580] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs text-slate-200">
              <Users className="w-3.5 h-3.5 text-[#25D366]" />
              Community
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Connect & Grow Together</h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
              Join communities of like-minded people. Share knowledge, collaborate, and build your network.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-50 rounded-2xl mb-6">
            <Users className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#002147] mb-3">Coming Soon</h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Communities are coming! Connect with professionals, students, entrepreneurs, and more.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#002147] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#003580] transition-all">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}