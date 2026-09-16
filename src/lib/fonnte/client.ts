// Wrapper kirim pesan WA via Fonnte API
interface SendFonnteMessageParams {
  target: string; // nomor WA tujuan, format 628xxx
  message: string;
}

export async function sendFonnteMessage({ target, message }: SendFonnteMessageParams) {
  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: process.env.FONNTE_TOKEN!,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ target, message }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Fonnte error: ${error}`);
  }

  return res.json();
}