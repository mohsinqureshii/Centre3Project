"use client";

import DashboardCard from "./dashboardcard";
import {
  RequestsByStatus,
  RequestsTrend,
  VisitorsByLocation,
} from "./DashboardCharts";

import {
  ClipboardList,
  CheckCircle,
  Clock,
  Users,
  MapPin,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Requests" value={128} icon={<ClipboardList size={18} />} />
        <DashboardCard title="Pending Requests" value={14} color="bg-yellow-500" icon={<Clock size={18} />} />
        <DashboardCard title="Approved Today" value={47} color="bg-green-600" icon={<CheckCircle size={18} />} />
        <DashboardCard title="Visitors Today" value={42} icon={<Users size={18} />} />
        <DashboardCard title="Locations" value={6} icon={<MapPin size={18} />} />
        <DashboardCard title="Security Alerts" value={1} color="bg-red-700" icon={<AlertTriangle size={18} />} />
        <DashboardCard title="Emergency Lock" value="OFF" color="bg-gray-800" icon={<Lock size={18} />} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RequestsByStatus />
        <RequestsTrend />
        <VisitorsByLocation />
      </div>
    </div>
  );
}
