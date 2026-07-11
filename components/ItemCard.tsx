"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Tag, MapPin, Share2, Check, Images, Clock, Shield } from "lucide-react";
import { Listing } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { trackEvent } from "@/components/GoogleAnalytics";

interface ItemCardProps {
  listing: Listing;
  isNew?: boolean;
}

const categoryColors: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-700 border-blue-200",
  Vehicles: "bg-orange-100 text-orange-700 border-orange-200",
  Fashion: "bg-pink-100 text-pink-700 border-pink-200",
  Property: "bg-purple-100 text-purple-700 border-purple-200",
  Home: "bg-teal-100 text-teal-700 border-teal-200",
};

export default function ItemCard({ listing, isNew }: ItemCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const waMessage = encodeURIComponent(
    `Hello, I saw your ${listing.title} on Succevia Hub. Is it still available?`
  );
  const waLink = `https://wa.me/${listing.seller_whatsapp}?text=${waMessage}`;

  function handleWhatsAppClick() {
    trackEvent("contact_seller", {
      listing_id: listing.id,
      listing_title: listing.title,
      category: listing.category,
      price: listing.price,
    });
  }

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${listing.id}`;
    if (navigator.share) {
      await navigator.share({ title: listing.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const timeAgo = (date: string) => {
    const now = Date.now();
    const diff = now - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  const categoryClass = categoryColors[listing.category] ?? "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col card-hover">
      {/* Clickable area — image + details */}
      <Link href={`/listings/${listing.id}`} className="flex flex-col flex-1" aria-label={`View ${listing.title}`}>
        {/* Image */}
        <div className="relative w-full aspect-card bg-slate-100 overflow-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className="text-center">
                <div className="text-4xl mb-2">🛍️</div>
                <p className="text-xs text-slate-400">{listing.category}</p>
              </div>
            </div>
          ) : (
            <>
              {imageLoading && (
                <div className="absolute inset-0 shimmer" />
              )}
              <Image
                src={optimizeCloudinaryUrl(listing.image_urls[0], 600)}
                alt={listing.title}
                fill
                className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                  listing.is_sold ? "opacity-60" : ""
                } ${imageLoading ? "opacity-0" : "opacity-100"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                loading="lazy"
              />
            </>
          )}
          
          {/* Gradient overlay at bottom for better text readability */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

          {/* SOLD Badge */}
          {listing.is_sold && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-500 text-white font-extrabold text-lg px-5 py-1.5 rounded-xl rotate-[-12deg] shadow-lg tracking-wide">
                SOLD
              </span>
            </div>
          )}

          {/* Category Badge */}
          <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-sm backdrop-blur-sm bg-white/90 ${listing.is_sold ? '' : ''}`}>
            <Tag className="w-3 h-3" />
            {listing.category}
          </span>

          {/* New Badge */}
          {isNew && !listing.is_sold && (
            <span className="absolute top-2.5 right-2.5 bg-[#25D366] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-lg badge-pulse">
              New
            </span>
          )}

          {/* Image Count */}
          {listing.image_urls.length > 1 && (
            <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 backdrop-blur-sm">
              <Images className="w-3 h-3" />
              {listing.image_urls.length}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-sm sm:text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#25D366] transition-colors">
            {listing.title}
          </h3>
          
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-2 flex-1 leading-relaxed">
            {listing.description}
          </p>
          
          {listing.location && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{listing.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold text-[#25D366] tracking-tight">
                {listing.price}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(listing.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {listing.is_negotiable && (
                <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                  Negotiable
                </span>
              )}
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" />
                Safe
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action buttons — outside Link to avoid nested <a> */}
      <div className="px-4 pb-4 flex gap-2">
        {listing.is_sold ? (
          <div className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 bg-slate-50 py-2.5 rounded-xl border border-slate-100">
            <Check className="w-4 h-4" />
            Item Sold
          </div>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
            aria-label={`Contact seller about ${listing.title} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>
        )}
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all shrink-0 border border-slate-100"
          title="Share listing"
          aria-label="Share listing"
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