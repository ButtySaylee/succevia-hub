"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Opportunity } from "@/types";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  Check,
  AlertCircle,
} from "lucide-react";

interface JobCardProps {
  job: Opportunity;
}

export default function JobCard({ job }: JobCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isExpired = job.deadline && new Date(job.deadline) < new Date();

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/jobs/${job.id}`;
    if (navigator.share) {
      await navigator.share({ title: job.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 overflow-hidden flex flex-col card-hover">
      {/* Clickable area */}
      <Link href={`/jobs/${job.id}`} className="flex flex-col flex-1" aria-label={`View ${job.title}`}>
        {/* Image */}
        <div className="relative w-full aspect-card bg-slate-100 overflow-hidden">
          {job.image_url && job.image_url.trim() && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 shimmer" />
              )}
              <Image
                src={job.image_url}
                alt={job.title}
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
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#002147]/5 to-[#003580]/10">
              <div className="text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">{job.organization}</p>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Type badge */}
          <span className="absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 shadow-sm backdrop-blur-sm bg-white/90 bg-blue-50 text-blue-700 border-blue-200">
            <Briefcase className="w-3 h-3" />
            Job
          </span>

          {/* Expired badge */}
          {isExpired && (
            <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-lg">
              <AlertCircle className="w-3 h-3 inline" /> Expired
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-[#002147] text-sm sm:text-base leading-snug line-clamp-2 mb-1.5 group-hover:text-[#25D366] transition-colors">
            {job.title}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium line-clamp-1">{job.organization}</span>
          </div>

          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-3 flex-1 leading-relaxed">
            {job.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 mt-auto pt-2 border-t border-slate-50">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            )}
            {job.deadline && (
              <span className={`flex items-center gap-1 ${isExpired ? "text-red-400" : ""}`}>
                <Clock className="w-3.5 h-3.5" />
                {isExpired ? "Expired" : job.deadline}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons — outside Link */}
      <div className="px-4 pb-4 flex gap-2">
        <a
          href={job.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#002147] hover:bg-[#003580] active:scale-95 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm hover:shadow-md"
          aria-label={`Apply for ${job.title}`}
        >
          <ExternalLink className="w-4 h-4" />
          Apply Now
        </a>
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all shrink-0 border border-slate-100"
          title="Share job"
          aria-label="Share job"
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