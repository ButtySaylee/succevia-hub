"use client";

import { useState, useRef, useEffect } from "react";
import { GLOBAL_COUNTRIES } from "@/types";
import { Globe, Search, ChevronDown, Check } from "lucide-react";

interface CountryFilterProps {
  selectedCountry: string;
  selectedCategory: string;
  searchQuery: string;
  statusFilter: string;
}

export default function CountryFilter({
  selectedCountry,
  selectedCategory,
  searchQuery,
  statusFilter,
}: CountryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCountryChange = (newCountry: string) => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set('category', selectedCategory);
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter !== "all") params.set('status', statusFilter);
    if (newCountry !== 'All') params.set('country', newCountry);
    window.location.href = '/?' + params.toString();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = GLOBAL_COUNTRIES.filter(
    (c) => c.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = selectedCountry === "All" ? "All Countries" : selectedCountry;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold rounded-full px-3.5 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all duration-200 hover:shadow-sm min-h-[40px]"
        aria-label="Select country filter"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="max-w-[100px] truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-scale-in">
          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full bg-slate-50 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366] border border-slate-200"
                autoFocus
                aria-label="Search countries"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto scrollbar-hide">
            <button
              onClick={() => {
                handleCountryChange("All");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 ${
                selectedCountry === "All" ? "bg-[#25D366]/5 font-bold text-[#002147]" : "text-slate-700"
              }`}
            >
              <span className="flex-1">All Countries</span>
              {selectedCountry === "All" && (
                <Check className="w-4 h-4 text-[#25D366]" />
              )}
            </button>
            <div className="border-t border-slate-50" />
            {filteredCountries.map((country) => (
              <button
                key={country}
                onClick={() => {
                  handleCountryChange(country);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 ${
                  selectedCountry === country ? "bg-[#25D366]/5 font-bold text-[#002147]" : "text-slate-700"
                }`}
              >
                <span className="flex-1 truncate">{country}</span>
                {selectedCountry === country && (
                  <Check className="w-4 h-4 text-[#25D366] shrink-0" />
                )}
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                No countries found
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] text-slate-400 text-center">
              {GLOBAL_COUNTRIES.length} countries available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}