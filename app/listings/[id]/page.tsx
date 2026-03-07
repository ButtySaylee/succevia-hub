import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import ShareButton from "@/components/ShareButton";
import ImageCarousel from "@/components/ImageCarousel";
import SellerMarkSold from "@/components/SellerMarkSold";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import { MessageCircle, MapPin, Tag, ArrowLeft } from "lucide-react";

const categoryColors: Record<string, string> = {
  Electronics: "bg-blue-100 text-blue-700",
  Vehicles: "bg-orange-100 text-orange-700",
  Fashion: "bg-pink-100 text-pink-700",
  Property: "bg-purple-100 text-purple-700",
  Home: "bg-teal-100 text-teal-700",
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (!listing) {
    return {
      title: "Listing Not Found",
      description: "The listing you're looking for doesn't exist.",
    };
  }

  return {
    title: `${listing.title} | GbanaMarket`,
    description: listing.description.substring(0, 160),
    keywords: [listing.title, listing.category, listing.location],
    openGraph: {
      title: listing.title,
      description: listing.description,
      type: "website",
      url: `https://gbanamarket.vercel.app/listings/${listing.id}`,
      images: [
        {
          url: listing.image_urls[0],
          width: 800,
          height: 600,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: listing.description.substring(0, 160),
      images: [listing.image_urls[0]],
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .eq("is_approved", true)
    .single();

  if (!listing) notFound();

  const waMessage = encodeURIComponent(
    `Hello, I saw your ${listing.title} on Gbana Market. Is it still available?`
  );
  const waLink = `https://wa.me/${listing.seller_whatsapp}?text=${waMessage}`;

  // Structured data
  const productData = productSchema(listing);
  const breadcrumbData = breadcrumbSchema([
    { name: "Home", url: "https://gbanamarket.vercel.app" },
    {
      name: listing.category,
      url: `https://gbanamarket.vercel.app/?category=${listing.category}`,
    },
    { name: listing.title, url: `https://gbanamarket.vercel.app/listings/${listing.id}` },
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Structured Data - Product */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productData),
        }}
      />
      {/* Structured Data - Breadcrumb */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#002147] mb-5 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Carousel */}
          <ImageCarousel
            images={listing.image_urls}
            title={listing.title}
            isSold={listing.is_sold}
          />

          <div className="p-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryColors[listing.category] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                <Tag className="w-3 h-3" />
                {listing.category}
              </span>
              {listing.is_negotiable && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  Negotiable
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-[#002147] mb-2">
              {listing.title}
            </h1>
            <div className="text-2xl font-extrabold text-[#25D366] mb-4">
              {listing.price}
            </div>

            {listing.location && (
              <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                <MapPin className="w-4 h-4 shrink-0" />
                {listing.location}
              </div>
            )}

            <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
              {listing.description}
            </p>

            {listing.is_sold ? (
              <div className="bg-red-50 border border-red-200 text-red-600 text-center py-3 rounded-xl text-sm font-semibold">
                This item has been sold
              </div>
            ) : (
              <>
                <div className="flex gap-3">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat with Seller
                  </a>
                  <ShareButton listingId={listing.id} title={listing.title} />
                </div>
                <SellerMarkSold listingId={listing.id} />
              </>
            )}
            {listing.is_sold && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                Sold items remain visible for marketplace history.
              </p>
            )}

            <p className="text-xs text-slate-300 mt-4 text-center">
              Listed on{" "}
              {new Date(listing.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
