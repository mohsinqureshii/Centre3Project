"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444"];

export function RequestsByStatus() {
  const data = [
    { name: "Approved", value: 47 },
    { name: "Pending", value: 14 },
    { name: "Draft", value: 5 },
    { name: "Rejected", value: 3 },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Requests by Status</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RequestsTrend() {
  const data = [
    { day: "Mon", requests: 12 },
    { day: "Tue", requests: 18 },
    { day: "Wed", requests: 9 },
    { day: "Thu", requests: 22 },
    { day: "Fri", requests: 16 },
    { day: "Sat", requests: 6 },
    { day: "Sun", requests: 4 },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Requests Trend (7 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="requests"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function VisitorsByLocation() {
  const data = [
    { location: "Riyadh DC", visitors: 18 },
    { location: "Dammam DC", visitors: 12 },
    { location: "Qasim DC", visitors: 7 },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Visitors by Location</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitors" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
