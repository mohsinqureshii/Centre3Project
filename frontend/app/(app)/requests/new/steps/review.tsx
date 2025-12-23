'use client';

import { apiPost } from '@/lib/api';

export default function StepReview({ draft, back }: any) {
  const submit = async () => {
    await apiPost('/requests', draft);
    window.location.href = '/requests';
  };

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-lg">Step 5 — Review & Submit</h2>

      <section className="border rounded p-4">
        <h3 className="font-semibold">Visit Details</h3>
        <p><strong>Title:</strong> {draft.title}</p>
        <p><strong>Visit Type:</strong> {draft.visitType}</p>
        <p><strong>Purpose:</strong> {draft.purpose}</p>
        <p><strong>Date:</strong> {draft.visitDate}</p>
        <p><strong>Time:</strong> {draft.startTime} → {draft.endTime}</p>
        <p><strong>Host:</strong> {draft.host}</p>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold">Location</h3>
        <p><strong>Location:</strong> {draft.locationName}</p>
        <p><strong>Zone:</strong> {draft.zoneName}</p>
        <p><strong>Room:</strong> {draft.roomName}</p>
      </section>

      <section className="border rounded p-4">
        <h3 className="font-semibold">Visitors</h3>
        {draft.visitors.map((v: any, i: number) => (
          <div key={i} className="border rounded p-2 mb-2">
            <p><strong>Name:</strong> {v.fullName}</p>
            <p><strong>ID:</strong> {v.idNumber}</p>
            {v.company && <p><strong>Company:</strong> {v.company}</p>}
            {v.phone && <p><strong>Phone:</strong> {v.phone}</p>}
            {v.email && <p><strong>Email:</strong> {v.email}</p>}
          </div>
        ))}
      </section>

      <div className="flex gap-4">
        <button onClick={back} className="underline">Back</button>
        <button onClick={submit} className="px-4 py-2 bg-black text-white rounded">
          Submit Request
        </button>
      </div>
    </div>
  );
}
