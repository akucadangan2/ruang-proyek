import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: transactions, error } = await supabase
    .from("balance_transactions")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const balance = (transactions ?? []).reduce((sum, t) => {
    if (t.status !== "completed") return sum;
    if (t.type === "withdraw") return sum - t.amount;
    return sum + t.amount;
  }, 0);

  return NextResponse.json({ data: { balance, transactions } });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json(); // { type: "withdraw", amount, note }

  const { data, error } = await supabase
    .from("balance_transactions")
    .insert({
      owner_id: user.id,
      type: body.type,
      amount: body.amount,
      status: body.type === "withdraw" ? "pending" : "completed",
      note: body.note ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data }, { status: 201 });
}