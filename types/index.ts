export interface Listing {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image_urls: string[];
  seller_whatsapp: string;
  is_approved: boolean;
  payment_status?: string;
  is_negotiable: boolean;
  location: string;
  is_sold: boolean;
}

export type Category =
  | "All"
  | "Electronics"
  | "Vehicles"
  | "Fashion"
  | "Property"
  | "Home"
  | "Other";

export const CATEGORIES: Category[] = [
  "All",
  "Electronics",
  "Vehicles",
  "Fashion",
  "Property",
  "Home",
  "Other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  All: "🛍️",
  Electronics: "📱",
  Vehicles: "🚗",
  Fashion: "👗",
  Property: "🏠",
  Home: "🛋️",
  Other: "📦",
};

export const LIBERIA_LOCATIONS = [
  "Monrovia",
  "Paynesville",
  "Buchanan",
  "Gbarnga",
  "Kakata",
  "Voinjama",
  "Zwedru",
  "Harper",
  "Tubmanburg",
  "Greenville",
  "Sanniquellie",
  "Harbel",
  "Other",
] as const;
