"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@centre3.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, go to dashboard
  useEffect(() => {
    const token = localStorage.getItem("centre3_token");
    if (token) router.replace("/dashboard");
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (!data.token) {
        throw new Error("Login failed: Backend did not return token");
      }

      // Save JWT
      localStorage.setItem("centre3_token", data.token);

      // Redirect after login
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl font-semibold mb-4">
          Hello 👋 <br /> Welcome back
        </h1>
        <p className="opacity-80">Secure access management for Centre3.</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6 bg-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-1">Login</h2>

          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full mb-4 rounded-lg border px-3 py-2"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full mb-4 rounded-lg border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
