import { createClient } from "@supabase/supabase-js";
import { hashSellerPin } from "@/lib/seller-auth";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request) {
  try {
    const {
      listing_id,
      seller_whatsapp,
      seller_pin,
      title,
      description,
      price,
      category,
    } = await req.json();

    // Validate inputs
    if (!listing_id || !seller_whatsapp || !seller_pin) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pinHash = hashSellerPin(seller_pin);

    // Verify seller owns this listing
    const { data: listing, error: fetchError } = await supabaseAdmin
      .from("listings")
      .select("id, seller_whatsapp, seller_pin_hash, is_sold, is_approved")
      .eq("id", listing_id)
      .single();

    if (fetchError || !listing) {
      return Response.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (listing.seller_whatsapp !== seller_whatsapp || listing.seller_pin_hash !== pinHash) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Cannot edit sold listings
    if (listing.is_sold) {
      return Response.json(
        { error: "Cannot edit sold listings. Re-list instead." },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, string | number> = {};
    if (title !== undefined && title.trim()) updateData.title = title.trim();
    if (description !== undefined && description.trim()) updateData.description = description.trim();
    if (price !== undefined && price.trim()) updateData.price = price.trim();
    if (category !== undefined && category.trim()) updateData.category = category.trim();

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Update listing
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("listings")
      .update(updateData)
      .eq("id", listing_id)
      .select()
      .single();

    if (updateError || !updated) {
      return Response.json(
        { error: "Failed to update listing" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Listing updated successfully", listing: updated },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Seller update error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
