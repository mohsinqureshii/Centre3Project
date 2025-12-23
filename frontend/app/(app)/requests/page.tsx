"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

export default function RequestsPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/requests")
      .then(setData)
      .catch(() => setError("Failed to load requests"));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-semibold">Requests</h1>
        <Link
          href="/requests/new"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          + New Request
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <table className="w-full border rounded bg-white">
        <thead className="bg-zinc-50 text-sm">
          <tr>
            <th className="p-2 text-left">Request No</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={5} className="p-4 text-center text-sm text-zinc-500">
                No requests yet.
              </td>
            </tr>
          )}

          {data.map((r) => (
            <tr key={r.id} className="border-t text-sm">
              <td className="p-2">{r.requestNo}</td>
              <td>{r.requestType}</td>
              <td>{r.status}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>
                <Link
                  href={`/requests/${r.id}`}
                  className="text-blue-600"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
