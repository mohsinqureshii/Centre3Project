"use client";

import { useState } from "react";
import WizardStepper from "./WizardStepper";

// ✅ REAL FILES
import BasicStep from "./steps/basic";
import LocationStep from "./steps/location";
import VisitorsStep from "./steps/visitors";
import ReviewSubmitStep from "./steps/ReviewSubmitStep";

export default function CreateRequestPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<any>({
    title: "",
    visitType: "",
    purpose: "",
    visitDate: "",
    startTime: "",
    endTime: "",
    host: "",

    location: null,
    zone: null,
    room: null,

    visitors: [],
  });

  const updateForm = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <div className="p-6">
      <WizardStepper
        currentStep={step}
        visitDate={formData.visitDate}
        startTime={formData.startTime}
        endTime={formData.endTime}
      />

      {step === 1 && (
        <BasicStep
          data={formData}
          onNext={() => setStep(2)}
          onChange={updateForm}
        />
      )}

      {step === 2 && (
        <LocationStep
          data={formData}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          onChange={updateForm}
        />
      )}

      {step === 3 && (
        <VisitorsStep
          data={formData}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          onChange={updateForm}
        />
      )}

      {step === 4 && (
        <ReviewSubmitStep
          data={formData}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
