"use client";

import React from "react";
import ZonesGrid from "../../components/emergency-lock/ZonesGrid";

export default function EmergencyLockPage() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Emergency Lock</h1>
          <p className="text-sm text-muted-foreground">Lock or unlock zones during incidents.</p>
        </div>
      </div>

      <ZonesGrid />
    </div>
  );
}
