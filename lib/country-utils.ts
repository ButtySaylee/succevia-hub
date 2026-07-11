// Liberia-First, Global-Ready Country Utilities
// No country is hardcoded in business logic.
// Liberia is simply the default/initial country.

import { DEFAULT_COUNTRY, LIBERIA_COUNTIES, LIBERIA_CITIES, GLOBAL_COUNTRIES } from "@/types";

export interface Location {
  country: string;
  county?: string;
  city?: string;
}

export function getDefaultCountry(): string {
  return DEFAULT_COUNTRY;
}

export function getCounties(country: string): readonly string[] {
  switch (country) {
    case "Liberia":
      return LIBERIA_COUNTIES;
    // Future: add other countries' regions here
    default:
      return [];
  }
}

export function getCities(country: string, county?: string): readonly string[] {
  if (country === "Liberia") {
    if (county) {
      // In the future, filter cities by county from DB
      return LIBERIA_CITIES;
    }
    return LIBERIA_CITIES;
  }
  // Future: return cities from DB for other countries
  return [];
}

export function getAllCountries(): readonly string[] {
  return GLOBAL_COUNTRIES;
}

export function isDefaultCountry(country: string): boolean {
  return country === DEFAULT_COUNTRY;
}

export function formatLocation(location: Location): string {
  const parts = [location.city, location.county, location.country].filter(Boolean);
  return parts.join(", ");
}

export function getCountryFlag(country: string): string {
  // Simple emoji flag mapping for common countries
  const flags: Record<string, string> = {
    Liberia: "🇱🇷",
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Australia: "🇦🇺",
    Nigeria: "🇳🇬",
    Ghana: "🇬🇭",
    Kenya: "🇰🇪",
    "South Africa": "🇿🇦",
    India: "🇮🇳",
    Germany: "🇩🇪",
    France: "🇫🇷",
    Italy: "🇮🇹",
    Spain: "🇪🇸",
    Brazil: "🇧🇷",
    Japan: "🇯🇵",
    China: "🇨🇳",
    Russia: "🇷🇺",
    Ethiopia: "🇪🇹",
    Egypt: "🇪🇬",
    Uganda: "🇺🇬",
    Senegal: "🇸🇳",
    "Sierra Leone": "🇸🇱",
  };
  return flags[country] ?? "🌍";
}

export function getCurrency(country: string): { code: string; symbol: string } {
  const currencies: Record<string, { code: string; symbol: string }> = {
    Liberia: { code: "LRD", symbol: "L$" },
    "United States": { code: "USD", symbol: "$" },
    "United Kingdom": { code: "GBP", symbol: "£" },
    Nigeria: { code: "NGN", symbol: "₦" },
    Ghana: { code: "GHS", symbol: "₵" },
    Kenya: { code: "KES", symbol: "KSh" },
    "South Africa": { code: "ZAR", symbol: "R" },
    Canada: { code: "CAD", symbol: "C$" },
    Australia: { code: "AUD", symbol: "A$" },
    India: { code: "INR", symbol: "₹" },
    Eurozone: { code: "EUR", symbol: "€" },
  };
  return currencies[country] ?? { code: "USD", symbol: "$" };
}