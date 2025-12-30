"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type Credential = {
  id: string;
  visitorName: string;
  type: string;
  status: string;
  zoneName?: string;
  allowedZoneNames: string[];
};

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiGet("/api/credentials");
        setCredentials(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading credentials...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Credentials</h1>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Visitor Name</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
            <th className="p-2">Zone</th>
            <th className="p-2">Allowed Zones</th>
          </tr>
        </thead>
        <tbody>
          {credentials.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                No credentials found
              </td>
            </tr>
          )}

          {credentials.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.visitorName}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">{c.zoneName || "—"}</td>
              <td className="p-2">{c.allowedZoneNames.join(", ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
