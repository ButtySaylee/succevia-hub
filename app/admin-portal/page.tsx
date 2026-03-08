"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Listing, CATEGORIES } from "@/types";
import PinResetAdmin from "@/components/PinResetAdmin";
import {
  CheckCircle,
  Trash2,
  Loader2,
  Lock,
  MessageCircle,
  RefreshCw,
  Pencil,
  X,
  Save,
  ShoppingBag,
  Clock,
  TrendingUp,
  Tag,
  RotateCcw,
  Search,
  Key,
} from "lucide-react";

const SELL_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

type Tab = "pending" | "all" | "pin-resets";

interface EditForm {
  title: string;
  description: string;
  price: string;
  category: string;
}

interface Stats {
  total: number;
  pending: number;
  live: number;
  sold: number;
}

const SESSION_KEY = "gbana_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function AdminPortalPage() {
  const [authed, setAuthed] = useState(false);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, live: 0, sold: 0 });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = useCallback(async () => {
    const [
      { count: total },
      { count: pending },
      { count: live },
      { count: sold },
    ] = await Promise.all([
      supabase.from("listings").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("is_approved", false),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("is_approved", true).eq("is_sold", false),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("is_sold", true),
    ]);
    setStats({
      total: total ?? 0,
      pending: pending ?? 0,
      live: live ?? 0,
      sold: sold ?? 0,
    });
  }, []);

  const fetchListings = useCallback(async (activeTab: Tab) => {
    setLoading(true);
    setEditId(null);
    setSelectedIds(new Set());
    let query = supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (activeTab === "pending") query = query.eq("is_approved", false);
    const { data } = await query;
    setListings(data ?? []);
    setLoading(false);
  }, []);

  // Restore session from localStorage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const { expiry, token } = JSON.parse(raw);
        if (expiry > Date.now()) {
          setAuthed(true);
          setAdminToken(token ?? "");
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setSessionRestored(true);
  }, []);

  useEffect(() => {
    if (authed) {
      fetchListings(tab);
      fetchStats();
    }
  }, [authed, tab, fetchListings, fetchStats]);

  const filteredListings = useMemo(
    () =>
      listings.filter((l) => {
        const matchesSearch =
          !searchQuery ||
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat =
          filterCategory === "All" || l.category === filterCategory;
        return matchesSearch && matchesCat;
      }),
    [listings, searchQuery, filterCategory]
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setPwError(false);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwInput }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ expiry: Date.now() + SESSION_DURATION_MS, token })
        );
        setAdminToken(token ?? "");
        setAuthed(true);
        setPwError(false);
      } else {
        setPwError(true);
      }
    } catch (error) {
      setPwError(true);
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setAdminToken("");
    setPwInput("");
  }

  /** Returns the Authorization header for every admin API request. */
  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  function openEdit(l: Listing) {
    setEditId(l.id);
    setEditForm({
      title: l.title,
      description: l.description,
      price: l.price,
      category: l.category,
    });
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function saveEdit(id: string) {
    setActionId(id);
    const res = await fetch("/api/listings/update", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id, ...editForm }),
    });
    if (res.ok) {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...editForm } : l))
      );
      setEditId(null);
      showToast("Listing updated.");
    } else {
      showToast("Update failed. Try again.");
    }
    setActionId(null);
  }

  async function approve(id: string) {
    setActionId(id);
    const res = await fetch("/api/listings/approve", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing approved and live!");
      fetchStats();
    } else {
      showToast("Approval failed. Try again.");
    }
    setActionId(null);
  }

  async function bulkApprove() {
    setBulkBusy(true);
    const ids = Array.from(selectedIds);
    const res = await fetch("/api/listings/bulk-approve", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => !selectedIds.has(l.id)));
      setSelectedIds(new Set());
      showToast(`${ids.length} listing${ids.length !== 1 ? "s" : ""} approved!`);
      fetchStats();
    } else {
      showToast("Bulk approval failed. Try again.");
    }
    setBulkBusy(false);
  }

  async function markSold(id: string) {
    setActionId(id);
    const res = await fetch("/api/listings/sold", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, is_sold: true } : l))
      );
      showToast("Marked as sold.");
      fetchStats();
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function relist(id: string) {
    setActionId(id);
    const res = await fetch("/api/listings/relist", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing moved back to pending.");
      fetchStats();
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function remove(id: string) {
    setActionId(id);
    const res = await fetch("/api/listings/reject", {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing deleted.");
      fetchStats();
    } else {
      showToast("Delete failed. Try again.");
    }
    setActionId(null);
  }

  // ── Session restoring splash ────────────────────────────────────────────────
  if (!sessionRestored) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
      </main>
    );
  }

  // ── Login gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-[#002147] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-extrabold text-[#002147] mb-1">
            Admin Portal
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Gbana Market — Staff only
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] ${
                pwError ? "border-red-400" : "border-slate-300"
              }`}
            />
            {pwError && (
              <p className="text-red-500 text-xs text-left">
                Incorrect password.
              </p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#002147] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#003580] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#002147] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <header className="bg-[#002147] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-white font-extrabold text-lg">Admin Portal</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { fetchListings(tab); fetchStats(); }}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, icon: ShoppingBag, color: "text-[#002147]" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
            { label: "Live", value: stats.live, icon: TrendingUp, color: "text-[#25D366]" },
            { label: "Sold", value: stats.sold, icon: Tag, color: "text-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color} shrink-0`} />
              <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className={`text-xl font-extrabold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 pt-2">
          {(["pending", "all", "pin-resets"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 ${
                tab === t
                  ? "bg-[#002147] text-white"
                  : "text-slate-500 hover:text-[#002147]"
              }`}
            >
              {t === "pin-resets" && <Key className="w-4 h-4" />}
              {t === "pending"
                ? `Pending${stats.pending > 0 ? ` (${stats.pending})` : ""}`
                : t === "all"
                ? "All Listings"
                : "PIN Resets"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* PIN Resets Tab */}
        {tab === "pin-resets" && <PinResetAdmin adminToken={adminToken} />}

        {/* Listings Tabs */}
        {tab !== "pin-resets" && (
          <>
            {/* Search + filter */}
            <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search listings..."
              className="w-full border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk approve toolbar — Pending tab only */}
            {tab === "pending" && filteredListings.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() =>
                  selectedIds.size === filteredListings.length
                    ? setSelectedIds(new Set())
                    : setSelectedIds(new Set(filteredListings.map((l) => l.id)))
                }
                className="text-xs text-slate-500 hover:text-[#002147] font-medium transition-colors"
              >
                {selectedIds.size === filteredListings.length
                  ? "Deselect all"
                  : "Select all"}
              </button>
              {selectedIds.size > 0 && (
                <button
                  onClick={bulkApprove}
                  disabled={bulkBusy}
                  className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-60 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  {bulkBusy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Approve Selected ({selectedIds.size})
                </button>
              )}
            </div>
          )}

            {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <CheckCircle className="w-12 h-12 text-[#25D366] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-700">
                {searchQuery || filterCategory !== "All"
                  ? "No results match your filter."
                  : tab === "pending"
                  ? "All caught up!"
                  : "No listings found."}
              </h2>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4 font-medium">
                <span className="font-bold text-[#002147]">
                  {filteredListings.length}
                </span>{" "}
                listing{filteredListings.length !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((l) => {
                const busy = actionId === l.id;
                const isEditing = editId === l.id;
                const isSelected = selectedIds.has(l.id);

                return (
                  <div
                    key={l.id}
                    className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all ${
                      isSelected ? "ring-2 ring-[#25D366]" : ""
                    }`}
                  >
                    <div
                      className="relative h-44 bg-slate-100 cursor-pointer"
                      onClick={() => tab === "pending" && toggleSelect(l.id)}
                    >
                      <Image
                        src={l.image_urls[0]}
                        alt={l.title}
                        fill
                        className="object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                          l.is_sold
                            ? "bg-red-500 text-white"
                            : l.is_approved
                            ? "bg-[#25D366] text-white"
                            : "bg-amber-400 text-white"
                        }`}
                      >
                        {l.is_sold ? "Sold" : l.is_approved ? "Live" : "Pending"}
                      </span>
                      {tab === "pending" && (
                        <div className="absolute top-2 right-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(l.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 accent-[#25D366] rounded cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-2">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, title: e.target.value }))
                            }
                            placeholder="Title"
                            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, description: e.target.value }))
                            }
                            rows={2}
                            placeholder="Description"
                            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
                          />
                          <input
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, price: e.target.value }))
                            }
                            placeholder="Price"
                            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                          />
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, category: e.target.value }))
                            }
                            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
                          >
                            {SELL_CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => saveEdit(l.id)}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-xl transition-all"
                            >
                              {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              disabled={busy}
                              className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl transition-all"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-[#002147] text-sm leading-tight line-clamp-2">
                            {l.title}
                          </h3>
                          <p className="text-slate-500 text-xs line-clamp-2">
                            {l.description}
                          </p>
                          <div className="flex items-center justify-between text-xs mt-auto pt-2 border-t border-slate-100">
                            <span className="font-extrabold text-[#25D366] text-sm">
                              {l.price}
                            </span>
                            <span className="text-slate-400">{l.category}</span>
                          </div>
                          <a
                            href={`https://wa.me/${l.seller_whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#25D366] transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            {l.seller_whatsapp}
                          </a>
                          <p className="text-[10px] text-slate-300">
                            {new Date(l.created_at).toLocaleString()}
                          </p>

                          {tab === "pending" ? (
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => approve(l.id)}
                                disabled={busy}
                                className="flex-1 flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-50 text-white text-xs font-semibold py-2 rounded-xl transition-all"
                              >
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                Approve
                              </button>
                              <button
                                onClick={() => remove(l.id)}
                                disabled={busy}
                                className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-semibold py-2 rounded-xl transition-all"
                              >
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5 mt-1">
                              <button
                                onClick={() => openEdit(l)}
                                disabled={busy}
                                className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all"
                              >
                                <Pencil className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => remove(l.id)}
                                disabled={busy}
                                className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-semibold py-2 rounded-xl transition-all"
                              >
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                                Delete
                              </button>
                              {!l.is_sold && (
                                <button
                                  onClick={() => markSold(l.id)}
                                  disabled={busy}
                                  className="flex items-center justify-center gap-1 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 text-orange-600 text-xs font-semibold py-2 rounded-xl transition-all"
                                >
                                  {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Tag className="w-3 h-3" />}
                                  Mark Sold
                                </button>
                              )}
                              <button
                                onClick={() => relist(l.id)}
                                disabled={busy}
                                className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 text-blue-600 text-xs font-semibold py-2 rounded-xl transition-all"
                              >
                                {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                                Re-list
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </>
          )}
        </>
        )}
      </div>
    </main>
  );
}
