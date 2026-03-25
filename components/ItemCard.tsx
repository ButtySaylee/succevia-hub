"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Tag, MapPin, Share2, Check, Images } from "lucide-react";
import { Listing } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { trackEvent } from "@/components/GoogleAnalytics";

interface ItemCardProps {
  listing: Listing;
  isNew?: boolean;
}

const categoryColors: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-700",
  Vehicles: "bg-orange-100 text-orange-700",
  Fashion: "bg-pink-100 text-pink-700",
  Property: "bg-purple-100 text-purple-700",
  Home: "bg-teal-100 text-teal-700",
};

export default function ItemCard({ listing, isNew }: ItemCardProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      {/* Clickable area — image + details */}
      <Link href={`/listings/${listing.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
          <Image
            src={optimizeCloudinaryUrl(listing.image_urls[0], 800)}
            alt={listing.title}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              listing.is_sold ? "opacity-60" : ""
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {listing.is_sold && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-500 text-white font-extrabold text-lg px-4 py-1.5 rounded-xl rotate-[-8deg] shadow-lg">
                SOLD
              </span>
            </div>
          )}
          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
              categoryColors[listing.category] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            <Tag className="w-3 h-3" />
            {listing.category}
          </span>
          {isNew && !listing.is_sold && (
            <span className="absolute top-2 right-2 bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
              New
            </span>
          )}
          {listing.image_urls.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Images className="w-3 h-3" />
              {listing.image_urls.length}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-base leading-tight line-clamp-2 mb-1">
            {listing.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-2 flex-1">
            {listing.description}
          </p>
          {listing.location && (
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
              <MapPin className="w-3 h-3" />
              {listing.location}
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-extrabold text-[#25D366]">
              {listing.price}
            </span>
            {listing.is_negotiable && (
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Negotiable
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons — outside Link to avoid nested <a> */}
      <div className="px-4 pb-4 flex gap-2">
        {listing.is_sold ? (
          <div className="flex-1 flex items-center justify-center text-sm font-semibold text-slate-400 bg-slate-100 py-2.5 rounded-xl">
            Item Sold
          </div>
        ) : (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow"
          >
            <MessageCircle className="w-4 h-4" />
            Chat with Seller
          </a>
        )}
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors shrink-0"
          title="Share listing"
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
