import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PixelPlatform } from "@/types/pixel";

// GET /api/pixels?platform=facebook&search=...
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform") as PixelPlatform | null;
  const search = searchParams.get("search");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let query = supabase
    .from("pixels")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (platform) query = query.eq("platform", platform);
  if (search) query = query.or(`pixel_name.ilike.%${search}%,pixel_id.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/pixels — Add New Pixel
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { data, error } = await supabase
    .from("pixels")
    .insert({
      owner_id: user.id,
      platform: body.platform,
      pixel_id: body.pixel_id,
      pixel_name: body.pixel_name,
      server_side_enabled: body.server_side_enabled ?? false,
      access_token: body.access_token ?? null,
      trigger_condition: body.trigger_condition ?? null,
      event_value_field: body.event_value_field ?? null,
      test_event_code: body.test_event_code ?? null,
      apply_to_all_products: body.apply_to_all_products ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}