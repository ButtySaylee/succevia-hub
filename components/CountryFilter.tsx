"use client";

import { GLOBAL_COUNTRIES } from "@/types";

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
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.set('category', selectedCategory);
    }
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (statusFilter !== "all") {
      params.set('status', statusFilter);
    }
    if (newCountry !== 'All') {
      params.set('country', newCountry);
    }

    window.location.href = '/?' + params.toString();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-600">🌍 Country:</span>
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="text-sm font-semibold rounded-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent appearance-none pr-8"
        >
          <option value="All">All Countries</option>
          {GLOBAL_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}