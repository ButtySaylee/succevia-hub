"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, XCircle, Clock, MessageCircle, Copy } from "lucide-react";

interface PinResetRequest {
  id: string;
  listing_id: string;
  seller_whatsapp: string;
  reason: string;
  status: "pending" | "approved" | "denied" | "completed";
  reset_token: string;
  requested_at: string;
  approved_at: string | null;
}

interface PinResetAdminProps {
  adminPassword: string;
}

export default function PinResetAdmin({ adminPassword }: PinResetAdminProps) {
  const [requests, setRequests] = useState<PinResetRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("pin_reset_requests")
      .select("*")
      .order("requested_at", { ascending: false });

    setRequests((data ?? []) as PinResetRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchRequests]);

  async function handleApproveOrDeny(
    requestId: string,
    action: "approve" | "deny"
  ) {
    setActionId(requestId);
    try {
      const res = await fetch("/api/listings/approve-pin-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: requestId,
          action,
          admin_password: adminPassword,
        }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data?.error ?? "Failed to process request");

      showToast(
        `PIN reset request ${action === "approve" ? "approved" : "denied"}`
      );
      await fetchRequests();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setActionId(null);
    }
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-[#002147]">{pendingCount}</div>
          <div className="text-xs text-slate-500">Pending</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-emerald-600">
            {approvedCount}
          </div>
          <div className="text-xs text-slate-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <CheckCircle2 className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
          <div className="text-xs text-slate-500">Completed</div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white rounded-lg px-4 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-slate-500 text-sm">No PIN reset requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow p-4 border-l-4"
              style={{
                borderColor:
                  req.status === "pending"
                    ? "#f59e0b"
                    : req.status === "approved"
                      ? "#10b981"
                      : req.status === "denied"
                        ? "#ef4444"
                        : "#3b82f6",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-[#002147]">
                      {req.seller_whatsapp}
                    </p>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        req.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : req.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : req.status === "denied"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  {req.reason && (
                    <p className="text-sm text-slate-600 mb-2">&quot;{req.reason}&quot;</p>
                  )}
                  <p className="text-xs text-slate-400">
                    Requested:{" "}
                    {new Date(req.requested_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {req.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApproveOrDeny(req.id, "approve")}
                      disabled={actionId === req.id}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      {actionId === req.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproveOrDeny(req.id, "deny")}
                      disabled={actionId === req.id}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      {actionId === req.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      Deny
                    </button>
                  </div>
                )}

                {req.status === "approved" && (
                  <div className="ml-4 flex flex-col gap-2">
                    <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-2 rounded-lg max-w-sm">
                      <span className="block text-slate-600 font-semibold mb-1">
                        Reset Link:
                      </span>
                      <span className="break-all">
                        {typeof window !== "undefined"
                          ? `${window.location.origin}/reset-pin?token=${req.reset_token}`
                          : `/reset-pin?token=${req.reset_token}`}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* WhatsApp Send Button */}
                      <a
                        href={`https://wa.me/${req.seller_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi! Your PIN reset has been approved. Click the link below to set your new PIN:\n\n${
                            typeof window !== "undefined"
                              ? `${window.location.origin}/reset-pin?token=${req.reset_token}`
                              : `/reset-pin?token=${req.reset_token}`
                          }\n\nThis link is single-use only. If you have any issues, contact support.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        title="Send link via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Send via WhatsApp
                      </a>

                      {/* Copy Link Button */}
                      <button
                        onClick={() => {
                          const link =
                            typeof window !== "undefined"
                              ? `${window.location.origin}/reset-pin?token=${req.reset_token}`
                              : `/reset-pin?token=${req.reset_token}`;
                          navigator.clipboard.writeText(link);
                          showToast("Link copied to clipboard!");
                        }}
                        className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                        title="Copy link to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Click WhatsApp button or copy link to share with seller
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
