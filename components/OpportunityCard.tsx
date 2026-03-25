"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ExternalLink, Share2, Check, Building2 } from "lucide-react";
import { Opportunity } from "@/types";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isNew?: boolean;
}

const typeStyles: Record<string, string> = {
  job: "bg-blue-100 text-blue-700",
  scholarship: "bg-purple-100 text-purple-700",
};

const typeLabels: Record<string, string> = {
  job: "Job",
  scholarship: "Scholarship",
};

export default function OpportunityCard({ opportunity, isNew }: OpportunityCardProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col group">
      {/* Clickable area */}
      <Link href={`/opportunities/${opportunity.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
          {opportunity.image_url && opportunity.image_url.trim() ? (
            <Image
              src={optimizeCloudinaryUrl(opportunity.image_url, 800)}
              alt={opportunity.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-100 to-slate-200">
              <Building2 className="w-16 h-16 text-slate-400" />
            </div>
          )}
          {/* Type badge */}
          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${
              typeStyles[opportunity.type] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {typeLabels[opportunity.type] ?? opportunity.type}
          </span>
          {isNew && (
            <span className="absolute top-2 right-2 bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
              New
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-base leading-tight line-clamp-2 mb-1">
            {opportunity.title}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 text-xs mb-2">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{opportunity.organization}</span>
          </div>

          <p className="text-slate-500 text-sm line-clamp-2 mb-2 flex-1">
            {opportunity.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-auto">
            {opportunity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {opportunity.location}
              </span>
            )}
            {opportunity.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
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
          className="flex-1 flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow"
        >
          <ExternalLink className="w-4 h-4" />
          Apply Now
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors shrink-0"
          title="Share opportunity"
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
