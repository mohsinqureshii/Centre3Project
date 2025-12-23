"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}: Props) {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>

        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
