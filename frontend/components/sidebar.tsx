"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  ShieldAlert,
  FileText,
  Lock,
  Settings,
  Map,
  IdCard,
  Fingerprint,
  QrCode,
  LogOut,
  ChevronDown,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: any;
  phase?: "P1" | "P2";
  children?: {
    label: string;
    href?: string;
    phase?: "P1" | "P2";
  }[];
};

const nav: NavItem[] = [
  // =========================
  // CORE
  // =========================
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    phase: "P1",
  },

  // =========================
  // REQUESTS
  // =========================
  {
    label: "Requests",
    icon: ClipboardList,
    children: [
      { label: "All Requests", href: "/requests", phase: "P1" },
      { label: "Create Request", href: "/requests/new", phase: "P1" },
    ],
  },

    // =========================
  // APPROVALS
  // =========================
  {
    label: "Approvals (P-2)",
    icon: FileText,
    phase: "P2",
  },

  // =========================
  // GEOGRAPHY
  // =========================
  {
    label: "Geography",
    icon: Map,
    children: [
      { label: "Locations", href: "/settings/locations", phase: "P1" },
      { label: "Zones", href: "/settings/zones", phase: "P1" },
      { label: "Rooms", href: "/settings/rooms", phase: "P1" },
    ],
  },

  // =========================
  // SECURITY & ACCESS
  // =========================
  {
    label: "Credentials",
    icon: IdCard,
    children: [
      { label: "RFID Cards (P-2)", phase: "P2" },
      { label: "Mobile / QR Pass (P-2)", phase: "P2" },
      { label: "Biometric Access (P-2)", phase: "P2" },
    ],
  },

  {
    label: "Security Alerts",
    href: "/alerts",
    icon: ShieldAlert,
    phase: "P1",
  },

  {
    label: "Emergency Lock",
    href: "/emergency-lock",
    icon: Lock,
    phase: "P1",
  },

  // =========================
  // REPORTING
  // =========================
  {
    label: "Reports (P-2)",
    icon: FileText,
    phase: "P2",
  },

  // =========================
  // SETTINGS
  // =========================
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Users", href: "/settings/users", phase: "P1" },
      { label: "Processes", href: "/settings/processes", phase: "P1" },
      { label: "Activities", href: "/settings/activities", phase: "P1" },
      {
        label: "Activity Categories",
        href: "/settings/activity-categories",
        phase: "P1",
      },
      { label: "Alert Types", href: "/settings/alert-types", phase: "P1" },
      { label: "Roles (P-2)", phase: "P2" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <aside className="flex h-screen w-64 flex-col bg-blue-700 text-blue-100">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-600">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-700 font-bold">
          C3
        </div>
        <span className="text-lg font-semibold text-white">Centre3</span>
        <span className="ml-auto rounded bg-blue-600 px-2 py-0.5 text-xs">
          P1
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const isOpen = open === item.label;

            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpen(isOpen ? null : item.label)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-600"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  <ChevronDown
                    className={clsx(
                      "ml-auto h-4 w-4 transition",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="ml-9 mt-1 space-y-1">
                    {item.children.map((child) =>
                      child.href ? (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={clsx(
                            "block rounded-md px-3 py-1.5 text-sm",
                            pathname === child.href
                              ? "bg-blue-600 text-white"
                              : "hover:bg-blue-600"
                          )}
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <div
                          key={child.label}
                          className="block rounded-md px-3 py-1.5 text-sm text-blue-300 cursor-not-allowed"
                        >
                          {child.label}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          }

          if (!item.href) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-blue-300 cursor-not-allowed"
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {/* Logout */}
        <div className="mt-4 border-t border-blue-600 pt-4">
          <button
            onClick={() => {
              localStorage.removeItem("centre3_token");
              router.push("/login");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-blue-600"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
