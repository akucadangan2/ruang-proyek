import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: original, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !original)
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });

  const { id: _oldId, created_at, updated_at, ...rest } = original;

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...rest,
      owner_id: user.id,
      name: `${original.name} (Copy)`,
      slug: slugify(`${original.slug}-copy-${Date.now().toString(36)}`),
      is_active: false, // draft dulu, seller aktifkan manual
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}