"use client";

import React, { useState } from "react";

export default function IssueCredentialPage() {
  const [requestId, setRequestId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [type, setType] = useState("RFID_CARD");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    const res = await fetch("/api/credentials/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, visitorName, type, validFrom, validUntil, allowedZoneIds: [] })
    });
    const json = await res.json();
    if (!res.ok) return setMsg(json?.message || "Failed");
    window.location.href = `/credentials/${json.id}`;
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Issue Credential</h1>
      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        <label>Request ID<input value={requestId} onChange={e => setRequestId(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }} /></label>
        <label>Visitor Name<input value={visitorName} onChange={e => setVisitorName(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }} /></label>
        <label>Type
          <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }}>
            <option value="RFID_CARD">RFID / Magnetic</option>
            <option value="MOBILE_BLE">Mobile BLE</option>
            <option value="QR_PASS">QR Pass</option>
          </select>
        </label>
        <label>Valid From<input type="datetime-local" value={validFrom} onChange={e => setValidFrom(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }} /></label>
        <label>Valid Until<input type="datetime-local" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }} /></label>
        <button onClick={submit} style={{ padding: "10px 12px", border: "1px solid #ddd", borderRadius: 10 }}>Issue</button>
        {msg && <div style={{ color: "crimson" }}>{msg}</div>}
      </div>
    </div>
  );
}
