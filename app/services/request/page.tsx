"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { SERVICE_CATEGORIES, LIBERIA_COUNTIES, LIBERIA_CITIES } from "@/types";
import { Wrench, Send, Loader2, AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RequestServicePage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "tech-support",
    budget: "",
    country: "Liberia",
    county: "",
    city: "",
    service_mode: "both" as "online" | "in_person" | "both",
    urgency: "medium" as "low" | "medium" | "high" | "urgent",
    whatsapp: "",
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.title.trim()) { setError("Please enter a title for your request."); return; }
    if (!form.description.trim()) { setError("Please describe what you need."); return; }
    if (!form.whatsapp.trim()) { setError("Please enter your WhatsApp number."); return; }

    setSubmitting(true);
    // Future: API call to create service request
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1500);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#25D366] rounded-full mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#002147] mb-2">Request Submitted!</h2>
          <p className="text-slate-500 text-sm mb-6">Professionals will contact you soon with quotations.</p>
          <Link href="/services" className="text-[#25D366] font-semibold text-sm hover:underline">
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link href="/services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#002147] mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Services
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-[#25D366]/10 rounded-xl">
              <Wrench className="w-6 h-6 text-[#25D366]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#002147]">Request a Service</h1>
              <p className="text-slate-500 text-sm">Describe what you need and get quotations</p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm animate-slide-down">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. I need my laptop repaired" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe what you need in detail..." className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]">
                  {SERVICE_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Budget</label>
                <input type="text" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. L$5,000" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">County</label>
                <select name="county" value={form.county} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]">
                  <option value="">Select County</option>
                  {LIBERIA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <select name="city" value={form.city} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]">
                  <option value="">Select City</option>
                  {LIBERIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Service Mode</label>
                <select name="service_mode" value={form.service_mode} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]">
                  <option value="both">Online or In-Person</option>
                  <option value="online">Online Only</option>
                  <option value="in_person">In-Person Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Urgency</label>
                <select name="urgency" value={form.urgency} onChange={handleChange} className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your WhatsApp Number *</label>
              <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+231777123456" className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]" required />
            </div>

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-60">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit Request</>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}