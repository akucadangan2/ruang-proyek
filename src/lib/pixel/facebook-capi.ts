// Facebook Conversions API — server-side pixel event (scope 5.5)
interface FacebookCapiPayload {
  pixelId: string;
  accessToken: string;
  eventName: string; // "Purchase" | "InitiateCheckout" | dll
  eventValue?: number;
  testEventCode?: string;
  userData?: {
    email?: string;
    phone?: string;
  };
}

export async function sendFacebookCapiEvent({
  pixelId,
  accessToken,
  eventName,
  eventValue,
  testEventCode,
  userData,
}: FacebookCapiPayload) {
  const url = `https://graph.facebook.com/v19.0/${pixelId}/events`;

  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        user_data: {
          em: userData?.email ? [hashSha256(userData.email)] : undefined,
          ph: userData?.phone ? [hashSha256(userData.phone)] : undefined,
        },
        custom_data: eventValue ? { value: eventValue, currency: "IDR" } : undefined,
      },
    ],
    access_token: accessToken,
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Facebook CAPI error: ${error}`);
  }

  return res.json();
}

// Facebook mewajibkan hash SHA-256 buat data user (email/phone) sebelum dikirim
function hashSha256(value: string): string {
  const crypto = require("crypto");
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}