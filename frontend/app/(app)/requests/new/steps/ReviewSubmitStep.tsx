"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

interface Props {
  data: any;
  onBack: () => void;
}

export default function ReviewSubmitStep({ data, onBack }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ CREATE DRAFT
      const draftPayload = {
        title: data.title,
        visitType: data.visitType,
        purpose: data.purpose,
        visitDate: data.visitDate,
        startTime: data.startTime,
        endTime: data.endTime,
        host: data.host,

        locationId: data.location.id,
        zoneId: data.zone.id,
        roomId: data.room.id,

        visitors: data.visitors,
      };

      const draft = await apiPost("/requests/draft", draftPayload);

      if (!draft?.id) {
        throw new Error("Draft creation failed");
      }

      // 2️⃣ SUBMIT DRAFT
      await apiPost(`/requests/${draft.id}/submit`, {});

      // 3️⃣ REDIRECT
      router.push("/requests");
    } catch (e: any) {
      console.error(e);
      setError("Submit failed. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Step 4 — Review & Submit
      </h2>

      <div className="space-y-4 text-sm mb-6">
        <section>
          <h3 className="font-semibold">Visit Details</h3>
          <p>Title: {data.title}</p>
          <p>Type: {data.visitType}</p>
          <p>Purpose: {data.purpose}</p>
          <p>
            Visit Window: {data.visitDate} {data.startTime} → {data.endTime}
          </p>
          <p>Host: {data.host}</p>
        </section>

        <section>
          <h3 className="font-semibold">Location</h3>
          <p>Location: {data.location?.name}</p>
          <p>Zone: {data.zone?.name}</p>
          <p>Room: {data.room?.name}</p>
        </section>

        <section>
          <h3 className="font-semibold">Visitors</h3>
          {data.visitors.map((v: any, i: number) => (
            <p key={i}>
              {v.fullName} — {v.company}
            </p>
          ))}
        </section>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-3">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-2 border">
          Back
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
}
