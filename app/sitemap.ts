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

  // Create sitemap entries for static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/sell`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Create sitemap entries for all listing pages
  const listingPages: MetadataRoute.Sitemap = (listings ?? []).map(
    (listing) => ({
      url: `${BASE_URL}/listings/${listing.id}`,
      lastModified: new Date(listing.created_at),
      changeFrequency: listing.is_sold ? "never" : "weekly",
      priority: listing.is_sold ? 0.4 : 0.7,
    })
  );

  return [...staticPages, ...listingPages];
}
