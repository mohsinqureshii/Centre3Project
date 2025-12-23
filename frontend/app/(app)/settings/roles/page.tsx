"use client";
import React from "react";
import { apiFetch } from "@/components/settings/api";

type PermissionsMatrix = Record<string, Record<string, boolean>>;

const PERMISSIONS = [
  "settings:read","settings:write",
  "requests:read","requests:write",
  "approvals:act",
  "alerts:read","alerts:write",
  "locks:act",
  "reports:read","reports:export"
];

export default function RolesPage() {
  const [roles, setRoles] = React.useState<string[]>([]);
  const [permissions, setPermissions] = React.useState<PermissionsMatrix>({});
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setError(null);
    const data = await apiFetch<{roles: string[], permissions: PermissionsMatrix}>("/api/roles/permissions");
    setRoles(data.roles);
    setPermissions(data.permissions || {});
  }

  React.useEffect(()=>{ load().catch(e=>setError(e.message)); }, []);

  function toggle(role: string, perm: string) {
    setPermissions(prev => ({
      ...prev,
      [role]: { ...(prev[role]||{}), [perm]: !(prev[role]?.[perm]) }
    }));
  }

  async function save() {
    await apiFetch("/api/roles/permissions", { method:"PUT", body: JSON.stringify({ permissions }) });
    alert("Saved");
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
        <p className="text-sm text-muted-foreground">Config-backed permissions matrix (no schema changes).</p>
      </div>
      {error && <div className="text-red-500 text-sm whitespace-pre-wrap">{error}</div>}

      <div className="rounded-xl border overflow-auto">
        <table className="min-w-[900px] text-sm w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Permission</th>
              {roles.map(r => <th key={r} className="p-2 text-left">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map(p => (
              <tr key={p} className="border-t">
                <td className="p-2 font-medium">{p}</td>
                {roles.map(r => (
                  <td key={r} className="p-2">
                    <input
                      type="checkbox"
                      checked={!!permissions?.[r]?.[p]}
                      onChange={()=>toggle(r,p)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="px-3 py-2 rounded-md bg-black text-white" onClick={save}>Save</button>
    </div>
  );
}
