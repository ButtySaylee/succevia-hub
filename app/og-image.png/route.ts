import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Dynamically generate a simple Open Graph image
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Succevia Hub – Global Jobs, Scholarships & Marketplace";

  // For production, use a real image generation service or static image
  // Here, we fallback to a static logo
  return NextResponse.redirect("/logo.png");
}
