"use client";
import React from "react";
import { apiFetch } from "@/components/settings/api";

type AlertType = { key:string; name:string; defaultSeverity:"INFO"|"WARNING"|"CRITICAL"; routingRoles:string[] };

export default function AlertTypesPage() {
  const [alertTypes, setAlertTypes] = React.useState<AlertType[]>([]);
  const [error, setError] = React.useState<string|null>(null);

  async function load() {
    const data = await apiFetch<{alertTypes: AlertType[]}>("/api/alert-types");
    setAlertTypes(data.alertTypes || []);
  }
  React.useEffect(()=>{ load().catch(e=>setError(e.message)); }, []);

  async function save() {
    await apiFetch("/api/alert-types", { method:"PUT", body: JSON.stringify({ alertTypes }) });
    alert("Saved");
  }

  function add() {
    setAlertTypes(prev => [...prev, { key:"NEW_TYPE", name:"New Type", defaultSeverity:"INFO", routingRoles:["SECURITY_OFFICER"] }]);
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Alert Types</h1>
        <p className="text-sm text-muted-foreground">Config-backed alert types (severity default + routing roles).</p>
      </div>
      {error && <div className="text-red-500 text-sm whitespace-pre-wrap">{error}</div>}

      <div className="rounded-xl border p-4 space-y-3">
        <button className="px-3 py-2 rounded-md border" onClick={add}>+ Add</button>
        <div className="space-y-3">
          {alertTypes.map((a, idx)=>(
            <div key={idx} className="p-3 rounded border space-y-2">
              <div className="grid md:grid-cols-4 gap-2">
                <input className="border rounded-md p-2" value={a.key} onChange={e=>{
                  const v = e.target.value; setAlertTypes(prev=>prev.map((x,i)=> i===idx ? {...x,key:v}:x));
                }} placeholder="Key"/>
                <input className="border rounded-md p-2" value={a.name} onChange={e=>{
                  const v = e.target.value; setAlertTypes(prev=>prev.map((x,i)=> i===idx ? {...x,name:v}:x));
                }} placeholder="Name"/>
                <select className="border rounded-md p-2" value={a.defaultSeverity} onChange={e=>{
                  const v = e.target.value as any; setAlertTypes(prev=>prev.map((x,i)=> i===idx ? {...x,defaultSeverity:v}:x));
                }}>
                  {["INFO","WARNING","CRITICAL"].map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                <input className="border rounded-md p-2" value={a.routingRoles.join(",")} onChange={e=>{
                  const v = e.target.value.split(",").map(s=>s.trim()).filter(Boolean);
                  setAlertTypes(prev=>prev.map((x,i)=> i===idx ? {...x,routingRoles:v}:x));
                }} placeholder="Routing roles comma-separated"/>
              </div>
            </div>
          ))}
          {alertTypes.length===0 && <div className="text-sm text-muted-foreground">No alert types</div>}
        </div>
        <button className="px-3 py-2 rounded-md bg-black text-white" onClick={save}>Save</button>
      </div>
    </div>
  );
}
