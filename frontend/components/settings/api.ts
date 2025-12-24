export async function apiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || "";

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Always normalize slashes
  const url =
    base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}
