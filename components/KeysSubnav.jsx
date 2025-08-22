"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Prva grupa - Reservations
const reservationsGroup = [
  { label: "Reservations", href: "/keys/reservations", icon: "🏨" },
  { label: "New Reservation", href: "/keys/new-reservation", icon: "➕" },
  { label: "Map", href: "/keys/map", icon: "🗺️" },
];

// Druga grupa - Staff
const staffGroup = [
  { label: "Staff", href: "/keys/staff", icon: "👥" },
  { label: "New Staff", href: "/keys/new-staff", icon: "➕" },
  { label: "Access", href: "/keys/access", icon: "🔐" },
];

// Treća grupa - Temporary Keys
const temporaryGroup = [
  { label: "Temporary Keys", href: "/keys/temporary", icon: "⏰" },
  { label: "Add New", href: "/keys/add-temporary", icon: "➕" },
];

export default function KeysSubnav() {
  const pathname = usePathname();

  // Automatski sačuvaj trenutnu stranicu kada se komponenta učita
  useEffect(() => {
    if (pathname.startsWith("/keys/")) {
      // Sačuvaj trenutnu stranicu
      localStorage.setItem("toccata-last-active-keys-page", pathname);
      
      // Za stranice sa filterima, sačuvaj i aktivan filter
      if (pathname === "/keys/reservations") {
        const currentFilter = localStorage.getItem("toccata-current-reservation-filter");
        if (currentFilter) {
          localStorage.setItem("toccata-last-active-keys-filter", currentFilter);
        }
      }
      // Možemo dodati i za druge stranice sa filterima u budućnosti
      // if (pathname === "/keys/staff") { ... }
      // if (pathname === "/keys/temporary") { ... }
    }
  }, [pathname]);

  // Funkcija za čuvanje poslednje aktivne stranice
  const handleLinkClick = (href) => {
    localStorage.setItem("toccata-last-active-keys-page", href);
    
    // Za stranice sa filterima, sačuvaj i aktivan filter
    if (href === "/keys/reservations") {
      const currentFilter = localStorage.getItem("toccata-current-reservation-filter");
      if (currentFilter) {
        localStorage.setItem("toccata-last-active-keys-filter", currentFilter);
      }
    }
  };

  const renderGroup = (items, key) => (
    <div key={key} className="flex gap-4">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => handleLinkClick(item.href)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            pathname === item.href
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="fixed top-12 left-0 right-0 bg-white border-b border-gray-200 px-6 py-3 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        {/* Prva grupa - Reservations */}
        {renderGroup(reservationsGroup, "reservations")}
        
        {/* Separator */}
        <div className="w-px h-8 bg-gray-300"></div>
        
        {/* Druga grupa - Staff */}
        {renderGroup(staffGroup, "staff")}
        
        {/* Separator */}
        <div className="w-px h-8 bg-gray-300"></div>
        
        {/* Treća grupa - Temporary Keys */}
        {renderGroup(temporaryGroup, "temporary")}
      </div>
    </div>
  );
}
