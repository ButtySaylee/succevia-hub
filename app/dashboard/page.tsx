"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ForgotPin from "@/components/ForgotPin";
import SellerEditListing from "@/components/SellerEditListing";
import { Listing } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import {
  Store,
  Loader2,
  AlertCircle,
  Package,
  Eye,
  CheckCircle2,
  Pencil,
  RefreshCw,
  RotateCcw,
  PlusCircle,
  Trash2,
} from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState("");
  const [sellerPin, setSellerPin] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "pending" | "sold">("all");

  const waClean = whatsapp.replace(/\s/g, "");
  const pin = sellerPin.trim();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
      setError("Enter a valid WhatsApp number with country code (e.g., +231777123456)");
      setLoading(false);
      return;
    }

    if (!/^\d{4,8}$/.test(pin)) {
      setError("Enter your seller PIN (4-8 digits)");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/listings/seller?seller_whatsapp=${encodeURIComponent(waClean)}&seller_pin=${encodeURIComponent(pin)}`
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
    setSellerPin("");
    setActiveFilter("all");
    setMessage(null);
    setError(null);
    setConfirmDeleteId(null);
  }

  async function markAsSold(id: string) {
    setError(null);
    setMessage(null);
    setActionLoadingId(id);

    try {
      const res = await fetch("/api/listings/seller-sold", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, seller_whatsapp: waClean, seller_pin: pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to mark listing as sold.");

      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_sold: true } : item))
      );
      setMessage("Listing marked as sold.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function relistItem(id: string) {
    setError(null);
    setMessage(null);
    setActionLoadingId(id);

    try {
      const res = await fetch("/api/listings/seller-relist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id, seller_whatsapp: waClean, seller_pin: pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to re-list item.");

      setMessage("Item re-listed successfully and is now live!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function deleteItem(id: string) {
    setError(null);
    setMessage(null);
    setActionLoadingId(id);
    setConfirmDeleteId(null);

    try {
      const res = await fetch("/api/listings/seller-delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: id, seller_whatsapp: waClean, seller_pin: pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete listing.");

      setListings((prev) => prev.filter((item) => item.id !== id));
      setMessage("Listing deleted.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  }

  const stats = {
    total: listings.length,
    approved: listings.filter((l) => l.is_approved).length,
    pending: listings.filter((l) => !l.is_approved).length,
    sold: listings.filter((l) => l.is_sold).length,
    active: listings.filter((l) => l.is_approved && !l.is_sold).length,
  };

  const displayedListings = listings.filter((l) => {
    if (activeFilter === "active") return l.is_approved && !l.is_sold;
    if (activeFilter === "pending") return !l.is_approved;
    if (activeFilter === "sold") return l.is_sold;
    return true;
  });

  // ── Login screen ─────────────────────────────────────────────────────────────
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
                  WhatsApp Number
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
                  The same number you used when posting your listings
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
                <div className="mt-1">
                  <ForgotPin sellerWhatsapp={whatsapp} onSuccess={() => setSellerPin("")} />
                </div>
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
                never share or store this information beyond matching it with
                your posts.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Dashboard (authenticated) ─────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#002147] mb-1">
              Seller Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your listings and track performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/sell")}
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-4 py-2 rounded-full text-sm transition-all shadow"
            >
              <PlusCircle className="w-4 h-4" />
              Post New Listing
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-600 hover:text-[#002147] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        {message && !error && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 mb-5 text-sm">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            {message}
          </div>
        )}

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

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(["all", "active", "pending", "sold"] as const).map((filter) => {
            const count = filter === "all" ? stats.total : stats[filter];
            const label = filter.charAt(0).toUpperCase() + filter.slice(1);
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === filter
                    ? "bg-[#002147] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Listings */}
        {displayedListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              {listings.length === 0
                ? "No listings yet"
                : `No ${activeFilter} listings`}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {listings.length === 0
                ? "Start selling by posting your first item!"
                : `You have no listings in the "${activeFilter}" tab.`}
            </p>
            {listings.length === 0 && (
              <button
                onClick={() => router.push("/sell")}
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-[#1da851] transition-all"
              >
                Post a Listing
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedListings.map((listing) => (
              <article
                key={listing.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100"
              >
                {/* Image */}
                <div className="relative h-44 bg-slate-100">
                  <Image
                    src={optimizeCloudinaryUrl(listing.image_urls?.[0] ?? "", 800)}
                    alt={listing.title}
                    fill
                    className={`object-cover ${listing.is_sold ? "opacity-60" : ""}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {listing.is_sold && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-red-500 text-white font-extrabold text-sm px-3 py-1 rounded-lg shadow">
                        SOLD
                      </span>
                    </div>
                  )}
                  {!listing.is_approved && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Pending Review
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4">
                  <h2 className="font-bold text-[#002147] line-clamp-1">
                    {listing.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                    {listing.description}
                  </p>
                  <div className="mt-2 text-sm font-semibold text-[#25D366]">
                    {listing.price}
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        listing.is_approved
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {listing.is_approved ? "Approved" : "Pending"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      {listing.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/listings/${listing.id}`}
                      className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2 rounded-xl transition-colors"
                    >
                      View
                    </Link>

                    {!listing.is_sold && listing.is_approved && (
                      <button
                        onClick={() => setEditingId(listing.id)}
                        disabled={actionLoadingId !== null}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-600 text-sm font-semibold py-2 rounded-xl transition-colors"
                        title="Edit listing details"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                    )}

                    {!listing.is_sold ? (
                      <button
                        onClick={() => markAsSold(listing.id)}
                        disabled={
                          !listing.is_approved || actionLoadingId === listing.id
                        }
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                        title="Mark this item as sold"
                      >
                        {actionLoadingId === listing.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Mark Sold
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => relistItem(listing.id)}
                        disabled={actionLoadingId === listing.id}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-600 text-sm font-semibold py-2 rounded-xl transition-colors"
                        title="Re-list this item"
                      >
                        {actionLoadingId === listing.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            Re-list
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {confirmDeleteId === listing.id ? (
                    <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <p className="text-xs text-red-600 flex-1 font-medium">
                        Delete permanently?
                      </p>
                      <button
                        onClick={() => deleteItem(listing.id)}
                        disabled={actionLoadingId === listing.id}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {actionLoadingId === listing.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Yes, Delete"
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2 py-1.5 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(listing.id)}
                      disabled={actionLoadingId === listing.id}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50 text-xs font-semibold py-1.5 rounded-xl border border-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Listing
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Listing Modal */}
      {editingId && (
        <SellerEditListing
          listing={listings.find((l) => l.id === editingId)!}
          sellerWhatsapp={waClean}
          sellerPin={pin}
          onSuccess={(updated) => {
            setListings((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            setEditingId(null);
            setMessage("Listing updated successfully!");
          }}
          onCancel={() => setEditingId(null)}
        />
      )}
    </main>
  );
}
