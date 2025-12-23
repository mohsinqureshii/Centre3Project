"use client";

type Props = {
  onNext: () => void;
};

export default function RequestTypeStep({ onNext }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Select Request Type</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          "Admin Visit",
          "Temporary Entry Permission",
          "Work Permit",
          "Method of Procedure",
          "Material & Vehicle Permit",
        ].map((type) => (
          <button
            key={type}
            className="rounded-lg border p-4 text-left hover:bg-gray-50"
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
