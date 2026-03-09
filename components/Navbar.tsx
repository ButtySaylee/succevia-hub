import Link from "next/link";
import { ShoppingBag, PlusCircle, LayoutDashboard, Briefcase, Download } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#002147] shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shadow">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div className="leading-none">
            <span className="text-white font-bold text-lg tracking-wide">
              Gbana
            </span>
            <span className="text-[#25D366] font-bold text-lg tracking-wide">
              {" "}Market
            </span>
            <p className="text-slate-400 text-[10px] font-normal hidden sm:block">
              The Liberian Trust-First Marketplace
            </p>
          </div>
        </Link>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/#listings"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#002147] font-semibold px-3 py-2 rounded-full text-sm transition-all"
            title="Shop Items"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Shop</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#002147] font-semibold px-3 py-2 rounded-full text-sm transition-all"
            title="Seller Dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">My Dashboard</span>
          </Link>
          <Link
            href="/opportunities"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#002147] font-semibold px-3 py-2 rounded-full text-sm transition-all"
            title="Browse Opportunities"
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Opportunities</span>
          </Link>
          <Link
            href="/download/android"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#002147] font-semibold px-3 py-2 rounded-full text-sm transition-all"
            title="Get Android App"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Android App</span>
          </Link>
          <Link
            href="/sell"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-semibold px-4 py-2 rounded-full text-sm transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Item</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
