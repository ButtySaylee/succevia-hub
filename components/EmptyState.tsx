"use client";

import { ShoppingBag, Search, Package, AlertCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "search" | "error";
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
}: EmptyStateProps) {
  const defaultIcons = {
    default: <Package className="w-16 h-16 text-slate-300" />,
    search: <Search className="w-16 h-16 text-slate-300" />,
    error: <AlertCircle className="w-16 h-16 text-slate-300" />,
  };

  return (
    <div className="text-center py-20 px-4 animate-fade-in">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          {icon || defaultIcons[variant]}
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center animate-float">
          <span className="text-white text-sm">✨</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-3 gradient-text">
        {title}
      </h2>

      <p className="text-slate-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {action && (
          <>
            {action.href ? (
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
              >
                <ShoppingBag className="w-5 h-5" />
                {action.label}
              </Link>
            ) : (
              <button
                onClick={action.onClick}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 active:scale-95 min-h-[48px]"
              >
                <ShoppingBag className="w-5 h-5" />
                {action.label}
              </button>
            )}
          </>
        )}

        {secondaryAction && (
          <>
            {secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-[#002147] hover:text-white hover:scale-105 active:scale-95 min-h-[48px]"
              >
                {secondaryAction.label}
              </Link>
            ) : (
              <button
                onClick={secondaryAction.onClick}
                className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-2xl transition-all duration-300 hover:bg-[#002147] hover:text-white hover:scale-105 active:scale-95 min-h-[48px]"
              >
                {secondaryAction.label}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function EmptyListings({ searchQuery, onClear }: { searchQuery?: string; onClear?: () => void }) {
  return (
    <EmptyState
      variant={searchQuery ? "search" : "default"}
      title={searchQuery ? `No results for "${searchQuery}"` : "No listings found"}
      description={
        searchQuery
          ? "Try a different search term or browse all categories."
          : "Be the first to list an item. Reach buyers worldwide!"
      }
      action={{ label: "Post a Listing", href: "/sell" }}
      secondaryAction={searchQuery ? { label: "Clear Search", onClick: onClear } : undefined}
    />
  );
}