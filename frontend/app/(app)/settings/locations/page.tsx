"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Location = {
  id: string;
  country: string;
  region: string;
  city: string;
  siteCode: string;
  siteName: string;
  isActive: boolean;
};

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="text-base font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState("UAE");
  const [region, setRegion] = useState("Middle East");
  const [city, setCity] = useState("Dubai");
  const [siteCode, setSiteCode] = useState("DXB-DC1");
  const [siteName, setSiteName] = useState("Dubai Data Center 1");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet("/api/settings/locations");
      setLocations(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load locations");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canSubmit = useMemo(() => {
    return country.trim() && region.trim() && city.trim() && siteCode.trim() && siteName.trim();
  }, [country, region, city, siteCode, siteName]);

  async function createLocation(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError(null);

    try {
      const created = await apiPost("/api/settings/locations", {
        country,
        region,
        city,
        siteCode,
        siteName,
      });

      setLocations((prev) => [created, ...prev]);
      setOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to create location");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Locations</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={load}>Refresh</Button>
          <Button onClick={() => setOpen(true)}>Add Location</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="font-semibold">Location List</CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50 text-left">
              <tr>
                <th className="p-3">Country</th>
                <th className="p-3">Region</th>
                <th className="p-3">City</th>
                <th className="p-3">Site Code</th>
                <th className="p-3">Site Name</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    Loading locations...
                  </td>
                </tr>
              )}

              {!loading && locations.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-500">
                    No locations defined
                  </td>
                </tr>
              )}

              {locations.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="p-3">{l.country}</td>
                  <td className="p-3">{l.region}</td>
                  <td className="p-3">{l.city}</td>
                  <td className="p-3 font-mono">{l.siteCode}</td>
                  <td className="p-3">{l.siteName}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        l.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {l.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal
        open={open}
        title="Add Location"
        onClose={() => {
          if (!saving) setOpen(false);
        }}
      >
        <form onSubmit={createLocation} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Site Code</label>
              <input
                className="w-full rounded-lg border px-3 py-2 font-mono"
                value={siteCode}
                onChange={(e) => setSiteCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Site Name</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || saving}>
              {saving ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
