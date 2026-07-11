"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ExternalLink, Share2, Check, Building2, Clock, Award } from "lucide-react";
import { Opportunity } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isNew?: boolean;
}

const typeStyles: Record<string, string> = {
  job: "bg-blue-50 text-blue-700 border-blue-200",
  scholarship: "bg-purple-50 text-purple-700 border-purple-200",
};

const typeLabels: Record<string, string> = {
  job: "Job",
  scholarship: "Scholarship",
};

export default function OpportunityCard({ opportunity, isNew }: OpportunityCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/opportunities/${opportunity.id}`;
    if (navigator.share) {
      await navigator.share({ title: opportunity.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const typeClass = typeStyles[opportunity.type] ?? "bg-slate-100 text-slate-600 border-slate-200";
  const typeIcon = opportunity.type === "scholarship" ? <Award className="w-3 h-3" /> : <Building2 className="w-3 h-3" />;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col card-hover">
      {/* Clickable area */}
      <Link href={`/opportunities/${opportunity.id}`} className="flex flex-col flex-1" aria-label={`View ${opportunity.title}`}>
        {/* Image */}
        <div className="relative w-full aspect-card bg-slate-100 overflow-hidden">
          {opportunity.image_url && opportunity.image_url.trim() && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 shimmer" />
              )}
              <Image
                src={optimizeCloudinaryUrl(opportunity.image_url, 600)}
                alt={opportunity.title}
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
              <div className="text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">{opportunity.organization}</p>
              </div>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Type badge */}
          <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-sm backdrop-blur-sm bg-white/90 ${typeClass}`}>
            {typeIcon}
            {typeLabels[opportunity.type] ?? opportunity.type}
          </span>
          
          {/* New Badge */}
          {isNew && (
            <span className="absolute top-2.5 right-2.5 bg-[#25D366] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-lg badge-pulse">
              New
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-sm sm:text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#25D366] transition-colors">
            {opportunity.title}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium line-clamp-1">{opportunity.organization}</span>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-3 flex-1 leading-relaxed">
            {opportunity.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-auto pt-2 border-t border-slate-50">
            {opportunity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {opportunity.location}
              </span>
            )}
            {opportunity.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {opportunity.deadline}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons — outside Link to avoid nested <a> */}
      <div className="px-4 pb-4 flex gap-2">
        <a
          href={opportunity.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
          aria-label={`Apply for ${opportunity.title}`}
        >
          <ExternalLink className="w-4 h-4" />
          Apply Now
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all shrink-0 border border-slate-100"
          title="Share opportunity"
          aria-label="Share opportunity"
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