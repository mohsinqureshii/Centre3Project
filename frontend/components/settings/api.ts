// frontend/components/settings/api.ts

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "";

  // Get token (client side)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Avoid double slashes "//api"
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
    let message = "";
    try {
      message = await res.text();
    } catch {
      message = res.statusText || "Request failed";
    }
    throw new Error(message);
  }

  // Return JSON as type T
  return res.json() as Promise<T>;
}
