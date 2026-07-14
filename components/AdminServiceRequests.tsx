"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { SERVICE_CATEGORIES } from "@/types";
import {
  Plus,
  Trash2,
  Loader2,
  Pencil,
  X,
  Save,
  Upload,
  Eye,
  EyeOff,
  Wrench,
  RefreshCw,
  Search,
  Clock,
  MapPin,
  MessageCircle,
} from "lucide-react";

type ReqStatus = "open" | "in_progress" | "completed" | "cancelled";
type TabFilter = "open" | "all" | "completed";
type ServiceMode = "online" | "in_person" | "both";

interface AdminServiceRequestsProps {
  adminToken: string;
}

interface ServiceReqForm {
  title: string;
  description: string;
  category: string;
  budget: string;
  country: string;
  county: string;
  city: string;
  service_mode: ServiceMode;
  urgency: string;
  whatsapp: string;
  name: string;
  status: ReqStatus;
  is_visible: boolean;
}

interface ReqStats {
  total: number;
  open: number;
  visible: number;
}

const defaultForm: ServiceReqForm = {
  title: "",
  description: "",
  category: "other",
  budget: "",
  country: "Liberia",
  county: "",
  city: "",
  service_mode: "both",
  urgency: "medium",
  whatsapp: "",
  name: "",
  status: "open",
  is_visible: true,
};

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

const URGENCY_OPTIONS = ["low", "medium", "high", "urgent"];

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
}

function getCategoryIcon(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.icon ?? "🛠️";
}

function getUserName(req: any): string | null {
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (parsed.n) return parsed.n;
    } catch {}
  }
  return req.name || null;
}

function getImageUrlsFromNameField(req: any): string[] {
  if (req.image_urls && Array.isArray(req.image_urls) && req.image_urls.length > 0) {
    return req.image_urls;
  }
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      if (parsed.i && Array.isArray(parsed.i)) return parsed.i;
    } catch {}
  }
  return [];
}

export default function AdminServiceRequests({ adminToken }: AdminServiceRequestsProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState<TabFilter>("open");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceReqForm>(defaultForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState<ReqStats>({ total: 0, open: 0, visible: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  const fetchRequests = useCallback(async () => {
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

  const fetchStats = useCallback(async () => {
    const [{ count: total }, { count: open }, { count: visible }] = await Promise.all([
      supabase.from("service_requests").select("*", { count: "exact", head: true }),
      supabase.from("service_requests").select("*", { count: "exact", head: true }).eq("status", "open"),
      supabase.from("service_requests").select("*", { count: "exact", head: true }).eq("is_visible", true),
    ]);
    setStats({ total: total ?? 0, open: open ?? 0, visible: visible ?? 0 });
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [fetchRequests, fetchStats]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be under 5 MB.");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
    });
    const fd = new FormData();
    fd.append("file", compressed);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Image upload failed.");
    const data = await res.json();
    return data.secure_url as string;
  }

  function openCreate() {
    setEditId(null);
    setForm(defaultForm);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(req: any) {
    setEditId(req.id);
    setForm({
      title: req.title,
      description: req.description ?? "",
      category: req.category ?? "other",
      budget: req.budget ?? "",
      country: req.country ?? "Liberia",
      county: req.county ?? "",
      city: req.city ?? "",
      service_mode: req.service_mode ?? "both",
      urgency: req.urgency ?? "medium",
      whatsapp: req.whatsapp ?? "",
      name: getUserName(req) ?? "",
      status: req.status ?? "open",
      is_visible: req.is_visible ?? true,
    });
    setImageFile(null);
    setImagePreview(getImageUrlsFromNameField(req)?.[0] ?? null);
    setFormError(null);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm(defaultForm);
    if (imagePreview && imageFile) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!form.title.trim() || !form.description.trim() || !form.whatsapp.trim()) {
      setFormError("Please fill in all required fields (title, description, WhatsApp).");
      return;
    }

    setSubmitting(true);
    try {
      let imageUrls: string[] = [];

      if (imageFile) {
        setUploading(true);
        const url = await uploadToCloudinary(imageFile);
        setUploading(false);
        imageUrls = [url];
      } else if (editId) {
        // Preserve existing image_urls from the name field
        const existingReq = requests.find(r => r.id === editId);
        if (existingReq) {
          imageUrls = getImageUrlsFromNameField(existingReq);
        }
      }

      const payload: any = {
        ...form,
        image_urls: imageUrls,
      };

      if (editId) {
        payload.id = editId;
        payload.nameExisting = requests.find(r => r.id === editId)?.name || null;
      }

      const endpoint = editId ? "/api/services/update" : "/api/services/create";
      const method = editId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: authHeader(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Request failed.");
      }

      showToast(editId ? "Service request updated." : "Service request posted!");
      cancelForm();
      fetchRequests();
      fetchStats();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(req: any) {
    setActionId(req.id);
    const newStatus = req.status === "open" ? "completed" : "open";
    const res = await fetch("/api/services/update", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id: req.id, status: newStatus }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: newStatus } : r))
      );
      showToast(newStatus === "completed" ? "Request marked as completed." : "Request reopened.");
      fetchStats();
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function toggleVisibility(req: any) {
    setActionId(req.id);
    const res = await fetch("/api/services/update", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id: req.id, is_visible: !req.is_visible }),
    });
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, is_visible: !req.is_visible } : r))
      );
      showToast(req.is_visible ? "Request hidden from the public." : "Request made visible.");
      fetchStats();
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function deleteRequest(id: string) {
    if (!confirm("Delete this service request? This cannot be undone.")) return;
    setActionId(id);
    const res = await fetch("/api/services/delete", {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showToast("Service request deleted.");
      fetchStats();
    } else {
      showToast("Delete failed. Try again.");
    }
    setActionId(null);
  }

  // Filter by search
  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      r.whatsapp.includes(q) ||
      getCategoryLabel(r.category).toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#002147] text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-[#002147]" },
          { label: "Open", value: stats.open, color: "text-[#25D366]" },
          { label: "Visible", value: stats.visible, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#002147]">Service Requests</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchRequests(); fetchStats(); }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#002147] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[#002147] hover:bg-[#003580] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Request
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#002147] text-sm">
              {editId ? "Edit Service Request" : "Add Service Request"}
            </h3>
            <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Category + Urgency */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={form.urgency}
                onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
              >
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0).toUpperCase() + u.slice(1)} Urgency
                  </option>
                ))}
              </select>
            </div>

            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title *"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description *"
              rows={3}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <input
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                placeholder="Budget (optional)"
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <select
                value={form.service_mode}
                onChange={(e) => setForm((f) => ({ ...f, service_mode: e.target.value as ServiceMode }))}
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
              >
                <option value="both">Online & In-Person</option>
                <option value="online">Online</option>
                <option value="in_person">In-Person</option>
              </select>
            </div>

            <input
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              placeholder="WhatsApp Number *"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Requester Name (optional)"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                placeholder="Country"
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <input
                value={form.county}
                onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))}
                placeholder="County (optional)"
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City (optional)"
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>

            {/* Image upload */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">
                Image {editId ? "(upload to replace)" : "(optional)"}
              </p>
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageFile) URL.revokeObjectURL(imagePreview);
                      setImageFile(null);
                      setImagePreview(editId ? null : null);
                    }}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                  >
                    <X className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-[#002147] rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 hover:text-[#002147] transition-colors"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-medium">Click to upload image</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {formError && (
              <p className="text-red-500 text-xs bg-red-50 rounded-xl px-3 py-2">{formError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
              >
                {submitting || uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editId ? "Save Changes" : "Add Request"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests list */}
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
          {requests.length === 0 && (
            <p className="text-slate-400 text-sm mt-1">Create one using the button above.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((req: any) => {
            const busy = actionId === req.id;
            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all ${
                  req.status !== "open" ? "opacity-60" : ""
                }`}
              >
                {/* Image */}
                {(() => {
                  const urls = getImageUrlsFromNameField(req);
                  return urls.length > 0 ? (
                    <div className="relative h-40 bg-slate-100">
                      <Image src={urls[0]} alt={req.title} fill className="object-cover" />
                      {urls.length > 1 && (
                        <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          +{urls.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                      <Wrench className="w-12 h-12 text-slate-300" />
                    </div>
                  );
                })()}

                {/* Badges overlay */}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      req.status === "open" ? "bg-[#25D366] text-white" :
                      req.status === "in_progress" ? "bg-blue-500 text-white" :
                      req.status === "completed" ? "bg-slate-400 text-white" :
                      "bg-red-500 text-white"
                    }`}
                  >
                    {req.status}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      req.is_visible ? "bg-[#002147] text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {req.is_visible ? "Public" : "Hidden"}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-1.5">
                  {/* Category + Urgency */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-xs font-semibold border border-slate-200">
                      {getCategoryIcon(req.category)} {getCategoryLabel(req.category)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${URGENCY_COLORS[req.urgency] ?? ""}`}>
                      {req.urgency}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#002147] text-sm leading-tight line-clamp-2">
                    {req.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 flex-1">{req.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    {req.budget && <span className="font-semibold text-[#25D366]">{req.budget}</span>}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.county || req.city ? [req.city, req.county].filter(Boolean).join(", ") : req.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {getUserName(req) && (
                    <p className="text-xs text-slate-400 font-medium">
                      By: {getUserName(req)}
                    </p>
                  )}

                  <a
                    href={`https://wa.me/${req.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#25D366] transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    {req.whatsapp}
                  </a>

                  <p className="text-[10px] text-slate-300">
                    {new Date(req.created_at).toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    <button
                      onClick={() => openEdit(req)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleVisibility(req)}
                      disabled={busy}
                      className={`flex items-center justify-center gap-1 disabled:opacity-50 text-xs font-semibold py-2 rounded-xl transition-all ${
                        req.is_visible
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-600"
                          : "bg-green-50 hover:bg-green-100 text-green-600"
                      }`}
                    >
                      {busy ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : req.is_visible ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {req.is_visible ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => toggleStatus(req)}
                      disabled={busy}
                      className={`flex items-center justify-center gap-1 disabled:opacity-50 text-xs font-semibold py-2 rounded-xl transition-all ${
                        req.status === "open"
                          ? "bg-blue-50 hover:bg-blue-100 text-blue-600"
                          : "bg-green-50 hover:bg-green-100 text-green-600"
                      }`}
                    >
                      {busy ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : req.status === "open" ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {req.status === "open" ? "Close" : "Reopen"}
                    </button>
                    <button
                      onClick={() => deleteRequest(req.id)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      {busy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}