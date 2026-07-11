import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-3xl mb-6">
          <span className="text-5xl font-extrabold text-slate-300">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#002147] hover:bg-[#003580] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            <Search className="w-4 h-4" />
            Browse Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}