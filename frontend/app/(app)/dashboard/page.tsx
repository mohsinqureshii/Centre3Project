import DashboardCard from "./DashboardCard";
import DashboardCharts from "./DashboardCharts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Total Requests" value="124" />
        <DashboardCard title="Pending Approvals" value="8" />
        <DashboardCard title="Active Visitors" value="21" />
        <DashboardCard title="Locations" value="15" />
      </div>

      <DashboardCharts />
    </div>
  );
}
