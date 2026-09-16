interface SendTelegramMessageParams {
  botToken: string;
  chatId: string;
  message: string;
  buttonText?: string;
  buttonUrl?: string;
}

export async function sendTelegramMessage({
  botToken,
  chatId,
  message,
  buttonText,
  buttonUrl,
}: SendTelegramMessageParams) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const body: Record<string, unknown> = {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown",
  };

  if (buttonText && buttonUrl) {
    body.reply_markup = {
      inline_keyboard: [[{ text: buttonText, url: buttonUrl }]],
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Telegram error: ${error}`);
  }

  return res.json();
}

// Ubah 08xxx / 62xxx jadi format link wa.me yang valid
export function toWaLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}