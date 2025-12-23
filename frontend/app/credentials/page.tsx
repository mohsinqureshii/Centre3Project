"use client";

import React, { useEffect, useState } from "react";

type Credential = {
  id: string;
  requestId: string;
  visitorName: string;
  type: string;
  status: string;
  credentialNumber?: string | null;
  validFrom: string;
  validUntil: string;
};

export default function CredentialsPage() {
  const [rows, setRows] = useState<Credential[]>([]);

  useEffect(() => {
    fetch("/api/credentials")
      .then(r => r.json())
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Credentials</h1>
        <a href="/credentials/new" style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8 }}>Issue Credential</a>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Visitor","Type","Status","Badge","Valid Until"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}><a href={`/credentials/${r.id}`}>{r.visitorName}</a></td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.type}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.status}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.credentialNumber || "-"}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{new Date(r.validUntil).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 16 }}>No credentials yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
