"use client";

import React from "react";
import AlertsFilters from "../../components/alerts/AlertsFilters";
import AlertsList from "../../components/alerts/AlertsList";

export default function SecurityAlertsPage() {
  const [severity, setSeverity] = React.useState<string>("ALL");
  const [seen, setSeen] = React.useState<string>("false");
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Security Alerts</h1>
          <p className="text-sm text-muted-foreground">Review alerts and mark them as seen.</p>
        </div>
      </div>

      <AlertsFilters
        severity={severity}
        setSeverity={setSeverity}
        seen={seen}
        setSeen={setSeen}
        onMarkedAll={() => setRefreshKey((k) => k + 1)}
      />

      <AlertsList severity={severity} seen={seen} refreshKey={refreshKey} />
    </div>
  );
}
