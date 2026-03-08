import { supabaseAdmin } from "@/lib/supabase";
import { hashSellerPin, normalizeWhatsapp } from "@/lib/seller-auth";

export async function PATCH(req: Request) {
  try {
    const { listing_id, seller_whatsapp, seller_pin, title, description, price, category } =
      await req.json();

    if (!listing_id || !seller_whatsapp || !seller_pin) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Normalize before comparing
    const normalizedWa = normalizeWhatsapp(seller_whatsapp);
    const pinHash = hashSellerPin(seller_pin);

    const { data: listing, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("id, seller_whatsapp, seller_pin_hash, is_sold, is_approved")
      .eq("id", listing_id)
      .single();

    if (fetchError || !listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 });
    }

    // Normalize stored value too before comparing
    if (
      normalizeWhatsapp(listing.seller_whatsapp) !== normalizedWa ||
      listing.seller_pin_hash !== pinHash
    ) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (listing.is_sold) {
      return Response.json(
        { error: "Cannot edit sold listings. Re-list instead." },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (title?.trim()) updateData.title = title.trim();
    if (description?.trim()) updateData.description = description.trim();
    if (price?.trim()) updateData.price = price.trim();
    if (category?.trim()) updateData.category = category.trim();

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("listings")
      .update(updateData)
      .eq("id", listing_id)
      .select()
      .single();

    if (updateError || !updated) {
      return Response.json({ error: "Failed to update listing" }, { status: 500 });
    }

    return Response.json({ message: "Listing updated successfully", listing: updated });
  } catch (error: unknown) {
    console.error("Seller update error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
