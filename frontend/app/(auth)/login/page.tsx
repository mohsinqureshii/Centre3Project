"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@centre3.local");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("centre3_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TEMP login (backend auth comes later)
    localStorage.setItem("centre3_token", "demo-token");
    router.replace("/dashboard");
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center px-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="text-sm font-semibold opacity-90 mb-6">
          Centre3 Security Operations
        </div>

        <h1 className="text-4xl font-semibold mb-4">
          Hello 👋 <br /> Welcome back
        </h1>

        <p className="text-white/90 max-w-md">
          Secure data center access management platform.
          Control visits, approvals, security alerts, and emergency locks
          from one centralized dashboard.
        </p>

        <div className="mt-10 text-sm text-white/70">
          © 2025 Centre3. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center px-6 bg-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-1">Login</h2>
          <p className="text-sm text-slate-500 mb-6">
            Sign in to your account
          </p>

          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full mb-4 rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full mb-4 rounded-lg border border-slate-300 px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-2 font-medium
                       hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-xs text-slate-500 mt-4 text-center">
            Seed users use password <b>admin123</b>
          </p>
        </form>
      </div>
    </div>
  );
}
