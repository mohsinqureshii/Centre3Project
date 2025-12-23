"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

type Request = {
  id: string;
  requestNo: string;
  requestType: string;
  status: string;
  purpose?: string;
  startAt: string;
  endAt: string;
  visitors: any[];
  materials: any[];
  attachments: any[];
};

export default function SubmitRequestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet(`/api/requests/${id}`)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return <div className="p-6">Request not found</div>;

  if (data.status !== "DRAFT") {
    return (
      <div className="p-6">
        This request has already been submitted.
      </div>
    );
  }

  // 🔒 CLIENT-SIDE VALIDATION (P1 RULES)
  const issues: string[] = [];

  if (!data.purpose) issues.push("Purpose is required");
  if (!data.visitors?.length)
    issues.push("At least 1 visitor is required");

  async function submit() {
    try {
      await apiPost(`/api/requests/${id}/submit`);
      router.push(`/requests/${id}`);
    } catch (e: any) {
      setError(e.message || "Submit failed");
    }
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <h1 className="text-xl font-semibold">
        Review & Submit
      </h1>

      {/* SUMMARY */}
      <div className="rounded border bg-white p-4 space-y-2">
        <div><strong>Request No:</strong> {data.requestNo}</div>
        <div><strong>Type:</strong> {data.requestType}</div>
        <div><strong>Purpose:</strong> {data.purpose || "—"}</div>
        <div>
          <strong>Duration:</strong>{" "}
          {new Date(data.startAt).toLocaleDateString()} →{" "}
          {new Date(data.endAt).toLocaleDateString()}
        </div>
      </div>

      {/* VALIDATION */}
      {issues.length > 0 && (
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <h3 className="font-medium text-red-700 mb-2">
            Cannot submit yet
          </h3>
          <ul className="list-disc ml-5 text-sm text-red-600">
            {issues.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="rounded border px-4 py-2"
        >
          Back
        </button>

        <button
          disabled={issues.length > 0}
          onClick={submit}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
