"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SellerMarkSoldProps {
  listingId: string;
}

export default function SellerMarkSold({ listingId }: SellerMarkSoldProps) {
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [sellerPin, setSellerPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleMarkSold() {
    setError(null);
    const waClean = whatsapp.replace(/\s/g, "");
    const pin = sellerPin.trim();

    if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
      setError("Enter your listing WhatsApp number in correct format.");
      return;
    }

    if (!/^\d{4,8}$/.test(pin)) {
      setError("Enter your seller PIN (4-8 digits).");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/listings/seller-sold", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listingId, seller_whatsapp: waClean, seller_pin: pin }),
      });

      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? "Failed to mark item as sold.");

      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="w-full bg-green-50 border border-green-200 text-green-700 text-center py-3 rounded-xl text-sm font-semibold">
        Item marked as sold.
      </div>
    );
  }

  return (
    <div className="w-full mt-3">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full border border-slate-300 text-slate-600 hover:text-slate-800 hover:border-slate-400 bg-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
        >
          I’m the seller • Mark as Sold
        </button>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
          <label className="block text-xs font-semibold text-slate-600">
            Enter the WhatsApp number and seller PIN used when posting this listing
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+231777123456"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          />
          <input
            type="password"
            value={sellerPin}
            onChange={(e) => setSellerPin(e.target.value)}
            placeholder="Seller PIN"
            inputMode="numeric"
            pattern="[0-9]{4,8}"
            maxLength={8}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleMarkSold}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] disabled:opacity-60 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Confirm Sold"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
