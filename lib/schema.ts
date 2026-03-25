// lib/schema.ts - Structured Data (JSON-LD) Utilities

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Succevia Hub",
    url: "https://succeviahub.vercel.app",
    logo: "https://succeviahub.vercel.app/logo.svg",
    sameAs: [
      "https://www.facebook.com/succeviahub",
      "https://www.instagram.com/succeviahub",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      areaServed: "Worldwide",
      availableLanguage: "en",
    },
    description:
      "Succevia Hub is the world's trusted platform for jobs, scholarships, and buying & selling items safely.",
    foundingDate: "2024",
    areaServed: "Worldwide",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Succevia Hub",
    url: "https://succeviahub.vercel.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://succeviahub.vercel.app/?q={search_term_string}",
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
    description?: string; // Made optional
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
    description: listing.description || listing.title, // Fallback to title if no description
    image: listing.image_urls,
    category: listing.category,
    datePublished: listing.created_at,
    url: `https://succeviahub.vercel.app/listings/${listing.id}`,
    offers: {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: currency,
      availability: listing.is_sold
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      url: `https://succeviahub.vercel.app/listings/${listing.id}`,
    },
  };
}
