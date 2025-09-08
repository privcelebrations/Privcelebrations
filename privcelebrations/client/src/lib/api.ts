// client/src/lib/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://privcelebrations-backend.onrender.com";

export async function sendContact(data: any) {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || `API responded with status ${res.status}`);
  }

  return res.json();
}
