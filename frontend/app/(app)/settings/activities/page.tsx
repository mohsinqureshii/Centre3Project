"use client";
import React from "react";
import { apiFetch } from "@/components/settings/api";

export default function ActivitiesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [activities, setActivities] = React.useState<any[]>([]);
  const [processes, setProcesses] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string|null>(null);

  const [catName, setCatName] = React.useState("");
  const [form, setForm] = React.useState({ categoryId:"", name:"", riskLevel:"Low", defaultProcessId:"" });

  async function load() {
    const cats = await apiFetch<{categories:any[]}>("/api/activity-categories");
    const acts = await apiFetch<{activities:any[]}>("/api/activities");
    const procs = await apiFetch<{processes:any[]}>("/api/processes");
    setCategories(cats.categories);
    setActivities(acts.activities);
    setProcesses(procs.processes);
  }
  React.useEffect(()=>{ load().catch(e=>setError(e.message)); }, []);

  async function createCategory() {
    await apiFetch("/api/activity-categories", { method:"POST", body: JSON.stringify({ name: catName }) });
    setCatName("");
    await load();
  }

  async function createActivity() {
    await apiFetch("/api/activities", { method:"POST", body: JSON.stringify({
      ...form,
      defaultProcessId: form.defaultProcessId || null
    })});
    setForm({ categoryId:"", name:"", riskLevel:"Low", defaultProcessId:"" });
    await load();
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Activities</h1>
        <p className="text-sm text-muted-foreground">Manage activity categories and activities with risk level + default process mapping.</p>
      </div>
      {error && <div className="text-red-500 text-sm whitespace-pre-wrap">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 space-y-3">
          <div className="font-medium">Create Category</div>
          <input className="border rounded-md p-2 w-full" placeholder="Category name" value={catName} onChange={e=>setCatName(e.target.value)} />
          <button className="px-3 py-2 rounded-md bg-black text-white" onClick={createCategory}>Create</button>

          <div className="pt-4 border-t">
            <div className="font-medium mb-2">Categories</div>
            <ul className="text-sm space-y-1">
              {categories.map(c=><li key={c.id} className="p-2 rounded border">{c.name}</li>)}
              {categories.length===0 && <li className="text-muted-foreground">No categories</li>}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border p-4 space-y-3">
          <div className="font-medium">Create Activity</div>
          <select className="border rounded-md p-2 w-full" value={form.categoryId} onChange={e=>setForm({...form, categoryId:e.target.value})}>
            <option value="">Select category</option>
            {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input className="border rounded-md p-2 w-full" placeholder="Activity name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="border rounded-md p-2 w-full" value={form.riskLevel} onChange={e=>setForm({...form, riskLevel:e.target.value})}>
            {["Low","Medium","High","Critical"].map(r=><option key={r} value={r}>{r}</option>)}
          </select>
          <select className="border rounded-md p-2 w-full" value={form.defaultProcessId} onChange={e=>setForm({...form, defaultProcessId:e.target.value})}>
            <option value="">Default process (optional)</option>
            {processes.map((p:any)=><option key={p.id} value={p.id}>{p.name} ({p.requestType})</option>)}
          </select>
          <button className="px-3 py-2 rounded-md bg-black text-white" onClick={createActivity}>Create</button>

          <div className="pt-4 border-t">
            <div className="font-medium mb-2">Activities</div>
            <div className="text-sm space-y-2">
              {activities.map(a=>(
                <div key={a.id} className="p-2 rounded border">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-muted-foreground">{a.category?.name} • Risk: {a.riskLevel}</div>
                </div>
              ))}
              {activities.length===0 && <div className="text-muted-foreground">No activities</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
