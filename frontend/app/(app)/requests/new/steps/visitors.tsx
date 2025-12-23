"use client";

interface Props {
  data: any;
  onBack: () => void;
  onNext: () => void;
  onChange: (data: any) => void;
}

export default function VisitorsStep({
  data,
  onBack,
  onNext,
  onChange,
}: Props) {
  const visitors = Array.isArray(data.visitors) ? data.visitors : [];

  const addVisitor = () => {
    onChange({
      visitors: [
        ...visitors,
        {
          fullName: "",
          idNumber: "",
          company: "",
          phone: "",
          email: "",
        },
      ],
    });
  };

  const updateVisitor = (index: number, field: string, value: string) => {
    const updated = visitors.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    onChange({ visitors: updated });
  };

  const removeVisitor = (index: number) => {
    const updated = visitors.filter((_, i) => i !== index);
    onChange({ visitors: updated });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Step 3 — Visitors
      </h2>

      {visitors.map((visitor, index) => (
        <div
          key={index}
          className="border p-4 mb-4 rounded-md space-y-2"
        >
          <input
            className="w-full border p-2"
            placeholder="Full Name"
            value={visitor.fullName || ""}
            onChange={(e) =>
              updateVisitor(index, "fullName", e.target.value)
            }
          />

          <input
            className="w-full border p-2"
            placeholder="ID Number"
            value={visitor.idNumber || ""}
            onChange={(e) =>
              updateVisitor(index, "idNumber", e.target.value)
            }
          />

          <input
            className="w-full border p-2"
            placeholder="Company"
            value={visitor.company || ""}
            onChange={(e) =>
              updateVisitor(index, "company", e.target.value)
            }
          />

          <input
            className="w-full border p-2"
            placeholder="Phone"
            value={visitor.phone || ""}
            onChange={(e) =>
              updateVisitor(index, "phone", e.target.value)
            }
          />

          <input
            className="w-full border p-2"
            placeholder="Email"
            value={visitor.email || ""}
            onChange={(e) =>
              updateVisitor(index, "email", e.target.value)
            }
          />

          <button
            onClick={() => removeVisitor(index)}
            className="text-red-600 text-sm"
          >
            Remove Visitor
          </button>
        </div>
      ))}

      <button
        onClick={addVisitor}
        className="mb-6 px-4 py-2 border"
      >
        + Add Visitor
      </button>

      <div className="flex gap-2">
        <button onClick={onBack} className="px-4 py-2 border">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={visitors.length === 0}
          className="px-4 py-2 bg-black text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {visitors.length === 0 && (
        <p className="text-sm text-red-600 mt-2">
          At least one visitor is required.
        </p>
      )}
    </div>
  );
}
