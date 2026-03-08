// lib/schema.ts - Structured Data (JSON-LD) Utilities

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GbanaMarket",
    url: "https://gbanamarket.vercel.app",
    logo: "https://gbanamarket.vercel.app/logo.png",
    sameAs: [
      "https://www.facebook.com/gbanamarket",
      "https://www.instagram.com/gbanamarket",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "LR",
      availableLanguage: "en",
    },
    description:
      "GbanaMarket is an online marketplace where users can buy and sell products easily in Liberia.",
    foundingDate: "2024",
    areaServed: "LR",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GbanaMarket",
    url: "https://gbanamarket.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://gbanamarket.vercel.app/?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productSchema(
  listing: {
    id: string;
    title: string;
    description: string;
    price: string;
    image_urls: string[];
    is_sold: boolean;
    category: string;
    created_at: string;
  }
) {
  const priceMatch = listing.price.match(/[\d.]+/);
  const numericPrice = priceMatch ? priceMatch[0] : "0";
  const currency = listing.price.toUpperCase().includes("USD") ? "USD" : "LRD";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.image_urls,
    category: listing.category,
    datePublished: listing.created_at,
    url: `https://gbanamarket.vercel.app/listings/${listing.id}`,
    offers: {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: currency,
      availability: listing.is_sold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `https://gbanamarket.vercel.app/listings/${listing.id}`,
    },
  };
}
