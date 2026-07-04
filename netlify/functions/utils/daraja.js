const MPESA_ENV = process.env.MPESA_ENV || "sandbox";

export const BASE_URL =
  MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Daraja auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export function generateTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return (
    now.getFullYear() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds())
  );
}

export function generatePassword(timestamp) {
  const raw =
    `${process.env.MPESA_SHORTCODE}` +
    `${process.env.MPESA_PASSKEY}` +
    `${timestamp}`;

  return Buffer.from(raw).toString("base64");
}

export function formatPhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("0")) return "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") || cleaned.startsWith("1"))
    return "254" + cleaned;

  return cleaned;
}
