"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/components/settings/api";

type Process = {
  id: string;
  name: string;
};

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    apiFetch("/api/processes").then(setProcesses);
  }, []);

  async function addStage(processId: string) {
    const stageName = prompt("Stage name:");
    if (!stageName) return;

    const stageOrder = Number(prompt("Stage order (number):") || "1");
    const approverRole =
      prompt(
        "Approver role (e.g. SECURITY_OFFICER):",
        "SECURITY_OFFICER"
      ) || "SECURITY_OFFICER";

    const conditionRaw = prompt(
      'Condition JSON (optional). Example: {"field":"vip","op":"eq","value":true}'
    );

    const conditionJson = conditionRaw ? JSON.parse(conditionRaw) : null;

    await apiFetch(`/api/processes/${processId}/stages`, {
      method: "POST",
      body: JSON.stringify({
        name: stageName,
        order: stageOrder,
        approverRole,
        condition: conditionJson
      })
    });

    alert("Stage added");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Processes</h1>

      {processes.map((p) => (
        <div key={p.id} className="border rounded p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">{p.name}</span>
            <button
              onClick={() => addStage(p.id)}
              className="text-sm text-blue-600"
            >
              Add Stage
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
