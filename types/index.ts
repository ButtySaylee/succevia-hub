export interface Listing {
  id: string;
  created_at: string;
  title: string;
  description?: string; // Made optional
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
  | "Other";

export const CATEGORIES: Category[] = [
  "All",
  "Electronics",
  "Vehicles",
  "Fashion",
  "Property",
  "Other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  All: "🛍️",
  Electronics: "📱",
  Vehicles: "🚗",
  Fashion: "👗",
  Property: "🏠",
  Other: "📦",
};

export type OpportunityType = "job" | "scholarship";

export interface Opportunity {
  id: string;
  created_at: string;
  title: string;
  description: string;
  type: OpportunityType;
  organization: string;
  location: string;
  deadline?: string;
  requirements?: string;
  application_url: string;
  image_url: string;
  is_active: boolean;
}

export const OPPORTUNITY_TYPES: OpportunityType[] = ["job", "scholarship"];

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  job: "Job",
  scholarship: "Scholarship",
};

export type Country = (typeof GLOBAL_COUNTRIES)[number];

export const GLOBAL_COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Denmark",
  "Egypt",
  "Ethiopia",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "Greece",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kenya",
  "Lebanon",
  "Liberia",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Pakistan",
  "Philippines",
  "Poland",
  "Portugal",
  "Russia",
  "Saudi Arabia",
  "Senegal",
  "Sierra Leone",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
] as const;
