"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import ForgotPin from "@/components/ForgotPin";
import SellerEditListing from "@/components/SellerEditListing";
import { Listing } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { Loader2, RefreshCw, CheckCircle2, AlertCircle, Pencil, RotateCcw } from "lucide-react";

export default function SellerPage() {
  const [sellerWhatsapp, setSellerWhatsapp] = useState("");
  const [sellerPin, setSellerPin] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const waClean = sellerWhatsapp.replace(/\s/g, "");
  const pin = sellerPin.trim();

  async function fetchMyListings() {
    setError(null);
    setMessage(null);

    if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
      setError("Enter a valid WhatsApp number with country code (e.g. +231777123456).");
      return;
    }

    if (!/^\d{4,8}$/.test(pin)) {
      setError("Enter your seller PIN (4-8 digits).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/listings/seller?seller_whatsapp=${encodeURIComponent(waClean)}&seller_pin=${encodeURIComponent(pin)}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch listings.");
      }

      setListings(data.listings ?? []);
      if ((data.listings ?? []).length === 0) {
        setMessage("No listings found for this WhatsApp number.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
      if (!res.ok) {
        throw new Error(data?.error || "Failed to mark listing as sold.");
      }

      setListings((prev) => prev.map((item) => (item.id === id ? { ...item, is_sold: true } : item)));
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
        body: JSON.stringify({
          listing_id: id,
          seller_whatsapp: waClean,
          seller_pin: pin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to re-list item.");
      }

      setMessage("Item re-listed successfully! Awaiting admin approval.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-extrabold text-[#002147]">My Listings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your WhatsApp number and seller PIN to manage your listings.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3">
            <input
              type="tel"
              value={sellerWhatsapp}
              onChange={(e) => setSellerWhatsapp(e.target.value)}
              placeholder="+231777123456"
              className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            <div className="relative">
              <input
                type="password"
                value={sellerPin}
                onChange={(e) => setSellerPin(e.target.value)}
                placeholder="Seller PIN"
                inputMode="numeric"
                pattern="[0-9]{4,8}"
                maxLength={8}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <div className="absolute right-3 top-full mt-1">
                <ForgotPin sellerWhatsapp={sellerWhatsapp} onSuccess={() => setSellerPin("")} />
              </div>
            </div>
            <button
              onClick={fetchMyListings}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "View My Listings"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {message && !error && (
            <div className="mt-4 flex items-start gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              {message}
            </div>
          )}
        </div>

        {listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <article key={listing.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                <div className="relative h-44 bg-slate-100">
                  <Image
                    src={optimizeCloudinaryUrl(listing.image_urls?.[0] ?? "", 800)}
                    alt={listing.title}
                    fill
                    className={`object-cover ${listing.is_sold ? "opacity-60" : ""}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {listing.is_sold && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-red-500 text-white font-extrabold text-sm px-3 py-1 rounded-lg">
                        SOLD
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-[#002147] line-clamp-1">{listing.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1">{listing.description}</p>
                  <div className="mt-2 text-sm font-semibold text-[#25D366]">{listing.price}</div>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${listing.is_approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {listing.is_approved ? "Approved" : "Pending"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600">{listing.category}</span>
                  </div>

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
                        disabled={!listing.is_approved || actionLoadingId === listing.id}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-xl transition-colors"
                      >
                        {actionLoadingId === listing.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
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
                        title="Create a new listing based on this one"
                      >
                        {actionLoadingId === listing.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            Re-list
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

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
