"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/components/settings/api";

type User = {
  id: string;
  userCode: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  userType?: "INTERNAL" | "EXTERNAL" | string | null;
  department?: string | null;
  functionName?: string | null;
  zone?: string | null;
  // backend may return `expiry` or `expiresAt` depending on implementation
  expiry?: string | null;
  expiresAt?: string | null;

  isActive: boolean;
};

type SortKey = "userCode" | "fullName" | "email" | "role" | "isActive" | "expiry";
type SortDir = "asc" | "desc";

function pickExpiry(u: User): string | null {
  return u.expiry ?? u.expiresAt ?? null;
}

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function daysUntil(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [sortKey, setSortKey] = useState<SortKey>("userCode");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "REQUESTOR",
    userType: "INTERNAL",
    department: "",
    functionName: "",
    zone: "",
    expiry: "", // yyyy-mm-dd
    tempPassword: "",
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setBannerError(null);
      const data = await apiFetch<User[]>("/api/users");
      setUsers(data);
    } catch (e: any) {
      setBannerError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedUsers = useMemo(() => {
    const arr = [...users];

    const getVal = (u: User) => {
      if (sortKey === "expiry") return pickExpiry(u) ?? "";
      const v: any = (u as any)[sortKey];
      return v ?? "";
    };

    arr.sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);

      // date sort for expiry
      if (sortKey === "expiry") {
        const ad = av ? new Date(av).getTime() : 0;
        const bd = bv ? new Date(bv).getTime() : 0;
        return sortDir === "asc" ? ad - bd : bd - ad;
      }

      // boolean sort for isActive
      if (sortKey === "isActive") {
        const ai = a.isActive ? 1 : 0;
        const bi = b.isActive ? 1 : 0;
        return sortDir === "asc" ? ai - bi : bi - ai;
      }

      // string sort
      const as = String(av).toLowerCase();
      const bs = String(bv).toLowerCase();
      if (as < bs) return sortDir === "asc" ? -1 : 1;
      if (as > bs) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [users, sortKey, sortDir]);

  function openAdd() {
    setMode("add");
    setEditingUserId(null);
    setForm({
      fullName: "",
      email: "",
      phone: "",
      role: "REQUESTOR",
      userType: "INTERNAL",
      department: "",
      functionName: "",
      zone: "",
      expiry: "",
      tempPassword: "",
    });
    setBannerError(null);
    setModalOpen(true);
  }

  function openEdit(u: User) {
    setMode("edit");
    setEditingUserId(u.id);

    const exp = pickExpiry(u);
    const dateOnly =
      exp && !Number.isNaN(new Date(exp).getTime())
        ? new Date(exp).toISOString().slice(0, 10)
        : "";

    setForm({
      fullName: u.fullName || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "REQUESTOR",
      userType: (u.userType as any) || "INTERNAL",
      department: u.department || "",
      functionName: u.functionName || "",
      zone: u.zone || "",
      expiry: dateOnly,
      tempPassword: "", // not shown/changed in edit unless you want it
    });

    setBannerError(null);
    setModalOpen(true);
  }

  async function saveUser() {
    setBannerError(null);

    try {
      if (mode === "add") {
        // create
        await apiFetch("/api/users", {
          method: "POST",
          body: JSON.stringify({
            ...form,
            // send expiry as ISO if present; backend can accept string as well
            expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
          }),
        });
      } else {
        // edit
        if (!editingUserId) throw new Error("Missing user id to edit");

        await apiFetch(`/api/users/${editingUserId}`, {
          method: "PATCH",
          body: JSON.stringify({
            fullName: form.fullName,
            phone: form.phone || null,
            role: form.role,
            userType: form.userType,
            department: form.department || null,
            functionName: form.functionName || null,
            zone: form.zone || null,
            expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
          }),
        });
      }

      setModalOpen(false);
      await loadUsers();
    } catch (e: any) {
      setBannerError(e?.message || "Save failed");
    }
  }

  async function toggleActive(u: User) {
    setBannerError(null);

    // optimistic UI
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)));

    try {
      await apiFetch(`/api/users/${u.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !u.isActive }),
      });
    } catch (e: any) {
      // rollback
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: u.isActive } : x)));
      setBannerError(e?.message || "Failed to update status");
    }
  }

  function Th({
    label,
    k,
  }: {
    label: string;
    k: SortKey;
  }) {
    const active = sortKey === k;
    const arrow = active ? (sortDir === "asc" ? " ↑" : " ↓") : "";
    return (
      <th
        className="p-3 cursor-pointer select-none hover:bg-slate-100"
        onClick={() => toggleSort(k)}
      >
        {label}
        <span className="text-slate-400">{arrow}</span>
      </th>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add User
        </button>
      </div>

      {/* ERROR BANNER */}
      {bannerError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {bannerError}
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-slate-50 text-left">
            <tr>
              <Th label="User Code" k="userCode" />
              <Th label="Name" k="fullName" />
              <Th label="Email" k="email" />
              <th className="p-3">Type</th>
              <Th label="Role" k="role" />
              <Th label="Expiry" k="expiry" />
              <Th label="Active" k="isActive" />
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  Loading users…
                </td>
              </tr>
            )}

            {!loading && sortedUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No users found
                </td>
              </tr>
            )}

            {!loading &&
              sortedUsers.map((u) => {
                const exp = pickExpiry(u);
                const du = daysUntil(exp);
                const expLabel = fmtDate(exp);

                const expPill =
                  du === null
                    ? "bg-slate-100 text-slate-600"
                    : du < 0
                    ? "bg-red-100 text-red-700"
                    : du <= 7
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-700";

                return (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="p-3 font-mono text-xs">{u.userCode}</td>
                    <td className="p-3">{u.fullName}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.userType || "—"}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs ${expPill}`}>
                        {expLabel}
                        {du !== null && du <= 7 && du >= 0 ? ` (in ${du}d)` : ""}
                        {du !== null && du < 0 ? ` (expired)` : ""}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 space-x-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(u)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {u.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="text-xs text-slate-700 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">
                {mode === "add" ? "Add User" : "Edit User"}
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Full Name">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                />
              </Field>

              <Field label="Email">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  disabled={mode === "edit"} // keep email immutable for now
                />
              </Field>

              <Field label="Phone">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </Field>

              <Field label="Role">
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option>REQUESTOR</option>
                  <option>SECURITY_OFFICER</option>
                  <option>SECURITY_SUPERVISOR</option>
                  <option>DC_MANAGER</option>
                  <option>SUPER_ADMIN</option>
                </select>
              </Field>

              <Field label="User Type">
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.userType}
                  onChange={(e) => setForm((f) => ({ ...f, userType: e.target.value }))}
                >
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="EXTERNAL">EXTERNAL</option>
                </select>
              </Field>

              <Field label="Expiry">
                <input
                  type="date"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.expiry}
                  onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
                />
              </Field>

              <Field label="Department">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                />
              </Field>

              <Field label="Function">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.functionName}
                  onChange={(e) => setForm((f) => ({ ...f, functionName: e.target.value }))}
                />
              </Field>

              <Field label="Zone">
                <input
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  value={form.zone}
                  onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))}
                />
              </Field>

              {mode === "add" && (
                <Field label="Temporary Password">
                  <input
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    value={form.tempPassword}
                    onChange={(e) => setForm((f) => ({ ...f, tempPassword: e.target.value }))}
                  />
                </Field>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveUser}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {mode === "add" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-600">{label}</div>
      {children}
    </div>
  );
}
