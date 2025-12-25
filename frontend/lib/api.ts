// frontend/lib/api.ts

// Remove trailing slash from base URL
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:4001";

// Read stored token
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("centre3_token");
}

// Main fetch wrapper
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
) {
  // Ensure single slash only
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE}${cleanPath}`;

  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Handle failed requests
  if (!res.ok) {
    let message = res.statusText;

    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}

    throw new Error(message);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return null as T;
  }
}

// Helpers
export const apiGet = <T = any>(path: string) => apiFetch<T>(path);

export const apiPost = <T = any>(path: string, body: any) =>
  apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPatch = <T = any>(path: string, body: any) =>
  apiFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const apiDelete = <T = any>(path: string) =>
  apiFetch<T>(path, {
    method: "DELETE",
  });
