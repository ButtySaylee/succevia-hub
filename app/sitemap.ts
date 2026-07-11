import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = "https://succeviahub.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch all approved listings
  const { data: listings } = await supabase
    .from("listings")
    .select("id, created_at, is_sold")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  // Fetch all active opportunities
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("id, created_at, type")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Static pages with their priorities
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${BASE_URL}/marketplace`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/jobs`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/opportunities`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/sell`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/professionals`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/businesses`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/learning`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/download/android`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/reset-pin`, lastModified: now, changeFrequency: "monthly", priority: 0.2 },
  ];

  // Sitemap entries for all listing detail pages
  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map(
    (listing) => ({
      url: `${BASE_URL}/listings/${listing.id}`,
      lastModified: new Date(listing.created_at),
      changeFrequency: listing.is_sold ? "never" : "weekly",
      priority: listing.is_sold ? 0.4 : 0.7,
    })
  );

  // Sitemap entries for all opportunity detail pages
  const opportunityPages: MetadataRoute.Sitemap = (opportunities ?? []).map(
    (opp) => ({
      url: `${BASE_URL}/opportunities/${opp.id}`,
      lastModified: new Date(opp.created_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticPages, ...listingPages, ...opportunityPages];
}