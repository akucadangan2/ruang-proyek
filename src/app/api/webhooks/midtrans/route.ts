import { NextRequest, NextResponse } from "next/server";

// Webhook Midtrans — belum diimplementasi, nunggu proses KYC selesai.
export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: "Midtrans belum aktif." }, { status: 501 });
}