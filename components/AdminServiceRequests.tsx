"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { SERVICE_CATEGORIES } from "@/types";
import {
  Wrench,
  Loader2,
  X,
  CheckCircle,
  MessageCircle,
  Search,
  Clock,
  MapPin,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

type ReqStatus = "open" | "in_progress" | "completed" | "cancelled";
type TabFilter = "open" | "all" | "completed";

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
}

function getCategoryIcon(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.icon ?? "🛠️";
}

interface AdminServiceRequestsProps {
  adminToken: string;
}

export default function AdminServiceRequests({ adminToken }: AdminServiceRequestsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [filter, setFilter] = useState<TabFilter>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetcher = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (filter === "open") query = query.eq("status", "open");
    else if (filter === "completed") query = query.in("status", ["completed", "cancelled"]);
    const { data } = await query;
    setRequests(data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetcher(); }, [fetcher]);

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  async function updateStatus(id: string, status: ReqStatus) {
    setActionId(id);
    const res = await fetch("/api/services/update", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast(`Request marked as ${status}.`);
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function toggleVisibility(id: string, currentVisible: boolean) {
    setActionId(id);
    const res = await fetch("/api/services/update", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id, is_visible: !currentVisible }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_visible: !currentVisible } : r))
      );
      showToast(`Request ${currentVisible ? "hidden" : "shown"}.`);
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function remove(id: string) {
    setActionId(id);
    const res = await fetch("/api/services/update", {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast("Request deleted.");
    } else {
      showToast("Delete failed. Try again.");
    }
    setActionId(null);
  }

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.whatsapp.includes(q) ||
      getCategoryLabel(r.category).toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#002147] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["open", "all", "completed"] as TabFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === t
                ? "bg-[#002147] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {t === "open" ? "Open" : t === "all" ? "All" : "Completed/Cancelled"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search service requests..."
          className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-700">
            {requests.length === 0 ? "No service requests yet." : "No results match your filter."}
          </h2>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 font-medium">
            <span className="font-bold text-[#002147]">{filtered.length}</span> request{filtered.length !== 1 ? "s" : ""}
          </p>

          {filtered.map((req: any) => {
            const busy = actionId === req.id;
            return (
              <div key={req.id} className="bg-white rounded-2xl shadow-md p-4 border border-slate-100">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Image preview */}
                      {req.image_urls && req.image_urls.length > 0 && (
                        <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden mb-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={req.image_urls[0]}
                            alt={req.title}
                            className="w-full h-full object-cover"
                          />
                          {req.image_urls.length > 1 && (
                            <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              +{req.image_urls.length - 1}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Header badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-xs font-semibold border border-slate-200">
                        {getCategoryIcon(req.category)} {getCategoryLabel(req.category)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${URGENCY_COLORS[req.urgency] ?? ""}`}>
                        {req.urgency}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "open" ? "bg-green-50 text-green-700" :
                        req.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                        req.status === "completed" ? "bg-slate-50 text-slate-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {req.status}
                      </span>
                      {!req.is_visible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          Hidden
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-[#002147] text-sm leading-tight mb-1">{req.title}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-2">{req.description}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      {req.budget && <span className="font-semibold text-[#25D366]">{req.budget}</span>}
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {req.county || req.city ? [req.city, req.county].filter(Boolean).join(", ") : req.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {req.whatsapp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={`https://wa.me/${req.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1da851] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Contact
                  </a>

                  {req.status === "open" && (
                    <button
                      onClick={() => updateStatus(req.id, "completed")}
                      disabled={busy}
                      className="flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 disabled:opacity-50 text-green-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      Complete
                    </button>
                  )}

                  <button
                    onClick={() => toggleVisibility(req.id, req.is_visible)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                  >
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : req.is_visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {req.is_visible ? "Hide" : "Show"}
                  </button>

                  <button
                    onClick={() => remove(req.id)}
                    disabled={busy}
                    className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ml-auto"
                  >
                    {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}