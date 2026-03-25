import Link from "next/link";
import { ShoppingBag, PlusCircle, LayoutDashboard, Briefcase, Download } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#002147] to-[#003580] shadow-2xl backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#25D366] to-[#1da851] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <ShoppingBag className="w-5 h-5 text-white group-hover:animate-bounce" />
          </div>
          <div className="leading-none">
            <span className="text-white font-bold text-lg tracking-wide bg-gradient-to-r from-white to-slate-100 bg-clip-text text-transparent">
              Succevia
            </span>
            <span className="text-[#25D366] font-bold text-lg tracking-wide">
              {" "}Hub
            </span>
            <p className="text-slate-300 text-[11px] font-medium hidden sm:block">
              Global Marketplace 🌍
            </p>
          </div>
        </Link>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/#listings"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20"
            title="Shop Items Globally"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20"
            title="Seller Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/opportunities"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20"
            title="Browse Global Opportunities"
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Opportunities</span>
          </Link>
          <Link
            href="/download/android"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20"
            title="Get Mobile App"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">App</span>
          </Link>
          <Link
            href="/sell"
            className="flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] text-white font-bold px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Globally</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
