"use client";

import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import { SERVICE_CATEGORIES, LIBERIA_COUNTIES, LIBERIA_CITIES } from "@/types";
import { Wrench, Send, Loader2, AlertCircle, ChevronLeft, ImagePlus, X } from "lucide-react";
import Link from "next/link";
import imageCompression from "browser-image-compression";

export default function RequestServicePage() {
  const fileRef = useRef<HTMLInputElement>(null);
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - imageFiles.length;
    if (files.length > remainingSlots) {
      setError(`You can upload up to 3 images. You can add ${remainingSlots} more.`);
      return;
    }

    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setError("All images must be under 5 MB.");
      return;
    }

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError(null);

    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type as "image/jpeg" | "image/png" | "image/webp",
    };
    const compressedFile = await imageCompression(file, options);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const fd = new FormData();
    fd.append("file", compressedFile);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Image upload failed. Please try again.");
    const data = await res.json();
    return data.secure_url as string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!form.title.trim()) { setError("Please enter a title for your request."); return; }
    if (!form.description.trim()) { setError("Please describe what you need."); return; }
    if (!form.whatsapp.trim()) { setError("Please enter your WhatsApp number."); return; }

    setSubmitting(true);

    try {
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        imageUrls = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)));
      }

      const res = await fetch("/api/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          budget: form.budget.trim() || null,
          country: form.country,
          county: form.county,
          city: form.city,
          service_mode: form.service_mode,
          urgency: form.urgency,
          whatsapp: form.whatsapp.trim(),
          name: form.name.trim() || null,
          image_urls: imageUrls,
        }),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Failed to submit request.");

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Photos <span className="text-slate-400">(Optional - up to 3)</span>
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-xl border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageFiles.length < 3 && (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed rounded-2xl flex flex-col items-center justify-center h-32 sm:h-40 transition-all duration-200 bg-slate-50 hover:bg-slate-100 hover:border-[#25D366] border-slate-300"
                >
                  <ImagePlus className="w-8 h-8 text-slate-400 mb-1" />
                  <p className="text-slate-500 text-xs font-medium">
                    {imagePreviews.length > 0 ? "Add more photos" : "Click to upload photos"}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    JPG, PNG or WEBP · max 5 MB each
                  </p>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
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