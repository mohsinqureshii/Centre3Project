"use client";

import React, { useEffect, useState } from "react";

type Row = {
  requestNo: string;
  requestType: string;
  status: string;
  requestorName: string;
  siteName?: string;
  startAt: string;
  endAt: string;
  timeLeftMinutes: number;
};

export default function ReportsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tab, setTab] = useState<"admin-visits"|"temporary-entry"|"tep">("admin-visits");

  useEffect(() => {
    fetch(`/api/reports/${tab === "admin-visits" ? "admin-visits" : tab === "temporary-entry" ? "temporary-entry-logs" : "tep-lists"}`)
      .then(r => r.json())
      .then(setRows)
      .catch(() => setRows([]));
  }, [tab]);

  const exportCsv = () => {
    window.location.href = `/api/reports/export?type=${tab}&format=csv`;
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Reports</h1>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        {(["admin-visits","temporary-entry","tep"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: tab===t?"#f3f3f3":"white" }}>
            {t}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={exportCsv} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}>Export CSV</button>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Request No","Type","Status","Requestor","Site","Time Left (min)"] .map(h => (
                <th key={h} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.requestNo}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.requestType}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.status}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.requestorName}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.siteName || "-"}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #f1f1f1" }}>{r.timeLeftMinutes}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16 }}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
