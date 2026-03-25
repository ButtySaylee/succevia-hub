import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Succevia Hub",
    short_name: "Succevia Hub",
    description:
      "Succevia Hub is Liberia's trusted platform for jobs, scholarships, and buying & selling items safely via WhatsApp.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui", "browser"],
    orientation: "any",
    dir: "ltr",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "en",
    categories: ["business", "shopping", "social"],
    id: "com.succeviahub.app",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Succevia Hub homepage on desktop",
      },
      {
        src: "/screenshots/home-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Succevia Hub homepage on mobile",
      },
      {
        src: "/screenshots/opportunities-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Opportunities page on mobile",
      },
    ],
    shortcuts: [
      {
        name: "Buy Product",
        url: "/",
      },
      {
        name: "Opportunities",
        url: "/opportunities",
      },
      {
        name: "Sell Items",
        url: "/sell",
      },
    ],
    prefer_related_applications: false,
  } as MetadataRoute.Manifest;
}
