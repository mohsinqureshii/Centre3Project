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

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export default function DashboardPage() {
//   const cookieStore = cookies();
//   const token = cookieStore.get("centre3_token")?.value;

//   if (!token) {
//     redirect("/dashboard"); // redirect to login if not authenticated
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <h1 className="text-3xl font-bold">Welcome to Dashboard!</h1>
//     </div>
//   );
// }
