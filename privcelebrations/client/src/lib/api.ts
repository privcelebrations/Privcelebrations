// src/lib/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://privcelebrations-backend.onrender.com"; // dev fallback

export async function sendContact(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
