"use client";

import React, { useEffect, useState } from "react";

export default function CredentialDetail({ params }: { params: { id: string } }) {
  const [row, setRow] = useState<any>(null);
  const id = params.id;

  useEffect(() => {
    fetch("/api/credentials")
      .then(r => r.json())
      .then((rows) => setRow((rows || []).find((x: any) => x.id === id)))
      .catch(() => setRow(null));
  }, [id]);

  const act = async (action: string) => {
    await fetch(`/api/credentials/${id}/${action}`, { method: "POST" });
    window.location.reload();
  };

  if (!row) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Credential</h1>
      <pre style={{ background: "#fafafa", padding: 12, borderRadius: 12, border: "1px solid #eee" }}>{JSON.stringify(row, null, 2)}</pre>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => act("suspend")} style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8 }}>Suspend</button>
        <button onClick={() => act("revoke")} style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8 }}>Revoke</button>
        <button onClick={() => act("replace")} style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8 }}>Replace</button>
      </div>
    </div>
  );
}
