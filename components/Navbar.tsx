'use client';

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import MobileDrawer from "@/components/MobileDrawer";
import { PlusCircle, LayoutDashboard, Briefcase, Download, ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/#listings", icon: ShoppingBag, label: "Shop", title: "Shop Items Globally" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", title: "Seller Dashboard" },
    { href: "/opportunities", icon: Briefcase, label: "Opportunities", title: "Browse Global Opportunities" },
    { href: "/download/android", icon: Download, label: "App", title: "Get Mobile App" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#002147] to-[#003580] shadow-2xl backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <Logo variant="horizontal" size="lg" priority />
            </div>
            <div className="hidden sm:block text-slate-300 text-[11px] font-medium">
              Global Marketplace 🌍
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-3 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20 min-h-[44px] min-w-[44px] justify-center"
                title={item.title}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/sell"
              className="flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] text-white font-bold px-4 py-3 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Globally</span>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            {/* Primary CTA - Always visible */}
            <Link
              href="/sell"
              className="flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] text-white font-bold px-3 py-3 rounded-full text-sm transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] justify-center"
              title="Sell Globally"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Sell</span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-3 py-3 rounded-full text-sm transition-all duration-300 hover:scale-105 border border-white/20 min-h-[44px] min-w-[44px]"
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-4 rounded-lg hover:bg-slate-50 transition-colors duration-200 text-slate-700 hover:text-slate-900 min-h-[56px]"
              title={item.title}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Secondary CTA in drawer */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link
              href="/sell"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full p-4 rounded-lg bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-bold transition-all duration-300 hover:shadow-lg active:scale-95 min-h-[56px]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Sell Globally</span>
            </Link>
          </div>
        </nav>
      </MobileDrawer>
    </>
  );
}
