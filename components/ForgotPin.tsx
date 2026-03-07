"use client";

import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react";

interface ForgotPinProps {
  sellerWhatsapp: string;
  onSuccess?: () => void;
}

export default function ForgotPin({ sellerWhatsapp, onSuccess }: ForgotPinProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleRequest() {
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/listings/request-pin-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_whatsapp: sellerWhatsapp,
          reason: reason.trim(),
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to submit request");
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setReason("");
        onSuccess?.();
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline"
      >
        Forgot PIN?
      </button>
    );
  }

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Request sent!</p>
            <p className="text-xs text-emerald-600 mt-1">
              Admin will review and approve or deny your request.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
      <label className="block text-xs font-semibold text-slate-600">
        Why do you need to reset your PIN?
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g., I forgot my PIN"
        rows={3}
        maxLength={200}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
      />
      <p className="text-xs text-slate-400">{reason.length}/200</p>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-2">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p className="text-xs">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleRequest}
          disabled={busy || !reason.trim()}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#002147] hover:bg-[#003580] disabled:opacity-60 text-white font-semibold py-2 rounded-lg text-xs transition-colors"
        >
          {busy ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Lock className="w-3 h-3" />
              Request Reset
            </>
          )}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setReason("");
            setError(null);
          }}
          className="px-3 py-2 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
