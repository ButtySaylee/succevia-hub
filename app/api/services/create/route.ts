import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyAdminRequest } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = verifyAdminRequest(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      title, description, category, budget, country, county, city,
      service_mode, urgency, whatsapp, name, image_urls, status, is_visible,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }
    if (!whatsapp?.trim()) {
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });
    }

    const userSubmittedName = name?.trim() || null;
    let nameField: string | null = null;
    if (userSubmittedName || (image_urls && Array.isArray(image_urls) && image_urls.length > 0)) {
      nameField = JSON.stringify({
        n: userSubmittedName || "",
        i: Array.isArray(image_urls) ? image_urls : [],
      });
    }

    const { data, error } = await supabaseAdmin
      .from("service_requests")
      .insert({
        title: title.trim(),
        description: description.trim(),
        category: category || "other",
        budget: budget?.trim() || null,
        country: country || "Liberia",
        county: county?.trim() || null,
        city: city?.trim() || null,
        service_mode: service_mode || "both",
        urgency: urgency || "medium",
        whatsapp: whatsapp.trim(),
        name: nameField,
        image_urls: Array.isArray(image_urls) ? image_urls : [],
        status: status || "open",
        is_visible: is_visible !== undefined ? is_visible : true,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[services/create] Supabase error:", error);
      return NextResponse.json({ error: "Failed to create request." }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 201 });
  } catch (err) {
    console.error("[services/create] Unexpected error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}