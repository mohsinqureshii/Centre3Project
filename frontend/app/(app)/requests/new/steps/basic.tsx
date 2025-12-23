"use client";

interface Props {
  data: any;
  onNext: () => void;
  onChange: (data: any) => void;
  onBack?: () => void; // ✅ optional (important)
}

export default function BasicStep({
  data,
  onNext,
  onChange,
}: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Step 1 — Visit Basics
      </h2>

      {/* Request Title */}
      <input
        className="w-full border p-2 mb-3"
        placeholder="Request Title"
        value={data.title || ""}
        onChange={(e) => onChange({ title: e.target.value })}
      />

      {/* Visit Type */}
      <select
        className="w-full border p-2 mb-3 text-black bg-white"
        value={data.visitType || ""}
        onChange={(e) => onChange({ visitType: e.target.value })}
      >
        <option value="">Select Visit Type</option>
        <option value="ADMIN">Admin Visit</option>
        <option value="MOP">Method of Procedure (MOP)</option>
        <option value="MVP">Material / Vehicle Pass (MVP)</option>
        <option value="WP">Work Permit</option>
      </select>

      {/* Purpose */}
      <textarea
        className="w-full border p-2 mb-3"
        placeholder="Purpose / Description"
        value={data.purpose || ""}
        onChange={(e) => onChange({ purpose: e.target.value })}
      />

      {/* Date */}
      <input
        type="date"
        className="w-full border p-2 mb-3"
        value={data.visitDate || ""}
        onChange={(e) => onChange({ visitDate: e.target.value })}
      />

      {/* Time Range */}
      <div className="flex gap-2 mb-3">
        <input
          type="time"
          className="w-full border p-2"
          value={data.startTime || ""}
          onChange={(e) => onChange({ startTime: e.target.value })}
        />
        <input
          type="time"
          className="w-full border p-2"
          value={data.endTime || ""}
          onChange={(e) => onChange({ endTime: e.target.value })}
        />
      </div>

      {/* Host */}
      <input
        className="w-full border p-2 mb-4"
        placeholder="Internal Host"
        value={data.host || ""}
        onChange={(e) => onChange({ host: e.target.value })}
      />

      <button
        onClick={onNext}
        className="px-4 py-2 bg-black text-white"
      >
        Next
      </button>
    </div>
  );
}
