"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

interface ResetPinPageProps {
  resetToken: string;
}

export default function ResetPinPage({ resetToken }: ResetPinPageProps) {
  const router = useRouter();
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSetNewPin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^\d{4,8}$/.test(newPin)) {
      setError("PIN must be 4 to 8 digits");
      return;
    }

    if (newPin !== newPinConfirm) {
      setError("PIN confirmation does not match");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/listings/set-new-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reset_token: resetToken,
          new_pin: newPin,
          new_pin_confirm: newPinConfirm,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to reset PIN");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#002147] mb-2">
            PIN Reset Complete!
          </h1>
          <p className="text-slate-600 text-sm mb-6">
            Your PIN has been successfully reset. Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#002147] rounded-full mb-4">
          <KeyRound className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#002147] mb-2">
          Set New PIN
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Your PIN reset has been approved. Create a new 4-8 digit PIN below.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-6">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSetNewPin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              New PIN <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]{4,8}"
              minLength={4}
              maxLength={8}
              placeholder="4-8 digits"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirm PIN <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={newPinConfirm}
              onChange={(e) => setNewPinConfirm(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]{4,8}"
              minLength={4}
              maxLength={8}
              placeholder="Repeat PIN"
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting PIN...
              </>
            ) : (
              "Set New PIN"
            )}
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Once reset, you&apos;ll need this PIN along with your WhatsApp number to manage listings.
        </p>
      </div>
    </div>
  );
}
