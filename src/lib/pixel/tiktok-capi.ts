// Tiktok Events API — server-side pixel event
interface TiktokCapiPayload {
  pixelId: string;
  accessToken: string;
  eventName: string;
  eventValue?: number;
}

export async function sendTiktokCapiEvent({
  pixelId,
  accessToken,
  eventName,
  eventValue,
}: TiktokCapiPayload) {
  const url = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

  const body = {
    pixel_code: pixelId,
    event: eventName,
    timestamp: new Date().toISOString(),
    properties: eventValue ? { value: eventValue, currency: "IDR" } : undefined,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Tiktok CAPI error: ${error}`);
  }

  return res.json();
}