"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import Navbar from "@/components/Navbar";
import { CATEGORIES, Category, GLOBAL_COUNTRIES } from "@/types";
import { Upload, Loader2, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, X, ImagePlus } from "lucide-react";

const SELL_CATEGORIES = CATEGORIES.filter((c) => c !== "All") as Category[];
const STEPS = ["Details", "Photos", "Confirm"];

export default function SellPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    seller_whatsapp: "",
    seller_pin: "",
    seller_pin_confirm: "",
    location: "United States",
    is_negotiable: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [sellerSession, setSellerSession] = useState<{
    seller_whatsapp: string;
    seller_pin: string;
  } | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("sellerSession");
      if (session) {
        try {
          const parsed = JSON.parse(session);
          if (parsed.seller_whatsapp && parsed.seller_pin) {
            setSellerSession(parsed);
            setForm((prev) => ({
              ...prev,
              seller_whatsapp: parsed.seller_whatsapp,
              seller_pin: parsed.seller_pin,
              seller_pin_confirm: parsed.seller_pin,
            }));
          }
        } catch {}
      }
    }
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - imageFiles.length;
    if (files.length > remainingSlots) {
      setError(`You can upload up to 5 images. You can add ${remainingSlots} more.`);
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

  const validateStep = (step: number): boolean => {
    setError(null);
    switch (step) {
      case 0: // Details
        if (!form.title.trim()) {
          setError("Please enter a title for your listing.");
          return false;
        }
        if (!form.price.trim()) {
          setError("Please enter a price.");
          return false;
        }
        if (!sellerSession) {
          if (!/^\+?[0-9]{7,15}$/.test(form.seller_whatsapp.replace(/\s/g, ""))) {
            setError("Enter a valid WhatsApp number with country code (e.g. +231777123456).");
            return false;
          }
          if (!/^\d{4,8}$/.test(form.seller_pin.trim())) {
            setError("Seller PIN must be 4 to 8 digits.");
            return false;
          }
          if (form.seller_pin.trim() !== form.seller_pin_confirm.trim()) {
            setError("PIN confirmation does not match.");
            return false;
          }
        }
        return true;
      case 1: // Photos
        if (imageFiles.length === 0) {
          setError("Please select at least one photo of your item.");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(1)) return;
    setError(null);
    setSubmitting(true);

    let waClean = form.seller_whatsapp.replace(/\s/g, "");
    let pin = form.seller_pin.trim();

    if (sellerSession) {
      waClean = sellerSession.seller_whatsapp;
      pin = sellerSession.seller_pin;
    }

    try {
      const imageUrls = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)));
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || null,
          price: form.price.trim(),
          category: form.category,
          seller_whatsapp: waClean,
          seller_pin: pin,
          image_urls: imageUrls,
          location: form.location,
          is_negotiable: form.is_negotiable,
        }),
      });

      const payload = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? "Failed to create listing.");

      if (!sellerSession) {
        localStorage.setItem("sellerSession", JSON.stringify({ seller_whatsapp: waClean, seller_pin: pin }));
      }
      setSuccess(true);
      setTimeout(() => {
        router.push(`/sell/success?title=${encodeURIComponent(form.title.trim())}`);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-24 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#25D366] rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Listing Submitted!</h2>
          <p className="text-slate-500">Redirecting to success page...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Progress Steps */}
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-[#25D366] text-white shadow-lg shadow-green-500/30"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${
                    index <= currentStep ? "text-[#002147]" : "text-slate-400"
                  }`}>
                    {step}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 transition-all duration-300 ${
                    index < currentStep ? "bg-[#25D366]" : "bg-slate-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 animate-fade-in">
          <h1 className="text-2xl font-extrabold text-[#002147] mb-1">
            Post a Listing
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {currentStep === 0 && "Tell us about your item"}
            {currentStep === 1 && "Upload photos of your item"}
            {currentStep === 2 && "Review and submit your listing"}
          </p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm animate-slide-down">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 0: Details */}
            {currentStep === 0 && (
              <div className="space-y-5 animate-fade-in">
                {sellerSession && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                    <b>Logged in as:</b> {sellerSession.seller_whatsapp}
                    <button
                      type="button"
                      className="block text-xs text-red-600 underline mt-1 w-fit"
                      onClick={() => {
                        localStorage.removeItem("sellerSession");
                        setSellerSession(null);
                        setForm((prev) => ({
                          ...prev,
                          seller_whatsapp: "",
                          seller_pin: "",
                          seller_pin_confirm: "",
                        }));
                      }}
                    >
                      Log out / Switch account
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Description <span className="text-slate-400">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Describe the item's condition, age, features..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      placeholder="e.g. L$2,500 or $15"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all bg-white"
                    >
                      {SELL_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all bg-white"
                  >
                    {GLOBAL_COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {!sellerSession && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Your WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="seller_whatsapp"
                        value={form.seller_whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="+231777123456"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                      />
                      <p className="text-xs text-slate-400 mt-1">Buyers will contact you directly on WhatsApp.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Seller PIN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="seller_pin"
                          value={form.seller_pin}
                          onChange={handleChange}
                          required
                          inputMode="numeric"
                          pattern="[0-9]{4,8}"
                          minLength={4}
                          maxLength={8}
                          placeholder="4-8 digits"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          Confirm PIN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          name="seller_pin_confirm"
                          value={form.seller_pin_confirm}
                          onChange={handleChange}
                          required
                          inputMode="numeric"
                          pattern="[0-9]{4,8}"
                          minLength={4}
                          maxLength={8}
                          placeholder="Repeat PIN"
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 1: Photos */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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

                {imageFiles.length < 5 && (
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="cursor-pointer border-2 border-dashed rounded-2xl flex flex-col items-center justify-center h-48 sm:h-56 transition-all duration-200 bg-slate-50 hover:bg-slate-100 hover:border-[#25D366] border-slate-300"
                  >
                    <ImagePlus className="w-10 h-10 text-slate-400 mb-2" />
                    <p className="text-slate-500 text-sm font-medium">
                      {imagePreviews.length > 0 ? "Add more photos" : "Click to upload photos"}
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
            )}

            {/* Step 2: Confirm */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                  <h3 className="font-bold text-[#002147]">Listing Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Title:</span>
                      <span className="font-semibold text-slate-800 text-right max-w-[60%]">{form.title}</span>
                    </div>
                    {form.description && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Description:</span>
                        <span className="text-slate-600 text-right max-w-[60%] line-clamp-2">{form.description}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price:</span>
                      <span className="font-bold text-[#25D366]">{form.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-semibold text-slate-800">{form.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-semibold text-slate-800">{form.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Photos:</span>
                      <span className="font-semibold text-slate-800">{imageFiles.length} uploaded</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Negotiable:</span>
                      <span className={`font-semibold ${form.is_negotiable ? "text-[#25D366]" : "text-slate-400"}`}>
                        {form.is_negotiable ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={form.is_negotiable}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_negotiable: e.target.checked }))}
                    className="w-5 h-5 accent-[#25D366] rounded"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Price is negotiable
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={`mt-6 sm:mt-8 flex ${currentStep > 0 ? "justify-between" : "justify-end"} gap-3`}>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all min-h-[48px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-[#002147] hover:bg-[#003580] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow hover:shadow-lg active:scale-95 min-h-[48px]"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] hover:from-[#1da851] hover:to-[#25D366] disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-green-500/30 active:scale-95 min-h-[48px]"
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
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}