import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  const { data, error } = await supabase.from("members").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();
  const body = await request.json();

  // Kalau ada password baru, update lewat auth admin API terpisah dari tabel members
  if (body.new_password) {
    const { error: pwError } = await supabase.auth.admin.updateUserById(id, {
      password: body.new_password,
    });
    if (pwError) return NextResponse.json({ error: pwError.message }, { status: 500 });
  }

  const { new_password, ...memberFields } = body;

  const { data, error } = await supabase
    .from("members")
    .update(memberFields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.auth.admin.deleteUser(id);

  return NextResponse.json({ success: true });
}