// Product listing helper for Rose's store
// This script helps create product listings from the Rose folder images

const STORE_DETAILS = {
  pin: "9235",
  whatsapp: "+231887939235",
  location: "India"
};

// Sample products based on images viewed
const SAMPLE_PRODUCTS = [
  {
    filename: "WhatsApp Image 2026-03-26 at 03.19.59.jpeg",
    title: "Premium Herbal Bitters Collection",
    description: "Quality Alomo Bitters, Orijin Bitters and other traditional herbal bitters for health and wellness. Authentic African herbal beverages with natural ingredients.",
    category: "Other",
    price: "Contact seller for pricing"
  },
  {
    filename: "WhatsApp Image 2026-03-26 at 03.20.00.jpeg",
    title: "Colorful Plastic Household Items Set",
    description: "Durable plastic containers, plates, cups and kitchen accessories in multiple colors. Perfect for home use and outdoor activities.",
    category: "Other",
    price: "Contact seller for pricing"
  },
  {
    filename: "WhatsApp Image 2026-03-26 at 03.20.01.jpeg",
    title: "Carotone Skin Care Products",
    description: "Professional Carotone skin brightening and beauty care products. Quality skincare for a healthy, radiant complexion.",
    category: "Other",
    price: "Contact seller for pricing"
  },
  {
    filename: "WhatsApp Image 2026-03-26 at 03.20.04.jpeg",
    title: "Lanell Hair Bonding Glue Set",
    description: "Professional hair bonding glue for perfect hair styling. Anti-fungus formula for long-lasting hold and healthy hair maintenance.",
    category: "Other",
    price: "Contact seller for pricing"
  },
  {
    filename: "WhatsApp Image 2026-03-26 at 03.20.08.jpeg",
    title: "Fresh Packaged Bread Collection",
    description: "NaN brand butter bread and various fresh bread products. Eggless and trans-fat free options available. Perfect for daily meals.",
    category: "Other",
    price: "Contact seller for pricing"
  },
  {
    filename: "WhatsApp Image 2026-03-26 at 03.20.12.jpeg",
    title: "Diplomat Toothbrush Pack",
    description: "Quality Diplomat extra hard toothbrushes for superior dental care. Specially designed for smokers and thorough cleaning.",
    category: "Other",
    price: "Contact seller for pricing"
  }
];

async function uploadImageToCloudinary(imagePath) {
  // This would handle the Cloudinary upload
  // For now, we'll manually upload a few samples
}

async function createListing(productData, imageUrl) {
  const response = await fetch('/api/listings/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: productData.title,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      image_urls: [imageUrl],
      seller_whatsapp: STORE_DETAILS.whatsapp,
      seller_pin: STORE_DETAILS.pin,
      location: STORE_DETAILS.location,
      is_negotiable: true
    })
  });

  return response.json();
}

export { STORE_DETAILS, SAMPLE_PRODUCTS };