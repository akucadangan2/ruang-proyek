import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? "",
      phone: user.user_metadata?.phone ?? "",
    },
  });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Update nama/telepon (disimpan di user_metadata)
  const { error: metaError } = await supabase.auth.updateUser({
    data: { name: body.name, phone: body.phone },
  });
  if (metaError) return NextResponse.json({ error: metaError.message }, { status: 500 });

  // Ganti password kalau diisi
  if (body.new_password) {
    const { error: pwError } = await supabase.auth.updateUser({
      password: body.new_password,
    });
    if (pwError) return NextResponse.json({ error: pwError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}