"use client";

import React from "react";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function AlertRow({ alert, onChanged }: { alert: any; onChanged: () => void }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [busy, setBusy] = React.useState(false);

  async function markSeen() {
    const token = getToken();
    if (!token) return alert("Not logged in");
    setBusy(true);
    try {
      const res = await fetch(`${apiBase}/api/alerts/${alert.id}/seen`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      onChanged();
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  const sev = alert.severity;
  const sevClass =
    sev === "CRITICAL"
      ? "bg-red-600/15 text-red-600 border-red-600/30"
      : sev === "WARNING"
      ? "bg-yellow-600/15 text-yellow-600 border-yellow-600/30"
      : "bg-blue-600/15 text-blue-600 border-blue-600/30";

  const locationBits = [alert.entryPoint, alert.room, alert.zoneId].filter(Boolean);

  return (
    <div className="p-4 flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">{alert.title}</div>
          <span className={`text-xs px-2 py-0.5 rounded-full border ${sevClass}`}>{sev}</span>
          {!alert.isSeen && <span className="text-xs px-2 py-0.5 rounded-full border">Unseen</span>}
        </div>
        {alert.description && <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>}
        <div className="text-xs text-muted-foreground mt-2">
          {locationBits.length > 0 ? locationBits.join(" • ") + " • " : ""}
          {timeAgo(alert.createdAt)}
        </div>
      </div>

      {!alert.isSeen && (
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
          onClick={markSeen}
          disabled={busy}
        >
          Mark seen
        </button>
      )}
    </div>
  );
}
