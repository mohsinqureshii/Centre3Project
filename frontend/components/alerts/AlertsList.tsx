"use client";

import React from "react";
import AlertRow from "./AlertRow";

type Props = {
  severity: string;
  seen: string;
  refreshKey: number;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function AlertsList({ severity, seen, refreshKey }: Props) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<any[]>([]);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (seen !== "") params.set("seen", seen);
      if (severity !== "ALL") params.set("severity", severity);

      const res = await fetch(`${apiBase}/api/alerts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setItems(json.data || []);
    } catch (e: any) {
      alert(e?.message || "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity, seen, refreshKey]);

  if (loading) {
    return <div className="rounded-xl border p-6 text-sm text-muted-foreground">Loading alerts…</div>;
  }

  if (items.length === 0) {
    return <div className="rounded-xl border p-6 text-sm text-muted-foreground">No alerts found.</div>;
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="divide-y">
        {items.map((a) => (
          <AlertRow key={a.id} alert={a} onChanged={load} />
        ))}
      </div>
    </div>
  );
}
