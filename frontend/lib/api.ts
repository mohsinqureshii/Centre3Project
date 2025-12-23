const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

async function api(
  path: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/* ============================
   ✅ NAMED HELPERS (REQUIRED)
   ============================ */

export async function apiGet(path: string) {
  return api(path, { method: "GET" });
}

export async function apiPost(path: string, body?: unknown) {
  return api(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined
  });
}

export async function apiPut(path: string, body?: unknown) {
  return api(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined
  });
}

export async function apiDelete(path: string) {
  return api(path, { method: "DELETE" });
}

/* ============================
   DEFAULT EXPORT (BACKWARD SAFE)
   ============================ */

export default api;
