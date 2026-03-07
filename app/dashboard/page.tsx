"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ItemCard from "@/components/ItemCard";
import { Listing } from "@/types";
import { Store, Loader2, AlertCircle, Package, Eye } from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState("");
  const [sellerPin, setSellerPin] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const waClean = whatsapp.replace(/\s/g, "");
    if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
      setError("Enter a valid WhatsApp number with country code (e.g., +231777123456)");
      setLoading(false);
      return;
    }

    if (!/^\d{4,8}$/.test(sellerPin.trim())) {
      setError("Enter your seller PIN (4-8 digits)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/listings/seller?seller_whatsapp=${encodeURIComponent(waClean)}&seller_pin=${encodeURIComponent(sellerPin.trim())}`
      );
      const payload = (await res.json()) as { listings?: Listing[]; error?: string };

      if (!res.ok) throw new Error(payload.error ?? "Failed to load listings");

      const data = payload.listings ?? [];
      if (data.length === 0) {
        setError("No listings found for this WhatsApp number or PIN.");
        setLoading(false);
        return;
      }

      setListings(data);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setAuthenticated(false);
    setListings([]);
    setWhatsapp("");
  }

  const stats = {
    total: listings.length,
    approved: listings.filter(l => l.is_approved).length,
    pending: listings.filter(l => !l.is_approved).length,
    sold: listings.filter(l => l.is_sold).length,
    active: listings.filter(l => l.is_approved && !l.is_sold).length,
  };

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#002147] rounded-full mb-3">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#002147] mb-1">
                Seller Dashboard
              </h1>
              <p className="text-slate-500 text-sm">
                Manage your listings and track performance
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Your WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+231777123456"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  The same number you used when posting listings
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Seller PIN
                </label>
                <input
                  type="password"
                  value={sellerPin}
                  onChange={(e) => setSellerPin(e.target.value)}
                  placeholder="4-8 digits"
                  inputMode="numeric"
                  pattern="[0-9]{4,8}"
                  minLength={4}
                  maxLength={8}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "View My Listings"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 text-center">
                Your WhatsApp number is used only to identify your listings. We
                never share or store this information beyond matching it with your
                posts.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#002147] mb-1">
              My Listings
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your items and track performance
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-600 hover:text-[#002147] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <Package className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <div className="text-2xl font-bold text-[#002147]">{stats.total}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <Eye className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-slate-500">Active</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <div className="text-xs text-slate-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.sold}</div>
            <div className="text-xs text-slate-500">Sold</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
            <div className="text-xs text-slate-500">Approved</div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button className="px-4 py-2 bg-[#002147] text-white rounded-full text-sm font-semibold whitespace-nowrap">
            All ({stats.total})
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-semibold whitespace-nowrap transition-colors">
            Active ({stats.active})
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-semibold whitespace-nowrap transition-colors">
            Pending ({stats.pending})
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-sm font-semibold whitespace-nowrap transition-colors">
            Sold ({stats.sold})
          </button>
        </div>

        {/* Listings Grid */}
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No listings yet
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Start selling by posting your first item!
            </p>
            <button
              onClick={() => router.push("/sell")}
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#1da851] transition-all"
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <div key={listing.id} className="relative">
                <ItemCard listing={listing} />
                {!listing.is_approved && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                    Pending Review
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
