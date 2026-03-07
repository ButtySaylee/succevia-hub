"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, Category, LIBERIA_LOCATIONS } from "@/types";
import { Upload, Loader2, AlertCircle } from "lucide-react";

const SELL_CATEGORIES = CATEGORIES.filter((c) => c !== "All") as Category[];

export default function SellPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    seller_whatsapp: "",
    location: "Monrovia",
    is_negotiable: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images total
    const remainingSlots = 5 - imageFiles.length;
    if (files.length > remainingSlots) {
      setError(`You can upload up to 5 images. You can add ${remainingSlots} more.`);
      return;
    }

    // Check file sizes
    const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      setError("All images must be under 5 MB.");
      return;
    }

    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImageFiles(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError(null);

    // Reset input so user can select same file again if needed
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!res.ok) throw new Error("Image upload failed. Please try again.");
    const data = await res.json();
    return data.secure_url as string;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (imageFiles.length === 0) {
      setError("Please select at least one photo of your item.");
      return;
    }

    const waClean = form.seller_whatsapp.replace(/\s/g, "");
    if (!/^\+?[0-9]{7,15}$/.test(waClean)) {
      setError("Enter a valid WhatsApp number with country code (e.g. +231777123456).");
      return;
    }

    setSubmitting(true);
    try {
      // Upload all images to Cloudinary
      const imageUrls = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)));
      
      const { error: dbError } = await supabase.from("listings").insert({
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        category: form.category,
        seller_whatsapp: waClean,
        image_urls: imageUrls,
        location: form.location,
        is_negotiable: form.is_negotiable,
      });
      if (dbError) throw new Error(dbError.message);
      router.push(`/sell/success?title=${encodeURIComponent(form.title.trim())}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold text-[#002147] mb-1">
            Post a Listing
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Fill in the details below. Your listing will be reviewed before it
            goes live.
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Item Photos <span className="text-red-500">*</span>
                <span className="text-slate-400 font-normal ml-2 text-xs">
                  ({imageFiles.length}/5)
                </span>
              </label>
              
              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {imageFiles.length < 5 && (
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center h-32 transition-colors bg-slate-50 ${
                    imagePreviews.length > 0
                      ? "border-slate-300 hover:border-[#25D366]"
                      : "border-slate-300 hover:border-[#25D366]"
                  }`}
                >
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <p className="text-slate-500 text-xs">
                    Click to upload {imagePreviews.length > 0 ? "more photos" : "photos"}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    JPG, PNG or WEBP · max 5 MB each · up to 5 photos
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

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={80}
                placeholder="e.g. Samsung Galaxy A15 – Excellent Condition"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                maxLength={500}
                placeholder="Describe the item's condition, age, features..."
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] resize-none"
              />
            </div>

            {/* Price + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. L$2,500 or $15"
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
                >
                  {SELL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-white"
              >
                {LIBERIA_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Your WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="seller_whatsapp"
                value={form.seller_whatsapp}
                onChange={handleChange}
                required
                placeholder="+231777123456"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              />
              <p className="text-xs text-slate-400 mt-1">
                Buyers will contact you directly on WhatsApp.
              </p>
            </div>

            {/* Negotiable */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_negotiable}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_negotiable: e.target.checked }))
                }
                className="w-4 h-4 accent-[#25D366] rounded"
              />
              <span className="text-sm font-semibold text-slate-700">
                Price is negotiable
              </span>
            </label>

            {/* Fee notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <strong>Listing fee:</strong> LRD 100 / USD 0.50 — payment
              details will be sent to your WhatsApp after submission.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Listing"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
