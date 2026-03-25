import { supabaseAdmin } from "@/lib/supabase";
import { hashSellerPin, normalizeWhatsapp } from "@/lib/seller-auth";

export async function POST(req: Request) {
  try {
    const { listing_id, seller_whatsapp, seller_pin } = await req.json();

    if (!listing_id || !seller_whatsapp || !seller_pin) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize before comparing so "+231 777 123" matches "+231777123"
    const normalizedWa = normalizeWhatsapp(seller_whatsapp);
    const pinHash = hashSellerPin(seller_pin);

    const { data: original, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("id, title, description, price, category, image_urls, seller_whatsapp, seller_pin_hash, is_negotiable, location")
      .eq("id", listing_id)
      .single();

    if (fetchError || !original) {
      return Response.json({ error: "Original listing not found" }, { status: 404 });
    }

    // Normalize stored value too before comparing
    if (
      normalizeWhatsapp(original.seller_whatsapp) !== normalizedWa ||
      original.seller_pin_hash !== pinHash
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: newListing, error: createError } = await supabaseAdmin
      .from("listings")
      .insert({
        title: original.title,
        description: original.description,
        price: original.price,
        category: original.category,
        image_urls: original.image_urls,
        seller_whatsapp: original.seller_whatsapp,
        seller_pin_hash: original.seller_pin_hash,
        is_negotiable: original.is_negotiable,
        location: original.location,
        is_approved: true, // Auto-approve re-listed items
        is_sold: false,
      })
      .select()
      .single();

    if (createError || !newListing) {
      console.error("Re-list create error:", createError);
      return Response.json({ error: "Failed to re-list item" }, { status: 500 });
    }

    return Response.json(
      { message: "Item re-listed successfully and is now live!", listing: newListing },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Re-list error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
