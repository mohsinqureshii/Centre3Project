"use client";

import React from "react";
import ZoneCard from "./ZoneCard";
import LockConfirmDialog from "./LockConfirmDialog";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ZonesGrid() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [zones, setZones] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lockAllOpen, setLockAllOpen] = React.useState(false);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/zones/lock-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setZones(json.data || []);
    } catch (e: any) {
      alert(e?.message || "Failed to load zones");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function lockAll(reason?: string) {
    const token = getToken();
    if (!token) return alert("Not logged in");
    const res = await fetch(`${apiBase}/api/zones/lock-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: reason || "Emergency lock all" }),
    });
    if (!res.ok) throw new Error(await res.text());
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          className="rounded-md bg-destructive text-destructive-foreground px-3 py-2 text-sm"
          onClick={() => setLockAllOpen(true)}
        >
          Lock All Zones
        </button>
      </div>

      {loading ? (
        <div className="rounded-xl border p-6 text-sm text-muted-foreground">Loading zones…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((z) => (
            <ZoneCard key={z.id} zone={z} onChanged={load} />
          ))}
        </div>
      )}

      <LockConfirmDialog
        open={lockAllOpen}
        title="Lock all zones?"
        description="This will lock every zone immediately and write an audit log entry."
        confirmLabel="Lock all"
        onOpenChange={setLockAllOpen}
        onConfirm={lockAll}
      />
    </div>
  );
}
