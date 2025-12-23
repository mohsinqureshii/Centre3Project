"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../ui/utils";

type NavItem = {
  label: string;
  href?: string;
  p2?: boolean;
  children?: { label: string; href: string; p2?: boolean }[];
};

const nav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },

  {
    label: "Requests",
    children: [
      { label: "New Request", href: "/requests/new" },
      { label: "Request List", href: "/requests" },
    ],
  },

  {
    label: "Geography",
    children: [
      { label: "Locations", href: "/settings/locations" },
      { label: "Zones", href: "/settings/zones" },
      { label: "Rooms", href: "/settings/rooms" },
    ],
  },

  { label: "Security Alerts", href: "/security-alerts" },
  { label: "Emergency Lock", href: "/emergency-lock" },

  {
    label: "Reports",
    href: "/reports",
    p2: true,
  },

  {
    label: "Settings",
    children: [
      { label: "Users", href: "/settings/users" },
      { label: "Processes", href: "/settings/processes" },
      { label: "Activities", href: "/settings/activities" },
      { label: "Activity Categories", href: "/settings/activity-categories" },
      { label: "Alert Types", href: "/settings/alert-types" },
      { label: "Roles", href: "/settings/roles", p2: true },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-zinc-200 bg-white px-4 py-6">
      {/* Logo */}
      <div className="mb-6">
        <div className="text-xl font-semibold">Centre3</div>
        <div className="text-xs text-zinc-500">Security Operations</div>
      </div>

      {/* Navigation */}
      <nav className="space-y-4 text-sm">
        {nav.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 hover:bg-zinc-100",
                  pathname === item.href && "bg-zinc-100 font-medium"
                )}
              >
                {item.label}
                {item.p2 && (
                  <span className="ml-2 text-xs text-zinc-400">(P-2)</span>
                )}
              </Link>
            ) : (
              <>
                <div className="px-3 py-1 text-xs font-semibold text-zinc-500 uppercase">
                  {item.label}
                </div>
                <div className="mt-1 space-y-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 hover:bg-zinc-100",
                        pathname.startsWith(child.href) &&
                          "bg-zinc-100 font-medium"
                      )}
                    >
                      {child.label}
                      {child.p2 && (
                        <span className="ml-2 text-xs text-zinc-400">(P-2)</span>
                      )}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("centre3_token");
            router.push("/login");
          }}
          className="mt-6 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
