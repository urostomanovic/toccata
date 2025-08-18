"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Rooms", href: "/rooms" },
  { label: "Keys", href: "/keys" },
  { label: "Alarms", href: "/alarms" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
  { label: "Help", href: "/help" },
];

const apiTestItem = { label: "API Test", href: "/api-test" };

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900 text-white px-6 py-2 flex justify-between items-center">
      {/* Glavni meni - leva strana */}
      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:underline ${
              pathname === item.href ? "font-bold underline" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* API Test - desna strana */}
      <div className="flex gap-6">
        <Link
          href={apiTestItem.href}
          className={`hover:underline ${
            pathname === apiTestItem.href ? "font-bold underline" : ""
          }`}
        >
          {apiTestItem.label}
        </Link>
      </div>
    </nav>
  );
}
