"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="max-w-md mx-auto p-6 text-center space-y-4">
      <div className="text-5xl">Berhasil</div>
      <h1 className="text-xl font-bold">Terimakasih sudah pesan!</h1>
      <p className="text-sm text-gray-500">
        Pesanan kamu <strong>{orderNumber}</strong> berhasil diproses. Cek email kamu untuk akses produk digital, atau tunggu konfirmasi pembayaran.
      </p>

      {/* BAGIAN YANG DIPERBAIKI: Menambahkan tag pembuka <a */}
      <a
        href="https://wa.me/6281234567890"
        className="block bg-green-600 text-white rounded-xl py-3 font-medium"
      >
        Butuh Bantuan? Hubungi WhatsApp
      </a>

      <p className="text-xs text-gray-400 pt-4">
        Pembayaran transaksi ini diproses melalui Midtrans.
      </p>
    </div>
  );
}