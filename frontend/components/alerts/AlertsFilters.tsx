"use client";

import React from "react";

type Props = {
  severity: string;
  setSeverity: (v: string) => void;
  seen: string;
  setSeen: (v: string) => void;
  onMarkedAll: () => void;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AlertsFilters({ severity, setSeverity, seen, setSeen, onMarkedAll }: Props) {
  const [busy, setBusy] = React.useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  async function markAllSeen() {
    const token = getToken();
    if (!token) return alert("Not logged in");
    setBusy(true);
    try {
      const res = await fetch(`${apiBase}/api/alerts/seen-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      onMarkedAll();
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Severity</span>
        <select
          className="border rounded-md px-2 py-1 bg-background"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Seen</span>
        <select className="border rounded-md px-2 py-1 bg-background" value={seen} onChange={(e) => setSeen(e.target.value)}>
          <option value="">All</option>
          <option value="false">Unseen</option>
          <option value="true">Seen</option>
        </select>
      </div>

      <div className="flex-1" />

      <button
        className="rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm disabled:opacity-50"
        onClick={markAllSeen}
        disabled={busy}
      >
        Mark all as seen
      </button>
    </div>
  );
}
