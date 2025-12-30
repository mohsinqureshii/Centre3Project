
// "use client";



// import { useEffect, useState, useRef } from "react";

// import { createPortal } from "react-dom";

// import { apiGet, apiPost } from "@/lib/api";

// import { Card, CardHeader, CardContent } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";

// import { ChevronDown } from "lucide-react";



// type Zone = {

// id: string;

// name: string;

// code?: string;

// locationName: string;

// };



// type Location = {

// id: string;

// name: string;

// };



// export default function ZonesPage() {

// const [zones, setZones] = useState<Zone[]>([]);

// const [locations, setLocations] = useState<Location[]>([]);

// const [selectedLocation, setSelectedLocation] = useState<string>("");



// const [isDropdownOpen, setIsDropdownOpen] = useState(false);

// const dropdownRef = useRef<HTMLDivElement>(null);



// const [loading, setLoading] = useState(true);

// const [error, setError] = useState<string | null>(null);

// const [showModal, setShowModal] = useState(false);

// const [zoneName, setZoneName] = useState("");

// const [zoneCode, setZoneCode] = useState("");

// const [saving, setSaving] = useState(false);



// // Close dropdown when clicking outside

// useEffect(() => {

// function handleClickOutside(event: MouseEvent) {

// if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {

// setIsDropdownOpen(false);

// }

// }

// document.addEventListener("mousedown", handleClickOutside);

// return () => document.removeEventListener("mousedown", handleClickOutside);

// }, []);



// async function loadZones() {

// setLoading(true);

// try {

// const data = await apiGet("/api/settings/zones");

// if (Array.isArray(data)) setZones(data);

// } catch (e: any) {

// setError(e.message || "Failed to load zones");

// } finally {

// setLoading(false);

// }

// }



// async function loadLocations() {

// try {

// const data = await apiGet("/api/settings/locations");

// if (Array.isArray(data) && data.length > 0) {

// setLocations(data);
// console.log(data)
//           setSelectedLocation(data[0].id);
//           console.log("Full locations array:", data); // Check the entire array
//           console.log("First location object:", data[0]); // Critically, check the first object
//           console.log("Name of first location:", data[0]?.name); // Check its 'name' property
// }

// } catch (e: any) {

// console.error("Failed to load locations:", e.message);

// }

// }



// async function createZone() {

// if (!zoneName.trim() || !selectedLocation) return;

// setSaving(true);

// try {

// await apiPost("/api/settings/zones", {

// name: zoneName,

// code: zoneCode || undefined,

// locationId: selectedLocation,

// });

// setShowModal(false);

// setZoneName("");

// setZoneCode("");

// loadZones();

// } catch (e: any) {

// alert("Failed to create zone: " + e.message);

// } finally {

// setSaving(false);

// }

// }



// useEffect(() => {

// loadZones();

// loadLocations();

// }, []);



// const selectedLoc = locations.find((l) => l.id === selectedLocation);

// const selectedLocationName = selectedLoc ? selectedLoc.name : "Select Location";



// return (

// <div className="space-y-4 p-4">

// {/* HEADER */}

// <div className="flex justify-between items-center">

// <h1 className="text-2xl font-semibold text-zinc-900">Zones</h1>

// <div className="flex gap-3">

// <Button variant="secondary" onClick={loadZones} disabled={loading}>

// Refresh

// </Button>

// <Button onClick={() => setShowModal(true)} disabled={loading}>

// + Add Zone

// </Button>

// </div>

// </div>



// {/* ZONE LIST */}

// <Card className="bg-white border-zinc-200">

// <CardHeader>

// <h2 className="text-lg font-medium text-zinc-800">Zone List</h2>

// </CardHeader>

// <CardContent>

// {!loading && zones.length > 0 && (

// <div className="overflow-x-auto">

// <table className="w-full text-sm border-collapse">

// <thead>

// <tr className="border-b bg-zinc-100 text-zinc-600">

// <th className="py-2 px-2 text-left">Zone Name</th>

// <th className="py-2 px-2 text-left">Code</th>

// <th className="py-2 px-2 text-left">Location</th>

// </tr>

// </thead>

// <tbody>

// {zones.map((z) => (

// <tr key={z.id} className="border-b hover:bg-zinc-50">

// <td className="py-3 px-2 text-zinc-900">{z.name}</td>

// <td className="py-3 px-2 text-zinc-900">{z.code ?? "-"}</td>

// <td className="py-3 px-2 text-zinc-900">{z.locationName ?? "-"}</td>

// </tr>

// ))}

// </tbody>

// </table>

// </div>

// )}

// </CardContent>

// </Card>



// {/* ADD ZONE MODAL */}

// {showModal && (

// <div

// className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm"

// onClick={() => setShowModal(false)}

// >

// <div

// className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4 border border-zinc-200"

// onClick={(e) => e.stopPropagation()}

// >

// <h2 className="text-xl font-bold text-black">Add Zone</h2>



// <div className="space-y-4">

// {/* Zone Name */}

// <div>

// <label className="text-xs font-bold text-zinc-500 uppercase">

// Zone Name

// </label>

// <input

// type="text"

// placeholder="Zone Name"

// className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 text-black bg-white"

// value={zoneName}

// onChange={(e) => setZoneName(e.target.value)}

// />

// </div>



// {/* Zone Code */}

// <div>

// <label className="text-xs font-bold text-zinc-500 uppercase">

// Zone Code

// </label>

// <input

// type="text"

// placeholder="Zone Code"

// className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 text-black bg-white"

// value={zoneCode}

// onChange={(e) => setZoneCode(e.target.value)}

// />

// </div>



// {/* CSP-Safe Dropdown using Portal */}

// <div className="relative" ref={dropdownRef}>

// <label className="text-xs font-bold text-zinc-500 uppercase">

// Location

// </label>

// <div

// className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 bg-white cursor-pointer flex justify-between items-center text-black font-semibold"

// onClick={() => setIsDropdownOpen(!isDropdownOpen)}

// >

// <span className="text-black">{selectedLocationName || "Select Location"} </span>

// <ChevronDown

// className={`w-4 h-4 text-black transition-transform ${

// isDropdownOpen ? "rotate-180" : ""

// }`}

// />

// </div>



// {isDropdownOpen &&

// createPortal(

// <div

// className="bg-white border border-zinc-300 rounded shadow-lg max-h-56 overflow-y-auto z-[10000]"

// style={{

// width: dropdownRef.current?.offsetWidth,

// position: "absolute",

// top: dropdownRef.current

// ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY

// : 0,

// left: dropdownRef.current

// ? dropdownRef.current.getBoundingClientRect().left + window.scrollX

// : 0,

// }}

// >

// {locations.map((loc) => (

// <div

// key={loc.id}

// className="px-4 py-3 text-black font-semibold text-sm cursor-pointer hover:bg-zinc-100"

// onClick={() => {

// setSelectedLocation(loc.id);

// setIsDropdownOpen(false);

// }}

// >

// {loc.name}

// </div>

// ))}

// </div>,

// document.body

// )}

// </div>

// </div>



// {/* Modal Actions */}

// <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">

// <Button

// variant="secondary"

// onClick={() => setShowModal(false)}

// disabled={saving}

// >

// Cancel

// </Button>

// <Button

// onClick={createZone}

// disabled={!zoneName.trim() || !selectedLocation || saving}

// >

// {saving ? "Saving..." : "Save Zone"}

// </Button>

// </div>

// </div>

// </div>

// )}

// </div>

// );

"use client"; // This MUST be the very first line

import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { apiGet, apiPost } from "@/lib/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type Location = {
  id: string;
  country: string;
  region: string;
  city: string;
  siteCode: string;
  siteName: string;
};

type Zone = {
  id: string;
  name: string;
  code?: string;
  locationName: string;
};

export default function ZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [saving, setSaving] = useState(false);

  async function loadZones() {
    setLoading(true);
    try {
      const data = await apiGet("/api/settings/zones");
      if (Array.isArray(data)) setZones(data);
    } catch (e: any) {
      setError(e.message || "Failed to load zones");
    } finally {
      setLoading(false);
    }
  }

  async function loadLocations() {
    try {
      const data = await apiGet("/api/settings/locations");
      if (Array.isArray(data) && data.length > 0) {
        setLocations(data);
      }
    } catch (e: any) {
      console.error("Failed to load locations:", e.message);
    }
  }

  useEffect(() => {
    loadZones();
    loadLocations();
  }, []);

  return (
    <div className="space-y-4 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Zones</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadZones} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => setShowModal(true)} disabled={loading}>
            + Add Zone
          </Button>
        </div>
      </div>

      {/* ZONE LIST */}
      <Card className="bg-white border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-medium text-zinc-800">Zone List</h2>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading zones...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && zones.length === 0 && <p>No zones found. Add a new zone!</p>}
          {!loading && !error && zones.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-zinc-100 text-zinc-600">
                    <th className="py-2 px-2 text-left">Zone Name</th>
                    <th className="py-2 px-2 text-left">Code</th>
                    <th className="py-2 px-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.id} className="border-b hover:bg-zinc-50">
                      <td className="py-3 px-2 text-zinc-900">{z.name}</td>
                      <td className="py-3 px-2 text-zinc-900">{z.code ?? "-"}</td>
                      <td className="py-3 px-2 text-zinc-900">{z.locationName ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD ZONE MODAL */}
      {showModal && (
        <AddZoneModal
          locations={locations}
          onClose={() => setShowModal(false)}
          onSave={async (zoneData) => {
            setSaving(true);
            try {
              await apiPost("/api/settings/zones", zoneData);
              setShowModal(false);
              loadZones();
            } catch (e: any) {
              alert("Failed to create zone: " + e.message);
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

// ---- New Modal Component ----
interface AddZoneModalProps {
  locations: Location[];
  onClose: () => void;
  onSave: (zoneData: { name: string; code?: string; locationId: string }) => Promise<void>;
  saving: boolean;
}

function AddZoneModal({ locations, onClose, onSave, saving }: AddZoneModalProps) {
  const [zoneName, setZoneName] = useState("");
  const [zoneCode, setZoneCode] = useState("");
  const [modalSelectedLocation, setModalSelectedLocation] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locations.length > 0 && modalSelectedLocation === null) {
      setModalSelectedLocation(locations[0].id);
    }
  }, [locations, modalSelectedLocation]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleCreateZone = async () => {
    if (!zoneName.trim() || modalSelectedLocation === null) return;
    await onSave({
      name: zoneName,
      code: zoneCode || undefined,
      locationId: modalSelectedLocation,
    });
    setZoneName("");
    setZoneCode("");
  };

  const selectedLoc = locations.find((l) => l.id === modalSelectedLocation);
  const selectedLocationName = selectedLoc ? selectedLoc.siteName : "Select Location";

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4 border border-zinc-200"
        onClick={(e: ReactMouseEvent) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-black">Add Zone</h2>

        <div className="space-y-4">
          {/* Zone Name */}
          <div>
            <label htmlFor="zoneNameInput" className="text-xs font-bold text-zinc-500 uppercase">
              Zone Name
            </label>
            <input
              id="zoneNameInput"
              type="text"
              placeholder="Zone Name"
              className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 text-black bg-white"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
            />
          </div>

          {/* Zone Code */}
          <div>
            <label htmlFor="zoneCodeInput" className="text-xs font-bold text-zinc-500 uppercase">
              Zone Code
            </label>
            <input
              id="zoneCodeInput"
              type="text"
              placeholder="Zone Code"
              className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 text-black bg-white"
              value={zoneCode}
              onChange={(e) => setZoneCode(e.target.value)}
            />
          </div>

          {/* CSP-Safe Dropdown using Portal */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs font-bold text-zinc-500 uppercase">
              Location
            </label>
            <div
              className="w-full border border-zinc-300 px-3 py-2 rounded mt-1 bg-white cursor-pointer flex justify-between items-center text-black font-semibold"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-black">{selectedLocationName} </span>
              <ChevronDown
                className={`w-4 h-4 text-black transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen &&
              createPortal(
                <div
                  className="bg-white border border-zinc-300 rounded shadow-lg max-h-56 overflow-y-auto z-[10000]"
                  style={{
                    width: dropdownRef.current?.offsetWidth,
                    position: "absolute",
                    top: dropdownRef.current
                      ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY
                      : 0,
                    left: dropdownRef.current
                      ? dropdownRef.current.getBoundingClientRect().left + window.scrollX
                      : 0,
                  }}
                  // Keep this stopPropagation to prevent clicks inside the list from closing the main modal
                  onClick={(e: ReactMouseEvent) => e.stopPropagation()}
                >
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="px-4 py-3 text-black font-semibold text-sm cursor-pointer hover:bg-zinc-100"
                      tabIndex={0} // Make the div focusable
                      // Changed from onClick to onMouseDown
                      onMouseDown={(e: ReactMouseEvent) => {
                        e.stopPropagation(); // Stop propagation immediately
                        e.preventDefault(); // Prevent default browser behavior that might interfere
                        console.log("Clicked (onMouseDown):", loc.siteName, loc.id);
                        setModalSelectedLocation(loc.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {loc.siteName}
                    </div>
                  ))}
                </div>,
                document.body
              )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateZone}
            disabled={!zoneName.trim() || modalSelectedLocation === null || saving}
          >
            {saving ? "Saving..." : "Save Zone"}
          </Button>
        </div>
      </div>
    </div>
  );
}

