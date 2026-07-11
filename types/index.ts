// ====== Core Platform Types ======

export interface Listing {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  price: string;
  category: string;
  image_urls: string[];
  seller_whatsapp: string;
  is_approved: boolean;
  payment_status?: string;
  is_negotiable: boolean;
  location: string;
  county?: string;
  city?: string;
  is_sold: boolean;
  condition?: string;
  seller_name?: string;
  is_verified_seller?: boolean;
}

export type Category =
  | "All"
  | "Electronics"
  | "Vehicles"
  | "Fashion"
  | "Property"
  | "Other";

export const CATEGORIES: Category[] = [
  "All", "Electronics", "Vehicles", "Fashion", "Property", "Other",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  All: "🛍️",
  Electronics: "📱",
  Vehicles: "🚗",
  Fashion: "👗",
  Property: "🏠",
  Other: "📦",
};

export const MARKETPLACE_CATEGORIES = [
  "Phones", "Laptops", "Electronics", "Vehicles", "Motorcycles",
  "Furniture", "Fashion", "Property", "Agriculture", "Books",
  "Home Appliances", "Other",
] as const;

// ====== Opportunities ======

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
  image_url?: string | null;
  is_active: boolean;
  is_visible: boolean;
}

export const OPPORTUNITY_TYPES: OpportunityType[] = ["job", "scholarship"];
export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  job: "Job",
  scholarship: "Scholarship",
};

// ====== Jobs ======

export type JobType = "full-time" | "part-time" | "contract" | "internship" | "remote" | "volunteer" | "graduate" | "temporary";
export type JobSector = "government" | "ngo" | "private" | "international";

export interface Job {
  id: string;
  created_at: string;
  title: string;
  description: string;
  organization: string;
  organization_logo?: string;
  type: JobType;
  sector: JobSector;
  location: string;
  county?: string;
  city?: string;
  country: string;
  salary_range?: string;
  deadline?: string;
  requirements?: string;
  responsibilities?: string;
  application_url?: string;
  application_email?: string;
  is_active: boolean;
  is_featured?: boolean;
  employer_id?: string;
  views?: number;
  applications_count?: number;
}

// ====== Scholarships ======

export type ScholarshipLevel = "bachelor" | "masters" | "phd" | "exchange" | "research" | "training" | "fellowship";
export type ScholarshipFunding = "full" | "partial" | "grant";

export interface Scholarship {
  id: string;
  created_at: string;
  title: string;
  description: string;
  organization: string;
  organization_logo?: string;
  level: ScholarshipLevel;
  funding: ScholarshipFunding;
  field_of_study?: string;
  country: string;
  university?: string;
  deadline: string;
  eligibility?: string;
  requirements?: string;
  benefits?: string;
  application_url: string;
  image_url?: string;
  is_active: boolean;
  is_featured?: boolean;
  views?: number;
}

// ====== Services ======

export const SERVICE_CATEGORIES = [
  { id: "tech-support", label: "Tech Support", icon: "💻" },
  { id: "repairs", label: "Repairs", icon: "🔧" },
  { id: "design", label: "Design & Creative", icon: "🎨" },
  { id: "writing", label: "Writing & Translation", icon: "✍️" },
  { id: "tutoring", label: "Tutoring", icon: "📚" },
  { id: "photography", label: "Photography & Video", icon: "📸" },
  { id: "home-services", label: "Home Services", icon: "🏠" },
  { id: "automotive", label: "Automotive", icon: "🚗" },
  { id: "delivery", label: "Delivery & Moving", icon: "📦" },
  { id: "events", label: "Event Planning", icon: "🎉" },
  { id: "business", label: "Business Services", icon: "💼" },
  { id: "health", label: "Health & Wellness", icon: "🏥" },
  { id: "legal", label: "Legal", icon: "⚖️" },
  { id: "accounting", label: "Accounting & Tax", icon: "📊" },
  { id: "other", label: "Other Services", icon: "🛠️" },
] as const;

export interface ServiceRequest {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  budget?: string;
  is_negotiable: boolean;
  country: string;
  county?: string;
  city?: string;
  service_mode: "online" | "in_person" | "both";
  deadline?: string;
  urgency: "low" | "medium" | "high" | "urgent";
  attachments?: string[];
  status: "open" | "in_progress" | "completed" | "cancelled";
  requester_id?: string;
  requester_whatsapp: string;
  requester_name?: string;
  quotations_count?: number;
}

export interface ServiceOffer {
  id: string;
  created_at: string;
  professional_id: string;
  service_request_id?: string;
  title: string;
  description: string;
  category: string;
  price: string;
  is_negotiable: boolean;
  delivery_time?: string;
  portfolio_urls?: string[];
  is_active: boolean;
}

export interface Quotation {
  id: string;
  created_at: string;
  service_request_id: string;
  professional_id: string;
  amount: string;
  description: string;
  delivery_time?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  is_featured?: boolean;
}

// ====== Professionals / Freelancers ======

export interface Professional {
  id: string;
  created_at: string;
  user_id?: string;
  full_name: string;
  title: string;
  bio: string;
  avatar_url?: string;
  cover_url?: string;
  skills: string[];
  experience_years: number;
  hourly_rate?: string;
  availability: "available" | "busy" | "unavailable";
  languages: string[];
  education?: string;
  certificates?: string[];
  portfolio_images?: string[];
  completed_jobs: number;
  rating: number;
  review_count: number;
  response_time?: string;
  is_verified: boolean;
  country: string;
  county?: string;
  city?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  social_links?: Record<string, string>;
}

// ====== Businesses ======

export const BUSINESS_CATEGORIES = [
  "Technology", "Healthcare", "Education", "Finance", "Agriculture",
  "Retail", "Manufacturing", "Construction", "Transportation",
  "Hospitality", "Real Estate", "Entertainment", "Consulting",
  "Legal Services", "Marketing", "Other",
] as const;

export interface Business {
  id: string;
  created_at: string;
  owner_id?: string;
  name: string;
  description: string;
  category: string;
  logo_url?: string;
  cover_url?: string;
  country: string;
  county?: string;
  city?: string;
  address?: string;
  whatsapp: string;
  phone?: string;
  email?: string;
  website?: string;
  business_hours?: Record<string, string>;
  images?: string[];
  is_verified: boolean;
  rating: number;
  review_count: number;
  followers_count: number;
  is_active: boolean;
}

// ====== Community ======

export interface Community {
  id: string;
  created_at: string;
  name: string;
  description: string;
  category: string;
  cover_url?: string;
  icon_url?: string;
  creator_id: string;
  members_count: number;
  posts_count: number;
  is_private: boolean;
  is_active: boolean;
}

export interface CommunityPost {
  id: string;
  created_at: string;
  community_id: string;
  author_id: string;
  content: string;
  type: "post" | "poll" | "announcement" | "file";
  images?: string[];
  files?: string[];
  poll_data?: PollData;
  likes_count: number;
  comments_count: number;
  is_pinned: boolean;
}

export interface PollData {
  question: string;
  options: { label: string; votes: number }[];
  expires_at?: string;
}

// ====== Reviews ======

export type ReviewTarget = "business" | "listing" | "professional" | "freelancer" | "employer" | "buyer" | "seller";

export interface Review {
  id: string;
  created_at: string;
  reviewer_id: string;
  target_id: string;
  target_type: ReviewTarget;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  is_verified: boolean;
  is_anonymous: boolean;
}

// ====== Chat ======

export interface ChatMessage {
  id: string;
  created_at: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  type: "text" | "image" | "file" | "voice";
  file_url?: string;
  reply_to?: string;
  is_read: boolean;
  is_pinned: boolean;
}

export interface Conversation {
  id: string;
  created_at: string;
  participants: string[];
  last_message?: string;
  last_message_at?: string;
  is_group: boolean;
  name?: string;
  avatar_url?: string;
}

// ====== Notifications ======

export type NotificationType =
  | "message" | "application" | "job_alert" | "scholarship_alert"
  | "marketplace" | "service" | "business" | "event"
  | "review" | "announcement" | "quotation" | "order"
  | "verification" | "system";

export interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  is_read: boolean;
  action_url?: string;
}

// ====== Events ======

export interface Event {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  type: "online" | "in_person" | "hybrid";
  country: string;
  county?: string;
  city?: string;
  venue?: string;
  start_date: string;
  end_date?: string;
  cover_url?: string;
  organizer: string;
  organizer_contact?: string;
  max_attendees?: number;
  attendees_count: number;
  is_free: boolean;
  price?: string;
  is_active: boolean;
}

// ====== Learning ======

export interface Course {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  instructor_bio?: string;
  thumbnail_url?: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  is_free: boolean;
  price?: string;
  syllabus?: string[];
  enrolled_count: number;
  rating: number;
  is_active: boolean;
  is_featured?: boolean;
}

// ====== Saved Items ======

export type SavedItemType = "listing" | "job" | "scholarship" | "service" | "business" | "professional" | "event" | "course" | "community";

export interface SavedItem {
  id: string;
  created_at: string;
  user_id: string;
  item_id: string;
  item_type: SavedItemType;
  notes?: string;
}

// ====== Geographic Types ======

export interface CountryData {
  id: string;
  code: string;
  name: string;
  flag: string;
  currency: string;
  currency_symbol: string;
  phone_code: string;
  is_active: boolean;
  sort_order: number;
}

export interface Region {
  id: string;
  country_id: string;
  name: string;
  type: "region" | "county" | "state" | "province";
  is_active: boolean;
}

export interface City {
  id: string;
  region_id: string;
  name: string;
  is_active: boolean;
}

// ====== Global Constants (Liberia-First, Global Ready) ======

export const DEFAULT_COUNTRY = "Liberia";
export const DEFAULT_CURRENCY = "LRD";
export const DEFAULT_CURRENCY_SYMBOL = "L$";

export const LIBERIA_COUNTIES = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe",
] as const;

export const LIBERIA_CITIES = [
  "Monrovia", "Paynesville", "Ganta", "Buchanan", "Gbarnga",
  "Kakata", "Voinjama", "Zwedru", "Harper", "Greenville",
  "Robertsport", "Tubmanburg", "Bensonville", "Sanniquellie", "Barclayville",
] as const;

export const GLOBAL_COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia",
  "Austria", "Bangladesh", "Belgium", "Brazil", "Canada",
  "Chile", "China", "Colombia", "Denmark", "Egypt",
  "Ethiopia", "Finland", "France", "Germany", "Ghana",
  "Greece", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Japan", "Jordan",
  "Kenya", "Lebanon", "Liberia", "Malaysia", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway",
  "Pakistan", "Philippines", "Poland", "Portugal", "Russia",
  "Saudi Arabia", "Senegal", "Sierra Leone", "Singapore",
  "South Africa", "South Korea", "Spain", "Sri Lanka",
  "Sweden", "Switzerland", "Thailand", "Turkey", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Vietnam", "Other",
] as const;

export type Country = (typeof GLOBAL_COUNTRIES)[number];

// ====== UI Types ======

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  count?: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  type?: string;
  country?: string;
  county?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: "newest" | "oldest" | "price_low" | "price_high" | "popular";
  page: number;
  limit: number;
}

// ====== Navigation ======

export interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  badge?: number;
}