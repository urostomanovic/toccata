"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "All rooms", href: "/rooms" },
  { label: "A region", href: "/rooms/a-region" },
  { label: "B region", href: "/rooms/b-region" },
  { label: "C region", href: "/rooms/c-region" },
  { label: "Occupied", href: "/rooms/occupied" },
  { label: "Vacant", href: "/rooms/vacant" },
  { label: "To be cleaned", href: "/rooms/to-be-cleaned" },
  { label: "Alarms", href: "/rooms/alarms" },
  { label: "Out of order", href: "/rooms/out-of-order" },
  { label: "Settings", href: "/rooms/settings" },
];

export default function RoomsSubnav() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-100 px-6 py-0 flex flex-wrap gap-4 text-sm -mt-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`hover:underline ${
            pathname === item.href ? "font-bold text-blue-600 underline" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
