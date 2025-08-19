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
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 text-white px-6 py-2 flex justify-between items-center z-50 shadow-lg navbar-fixed">
      {/* Glavni meni - leva strana */}
      <div className="flex gap-6 flex-shrink-0 overflow-hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:underline whitespace-nowrap ${
              pathname === item.href ? "font-bold underline" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      {/* API Test - desna strana */}
      <div className="flex gap-6 flex-shrink-0">
        <Link
          href={apiTestItem.href}
          className={`hover:underline whitespace-nowrap ${
            pathname === apiTestItem.href ? "font-bold underline" : ""
          }`}
        >
          {apiTestItem.label}
        </Link>
      </div>
    </nav>
  );
}
