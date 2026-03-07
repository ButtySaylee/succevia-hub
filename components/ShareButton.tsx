"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  listingId: string;
  title: string;
  className?: string;
}

export default function ShareButton({ listingId, title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/listings/${listingId}`;
    if (navigator.share) {
      await navigator.share({ title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleShare}
      className={className ?? "flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-all"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-[#25D366]" />
      ) : (
        <Share2 className="w-4 h-4" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
