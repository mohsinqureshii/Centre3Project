"use client";

import React from "react";
import LockConfirmDialog from "./LockConfirmDialog";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ZoneCard({ zone, onChanged }: { zone: any; onChanged: () => void }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [action, setAction] = React.useState<"lock" | "unlock">("lock");

  async function doAction(reason?: string) {
    const token = getToken();
    if (!token) return alert("Not logged in");
    const endpoint = action === "lock" ? "lock" : "unlock";
    const res = await fetch(`${apiBase}/api/zones/${zone.id}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: reason || "" }),
    });
    if (!res.ok) throw new Error(await res.text());
    await onChanged();
  }

  const locked = zone.state === "LOCKED";

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Zone</div>
          <div className="text-lg font-semibold">{zone.name}</div>
          <div className="text-xs text-muted-foreground mt-1">{zone.locationName}</div>
        </div>

        <span
          className={
            "text-xs px-2 py-1 rounded-full border " +
            (locked ? "bg-red-600/15 text-red-600 border-red-600/30" : "bg-green-600/15 text-green-600 border-green-600/30")
          }
        >
          {locked ? "LOCKED" : "ACTIVE"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Occupancy</div>
          <div className="text-2xl font-semibold">{zone.occupancy}</div>
        </div>

        <button
          className={
            "rounded-md px-3 py-2 text-sm " +
            (locked ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground")
          }
          onClick={() => {
            setAction(locked ? "unlock" : "lock");
            setConfirmOpen(true);
          }}
        >
          {locked ? "Unlock" : "Lock"}
        </button>
      </div>

      <LockConfirmDialog
        open={confirmOpen}
        title={action === "lock" ? "Lock zone?" : "Unlock zone?"}
        description={action === "lock" ? "This will lock the zone and write an audit entry." : "This will unlock the zone and write an audit entry."}
        confirmLabel={action === "lock" ? "Lock" : "Unlock"}
        onOpenChange={setConfirmOpen}
        onConfirm={doAction}
      />
    </div>
  );
}
