'use client';

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import MobileDrawer from "@/components/MobileDrawer";
import SearchBar from "@/components/SearchBar";
import { 
  PlusCircle, LayoutDashboard, Briefcase,
  ShoppingBag, Menu, Search, X, Globe, Users, 
  Building2, GraduationCap, BookOpen, CalendarDays,
  ChevronDown, Wrench, UserCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/marketplace", icon: ShoppingBag, label: "Marketplace", title: "Buy & Sell Products" },
  { href: "/jobs", icon: Briefcase, label: "Jobs", title: "Find Jobs" },
  { href: "/opportunities", icon: GraduationCap, label: "Scholarships", title: "Browse Scholarships" },
  { href: "/services", icon: Wrench, label: "Services", title: "Request or Offer Services" },
  { href: "/professionals", icon: UserCheck, label: "Professionals", title: "Hire Professionals" },
  { href: "/businesses", icon: Building2, label: "Businesses", title: "Business Directory" },
  { href: "/community", icon: Users, label: "Community", title: "Join Communities" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setShowMoreMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setShowMoreMenu(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = useCallback((href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/marketplace") return pathname === "/marketplace" || (pathname === "/");
    return pathname.startsWith(href);
  }, [pathname]);

  const primaryNavItems = NAV_ITEMS.slice(0, 4);
  const moreNavItems = NAV_ITEMS.slice(4);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#002147] to-[#003580] shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Main Nav Row */}
          <div className="flex items-center justify-between gap-2 py-3 sm:py-3.5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <div className="transform group-hover:scale-105 transition-transform duration-300">
                <Logo variant="horizontal" size="sm" priority />
              </div>
            </Link>

            {/* Mobile Search & Menu Toggles */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-full p-2 transition-all duration-300 border border-white/20 min-h-[38px] min-w-[38px]"
                aria-label={isSearchOpen ? "Close search" : "Open search"}
              >
                {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
              </button>
              
              <Link
                href="/sell"
                className="flex items-center gap-1 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-bold px-3 py-2 rounded-full text-xs transition-all duration-300 shadow-lg active:scale-95 min-h-[38px]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Sell</span>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-full p-2 transition-all duration-300 border border-white/20 min-h-[38px] min-w-[38px]"
                aria-label="Open navigation menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center max-w-3xl">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 text-white font-medium px-2.5 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/10 min-h-[36px] whitespace-nowrap ${
                    isActive(item.href) ? "bg-white/15 shadow-sm" : ""
                  }`}
                  title={item.title}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <item.icon className={`w-3.5 h-3.5 ${isActive(item.href) ? "text-[#25D366]" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* More Menu */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="flex items-center gap-1.5 text-white font-medium px-2.5 py-2 rounded-lg text-xs transition-all duration-200 hover:bg-white/10 min-h-[36px]"
                  aria-expanded={showMoreMenu}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showMoreMenu ? "rotate-180" : ""}`} />
                </button>

                {showMoreMenu && (
                  <div className="absolute top-full mt-1 right-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-scale-in">
                    <div className="p-2">
                      {moreNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setShowMoreMenu(false)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                            isActive(item.href)
                              ? "bg-[#25D366]/10 text-[#002147] font-bold"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-[#25D366]" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 p-2">
                      <Link
                        href="/learning"
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span>Learning Center</span>
                      </Link>
                      <Link
                        href="/events"
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        <span>Events</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg p-2 transition-all duration-200 min-h-[36px] min-w-[36px]"
                aria-label="Toggle search"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-2 rounded-lg text-xs transition-all duration-200 min-h-[36px]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/sell"
                className="flex items-center gap-1.5 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] text-white font-bold px-4 py-2 rounded-lg text-xs transition-all duration-300 shadow-lg hover:shadow-green-500/30 active:scale-95 min-h-[36px]"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Sell</span>
              </Link>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {isSearchOpen && (
            <div className="pb-3 animate-slide-down">
              <SearchBar variant="compact" />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <nav className="space-y-1">
          {/* Search in drawer */}
          <div className="mb-4">
            <SearchBar variant="compact" />
          </div>

          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-200 min-h-[48px] ${
                  isActive(item.href)
                    ? "bg-[#25D366]/10 text-[#002147] font-bold border-l-4 border-[#25D366]"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
                title={item.title}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-[#25D366]" : "text-slate-400"}`} />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-2" />

          {/* Secondary Links */}
          <div className="space-y-0.5">
            <Link
              href="/learning"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Learning Center</span>
            </Link>
            <Link
              href="/events"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              <CalendarDays className="w-4 h-4 text-slate-400" />
              <span>Events</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* CTA */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link
              href="/sell"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-bold transition-all duration-300 active:scale-95 min-h-[48px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm">Start Selling</span>
            </Link>
            
            <div className="mt-4 p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 text-center leading-relaxed">
                🌍 Liberia's #1 opportunity platform<br />
                <span className="text-[#25D366] font-semibold">Jobs · Scholarships · Marketplace · Services</span>
              </p>
            </div>
          </div>
        </nav>
      </MobileDrawer>
    </>
  );
}