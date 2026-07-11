"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, TrendingUp, Clock, X, ArrowRight, Loader2 } from "lucide-react";

interface SearchSuggestion {
  text: string;
  type: "product" | "job" | "service" | "scholarship" | "business" | "professional";
  href: string;
}

const TRENDING_SEARCHES = [
  "Phones for sale", "Jobs in Monrovia", "Scholarships 2026",
  "Laptop repair", "Web developer", "Graphic design",
];

const RECENT_SEARCHES_KEY = "succevia_recent_searches";

export default function SearchBar({ 
  variant = "hero",
  onSearch,
}: { 
  variant?: "hero" | "navbar" | "compact";
  onSearch?: (query: string) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try { setRecentSearches(JSON.parse(stored)); } catch {}
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = useCallback((q: string) => {
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const removeRecentSearch = (q: string) => {
    const updated = recentSearches.filter(s => s !== q);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    saveRecentSearch(q);
    setIsOpen(false);
    if (onSearch) {
      onSearch(q);
    } else {
      router.push(`/?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.text);
    setIsOpen(false);
    setQuery("");
    router.push(suggestion.href);
  };

  const inputClasses = variant === "hero"
    ? "w-full pl-12 pr-16 py-3.5 sm:py-4 rounded-2xl bg-white/95 backdrop-blur text-slate-800 text-sm sm:text-base shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 placeholder:text-slate-400"
    : variant === "navbar"
    ? "w-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
    : "w-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]";

  const wrapperClasses = variant === "hero"
    ? "max-w-xl mx-auto relative"
    : "relative w-full";

  return (
    <div ref={wrapperRef} className={wrapperClasses}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          {variant !== "compact" && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
          )}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products, jobs, services, professionals..."
            className={inputClasses}
            aria-label="Search Succevia Hub"
            autoComplete="off"
          />
          <button
            type="submit"
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center ${
              variant === "hero"
                ? "bg-[#25D366] hover:bg-[#1da851] text-white shadow-lg"
                : "bg-[#25D366] hover:bg-[#1da851] text-white"
            }`}
            aria-label="Search"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-scale-in">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-3 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">Suggestions</p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3 text-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700">{s.text}</span>
                  <span className="ml-auto text-[10px] text-slate-400 uppercase">{s.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending */}
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center gap-2 px-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#25D366]" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Trending</p>
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              {TRENDING_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    saveRecentSearch(term);
                    setIsOpen(false);
                    router.push(`/?q=${encodeURIComponent(term)}`);
                  }}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-xs text-slate-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Recent</p>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 group">
                  <button
                    onClick={() => {
                      setQuery(term);
                      saveRecentSearch(term);
                      setIsOpen(false);
                      router.push(`/?q=${encodeURIComponent(term)}`);
                    }}
                    className="flex-1 text-left text-sm text-slate-600 truncate"
                  >
                    {term}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(term)}
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${term} from recent searches`}
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <Link
              href="/opportunities"
              className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-500 hover:text-[#25D366] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span>Browse all opportunities</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}