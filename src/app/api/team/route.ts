import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Bikin auth user dulu (invite via email), baru insert ke members
  const { data: authUser, error: authError } = await supabase.auth.admin.inviteUserByEmail(
    body.email
  );
  if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

  const { data, error } = await supabase
    .from("members")
    .insert({
      id: authUser.user.id,
      owner_id: user.id,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role,
      order_access_scope: body.order_access_scope ?? "semua",
      permissions: body.permissions ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}