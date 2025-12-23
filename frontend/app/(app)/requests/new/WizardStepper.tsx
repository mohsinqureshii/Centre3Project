"use client";

const steps = [
  { id: 1, title: "Visit Basics" },
  { id: 2, title: "Location" },
  { id: 3, title: "Visitors" },
  { id: 4, title: "Review & Submit" },
];

interface Props {
  currentStep: number;
  visitDate?: string;
  startTime?: string;
  endTime?: string;
}

export default function WizardStepper({
  currentStep,
  visitDate,
  startTime,
  endTime,
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex gap-3 border-b">
        {steps.map((step) => {
          const active = step.id === currentStep;
          const done = step.id < currentStep;

          return (
            <div
              key={step.id}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                active
                  ? "border-blue-600 text-blue-600"
                  : done
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-400"
              }`}
            >
              {step.title}
            </div>
          );
        })}
      </div>

      {visitDate && startTime && endTime && (
        <div className="mt-2 text-sm text-gray-600">
          Visit Window:{" "}
          <span className="font-medium">
            {visitDate} {startTime} → {endTime}
          </span>
        </div>
      )}
    </div>
  );
}
