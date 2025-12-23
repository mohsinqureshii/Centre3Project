"use client";
import React from "react";
import { apiFetch } from "@/components/settings/api";

const REQUEST_TYPES = ["ADMIN_VISIT","TEMPORARY_ENTRY_PERMISSION","WORK_PERMIT","METHOD_OF_PROCEDURE","MATERIAL_VEHICLE_PERMIT"];
const ROLES = ["SUPER_ADMIN","SECURITY_OFFICER","SECURITY_SUPERVISOR","DC_MANAGER","COMPLIANCE","REQUESTOR"];

export default function ProcessesPage() {
  const [processes, setProcesses] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string|null>(null);
  const [form, setForm] = React.useState({ name:"", requestType:"WORK_PERMIT", isActive:true });

  async function load() {
    const data = await apiFetch<{processes:any[]}>("/api/processes");
    setProcesses(data.processes);
  }
  React.useEffect(()=>{ load().catch(e=>setError(e.message)); }, []);

  async function createProcess() {
    await apiFetch("/api/processes", { method:"POST", body: JSON.stringify(form) });
    setForm({ name:"", requestType:"WORK_PERMIT", isActive:true });
    await load();
  }

  async function addStage(processId:string) {
    const stageName = prompt("Stage name:");
    if (!stageName) return;
    const stageOrder = Number(prompt("Stage order (number):") || "1");
    const approverRole = prompt("Approver role (e.g. SECURITY_OFFICER):", "SECURITY_OFFICER") || "SECURITY_OFFICER";
    const conditionRaw = prompt("Condition JSON (optional). Example: {"field":"vip","op":"eq","value":true}");
    const conditionJson = conditionRaw ? JSON.parse(conditionRaw) : null;
    await apiFetch(`/api/processes/${processId}/stages`, {
      method:"POST",
      body: JSON.stringify({ stageOrder, name: stageName, approverRole, conditionJson })
    });
    await load();
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Processes</h1>
        <p className="text-sm text-muted-foreground">Create process definitions and stages. (Condition Builder can be enhanced later; this stores conditionJson safely.)</p>
      </div>
      {error && <div className="text-red-500 text-sm whitespace-pre-wrap">{error}</div>}

      <div className="rounded-xl border p-4 space-y-3">
        <div className="font-medium">Create Process</div>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="border rounded-md p-2" placeholder="Process name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
          <select className="border rounded-md p-2" value={form.requestType} onChange={e=>setForm({...form,requestType:e.target.value})}>
            {REQUEST_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={e=>setForm({...form,isActive:e.target.checked})}/>
            Active
          </label>
        </div>
        <button className="px-3 py-2 rounded-md bg-black text-white" onClick={createProcess}>Create</button>
      </div>

      <div className="space-y-3">
        {processes.map(p=>(
          <div key={p.id} className="rounded-xl border">
            <div className="p-3 border-b flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.requestType} • {p.isActive ? "Active" : "Inactive"}</div>
              </div>
              <button className="px-2 py-1 rounded border" onClick={()=>addStage(p.id)}>+ Add Stage</button>
            </div>
            <div className="p-3">
              <div className="text-sm font-medium mb-2">Stages</div>
              <div className="space-y-2">
                {(p.stages||[]).map((s:any)=>(
                  <div key={s.id} className="p-2 rounded border text-sm">
                    <div className="font-medium">#{s.stageOrder} {s.name}</div>
                    <div className="text-muted-foreground">Role: {s.approverRole} {s.slaHours ? `• SLA ${s.slaHours}h` : ""}</div>
                    {s.conditionJson && <pre className="text-xs mt-2 bg-muted p-2 rounded overflow-auto">{JSON.stringify(s.conditionJson,null,2)}</pre>}
                  </div>
                ))}
                {(p.stages||[]).length===0 && <div className="text-sm text-muted-foreground">No stages</div>}
              </div>
            </div>
          </div>
        ))}
        {processes.length===0 && <div className="text-sm text-muted-foreground">No processes</div>}
      </div>
    </div>
  );
}
