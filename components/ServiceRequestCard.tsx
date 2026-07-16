"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SERVICE_CATEGORIES } from "@/types";
import {
  Wrench,
  MapPin,
  Clock,
  MessageCircle,
  DollarSign,
  Share2,
  Check,
} from "lucide-react";

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  urgent: "bg-red-50 text-red-700",
};

const URGENCY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

function getCategoryLabel(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.label ?? catId;
}

function getCategoryIcon(catId: string): string {
  const found = SERVICE_CATEGORIES.find(c => c.id === catId);
  return found?.icon ?? "🛠️";
}

function getImageUrls(req: any): string[] {
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

function getUserName(req: any): string | null {
  // If name field is a JSON object, extract the 'n' value; if empty, return null
  if (req.name && typeof req.name === "string" && req.name.startsWith("{")) {
    try {
      const parsed = JSON.parse(req.name);
      // Only return the name if it's a non-empty string, not the raw JSON
      if (typeof parsed.n === "string" && parsed.n.trim()) return parsed.n.trim();
      return null;
    } catch {
      return null;
    }
  }
  // Legacy: return name directly only if it's a plain string that's not JSON
  if (typeof req.name === "string" && req.name.startsWith("{")) return null;
  return req.name?.trim() || null;
}

interface ServiceRequestCardProps {
  request: any;
}

export default function ServiceRequestCard({ request: req }: ServiceRequestCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const urls = getImageUrls(req);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/services/requests/${req.id}`;
    if (navigator.share) {
      await navigator.share({ title: req.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col card-hover">
      {/* Clickable area */}
      <Link href={`/services/requests/${req.id}`} className="flex flex-col flex-1" aria-label={`View ${req.title}`}>
        {/* Image */}
        <div className="relative w-full aspect-card bg-slate-100 overflow-hidden">
          {urls.length > 0 && urls[0] && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 shimmer" />
              )}
              <Image
                src={urls[0]}
                alt={req.title}
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                loading="lazy"
              />
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-50 to-slate-100">
              <Wrench className="w-12 h-12 text-slate-300" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Category badge */}
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-sm backdrop-blur-sm bg-white/90">
            <span className="text-base">{getCategoryIcon(req.category)}</span>
            {getCategoryLabel(req.category)}
          </span>

          {/* Urgency badge */}
          <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide shadow-lg ${URGENCY_COLORS[req.urgency] ?? "bg-slate-100 text-slate-600"}`}>
            {URGENCY_LABELS[req.urgency] ?? req.urgency}
          </span>

          {/* Image count */}
          {urls.length > 1 && (
            <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
              +{urls.length - 1}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-sm sm:text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#25D366] transition-colors">
            {req.title}
          </h3>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-3 flex-1 leading-relaxed">
            {req.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-auto pt-2 border-t border-slate-50">
            {req.budget && (
              <span className="flex items-center gap-1 font-semibold text-[#25D366]">
                <DollarSign className="w-3.5 h-3.5" />
                {req.budget}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {req.county || req.city
                ? [req.city, req.county].filter(Boolean).join(", ")
                : req.country}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(req.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>

      {/* Action buttons — outside Link */}
      <div className="px-4 pb-4 flex gap-2">
        <a
          href={`https://wa.me/${req.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
          aria-label={`Contact about ${req.title} on WhatsApp`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all shrink-0 border border-slate-100"
          title="Share request"
          aria-label="Share request"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#25D366]" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}