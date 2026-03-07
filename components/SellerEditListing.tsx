"use client";

import { useState } from "react";
import { Listing, CATEGORIES } from "@/types";
import { Loader2, Save, X } from "lucide-react";

interface SellerEditListingProps {
  listing: Listing;
  sellerWhatsapp: string;
  sellerPin: string;
  onSuccess: (updated: Listing) => void;
  onCancel: () => void;
}

const SELL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

export default function SellerEditListing({
  listing,
  sellerWhatsapp,
  sellerPin,
  onSuccess,
  onCancel,
}: SellerEditListingProps) {
  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price);
  const [category, setCategory] = useState(listing.category);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!price.trim()) {
      setError("Price is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/listings/seller-update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: listing.id,
          seller_whatsapp: sellerWhatsapp,
          seller_pin: sellerPin,
          title: title.trim(),
          description: description.trim(),
          price: price.trim(),
          category,
        }),
      });

      const data = (await res.json()) as { listing?: Listing; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to update listing");

      onSuccess(data.listing!);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-[#002147] text-white px-6 py-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold">Edit Listing</h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#002147] mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#002147] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] disabled:opacity-50 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#002147] mb-1">
                Price
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
                placeholder="LD 100"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#002147] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] disabled:opacity-50 bg-white"
              >
                {SELL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
