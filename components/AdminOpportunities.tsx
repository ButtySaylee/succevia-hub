"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { Opportunity, OPPORTUNITY_TYPES, GLOBAL_COUNTRIES } from "@/types";
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
  Briefcase,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

type OpportunityFilter = "all" | "job" | "scholarship";

interface AdminOpportunitiesProps {
  adminToken: string;
}

interface OppForm {
  title: string;
  description: string;
  type: string;
  organization: string;
  location: string;
  deadline: string;
  requirements: string;
  application_url: string;
}

const defaultForm: OppForm = {
  title: "",
  description: "",
  type: "job",
  organization: "",
  location: "United States",
  deadline: "",
  requirements: "",
  application_url: "",
};

interface OppStats {
  total: number;
  active: number;
  inactive: number;
}

export default function AdminOpportunities({ adminToken }: AdminOpportunitiesProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filter, setFilter] = useState<OpportunityFilter>("all");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<OppForm>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState<OppStats>({ total: 0, active: 0, inactive: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const authHeader = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${adminToken}`,
  });

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });
    setOpportunities(data ?? []);
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    const [{ count: total }, { count: active }, { count: inactive }] = await Promise.all([
      supabase.from("opportunities").select("*", { count: "exact", head: true }),
      supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("opportunities").select("*", { count: "exact", head: true }).eq("is_active", false),
    ]);
    setStats({ total: total ?? 0, active: active ?? 0, inactive: inactive ?? 0 });
  }, []);

  useEffect(() => {
    fetchOpportunities();
    fetchStats();
  }, [fetchOpportunities, fetchStats]);

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

  function openEdit(opp: Opportunity) {
    setEditId(opp.id);
    setForm({
      title: opp.title,
      description: opp.description,
      type: opp.type,
      organization: opp.organization,
      location: opp.location,
      deadline: opp.deadline ?? "",
      requirements: opp.requirements ?? "",
      application_url: opp.application_url,
    });
    setImageFile(null);
    setImagePreview(opp.image_url);
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

    if (!form.title.trim() || !form.description.trim() || !form.organization.trim() || !form.application_url.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (!editId && !imageFile) {
      setFormError("Please select an image.");
      return;
    }

    setSubmitting(true);
    try {
      let image_url = imagePreview ?? "";

      if (imageFile) {
        setUploading(true);
        image_url = await uploadToCloudinary(imageFile);
        setUploading(false);
      }

      const endpoint = editId ? "/api/opportunities/update" : "/api/opportunities/create";
      const method = editId ? "PATCH" : "POST";
      const body = editId
        ? { id: editId, ...form, image_url }
        : { ...form, image_url };

      const res = await fetch(endpoint, {
        method,
        headers: authHeader(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Request failed.");
      }

      showToast(editId ? "Opportunity updated." : "Opportunity posted!");
      cancelForm();
      fetchOpportunities();
      fetchStats();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong.");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(opp: Opportunity) {
    setActionId(opp.id);
    const res = await fetch("/api/opportunities/toggle-active", {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify({ id: opp.id, is_active: !opp.is_active }),
    });
    if (res.ok) {
      setOpportunities((prev) =>
        prev.map((o) => (o.id === opp.id ? { ...o, is_active: !opp.is_active } : o))
      );
      showToast(opp.is_active ? "Opportunity deactivated." : "Opportunity activated.");
      fetchStats();
    } else {
      showToast("Action failed. Try again.");
    }
    setActionId(null);
  }

  async function deleteOpportunity(id: string) {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;
    setActionId(id);
    const res = await fetch("/api/opportunities/delete", {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      showToast("Opportunity deleted.");
      fetchStats();
    } else {
      showToast("Delete failed. Try again.");
    }
    setActionId(null);
  }

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
          { label: "Active", value: stats.active, color: "text-[#25D366]" },
          { label: "Inactive", value: stats.inactive, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-3 shadow-sm text-center">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#002147]">Opportunities</h2>
        <div className="flex gap-2">
          <button
            onClick={() => { fetchOpportunities(); fetchStats(); }}
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
            Post Opportunity
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(['all', 'job', 'scholarship'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-white text-[#002147] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f === 'job' ? <Briefcase className="w-3.5 h-3.5" /> : f === 'scholarship' ? <GraduationCap className="w-3.5 h-3.5" /> : null}
            {f === 'all' ? 'All Opportunities' : f === 'job' ? 'Jobs' : 'Scholarships'}
          </button>
        ))}
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#002147] text-sm">
              {editId ? "Edit Opportunity" : "Post New Opportunity"}
            </h3>
            <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Type */}
            <div className="flex gap-3">
              {OPPORTUNITY_TYPES.map((t) => (
                <label
                  key={t}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all ${
                    form.type === t
                      ? "border-[#002147] bg-[#002147] text-white"
                      : "border-slate-200 text-slate-500 hover:border-[#002147]"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="sr-only"
                  />
                  {t === "job" ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  {t === "job" ? "Job" : "Scholarship"}
                </label>
              ))}
            </div>

            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title *"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            <input
              value={form.organization}
              onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
              placeholder="Organization / Company *"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description *"
              rows={4}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
            />

            <textarea
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder="Requirements / Eligibility (optional)"
              rows={3}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
              >
                {GLOBAL_COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <input
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                placeholder="Deadline (e.g. April 30, 2025)"
                className="border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>

            <input
              value={form.application_url}
              onChange={(e) => setForm((f) => ({ ...f, application_url: e.target.value }))}
              placeholder="Application URL * (https://...)"
              type="url"
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />

            {/* Image upload */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">
                Image {editId ? "(upload to replace)" : "*"}
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
                    {editId ? "Save Changes" : "Post Opportunity"}
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

      {/* Opportunities list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-700">No opportunities yet</h2>
          <p className="text-slate-400 text-sm mt-1">Post a job or scholarship opportunity above.</p>
        </div>
      ) : (
        <div>
          {(() => {
            const filtered = filter === 'all' ? opportunities : opportunities.filter(o => o.type === filter);
            
            if (filtered.length === 0) {
              return (
                <div className="text-center py-20">
                  {filter === 'job' ? <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" /> : <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />}
                  <h2 className="text-lg font-bold text-slate-700">
                    No {filter === 'job' ? 'jobs' : 'scholarships'} yet
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Start by posting a {filter === 'job' ? 'job' : 'scholarship'} opportunity.
                  </p>
                </div>
              );
            }
            
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((opp) => {
                  const busy = actionId === opp.id;
                  return (
                    <div
                      key={opp.id}
                      className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-all ${
                        !opp.is_active ? "opacity-60" : ""
                      }`}
                    >
                <div className="relative h-40 bg-slate-100">
                  <Image src={opp.image_url} alt={opp.title} fill className="object-cover" />
                  <span
                    className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      opp.is_active ? "bg-[#25D366] text-white" : "bg-slate-400 text-white"
                    }`}
                  >
                    {opp.is_active ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      opp.type === "job" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {opp.type}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-1.5">
                  <h3 className="font-bold text-[#002147] text-sm leading-tight line-clamp-2">
                    {opp.title}
                  </h3>
                  <p className="text-slate-500 text-xs">{opp.organization}</p>
                  <p className="text-slate-400 text-xs line-clamp-2 flex-1">{opp.description}</p>
                  {opp.deadline && (
                    <p className="text-xs text-amber-600 font-medium">Deadline: {opp.deadline}</p>
                  )}
                  <p className="text-[10px] text-slate-300">
                    {new Date(opp.created_at).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 mt-1">
                    <button
                      onClick={() => openEdit(opp)}
                      disabled={busy}
                      className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(opp)}
                      disabled={busy}
                      className={`flex items-center justify-center gap-1 disabled:opacity-50 text-xs font-semibold py-2 rounded-xl transition-all ${
                        opp.is_active
                          ? "bg-amber-50 hover:bg-amber-100 text-amber-600"
                          : "bg-green-50 hover:bg-green-100 text-green-600"
                      }`}
                    >
                      {busy ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : opp.is_active ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                      {opp.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteOpportunity(opp.id)}
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
            );
          })()}
        </div>
      )}
    </div>
  );
}
