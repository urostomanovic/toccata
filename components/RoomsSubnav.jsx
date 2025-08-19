"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Subnav({ items }) {
  const pathname = usePathname();

  return (
    <div className="fixed top-12 left-0 right-0 bg-gray-100 px-6 py-2 flex flex-wrap gap-4 text-sm z-40 shadow-md subnav-fixed">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`hover:underline whitespace-nowrap flex-shrink-0 ${
            pathname === item.href ? "font-bold text-blue-600 underline" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
