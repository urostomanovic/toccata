"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Prva grupa - Alarms Management
const alarmsGroup = [
  { label: "Alarms Table", href: "/alarms", icon: "🚨" },
  { label: "Active Alarms", href: "/alarms/active", icon: "⚠️" },
  { label: "History", href: "/alarms/history", icon: "📋" },
];

// Druga grupa - Configuration
const configGroup = [
  { label: "Alarm Types", href: "/alarms/types", icon: "⚙️" },
  { label: "Thresholds", href: "/alarms/thresholds", icon: "📊" },
  { label: "Notifications", href: "/alarms/notifications", icon: "🔔" },
];

// Treća grupa - Settings
const settingsGroup = [
  { label: "Settings", href: "/alarms/settings", icon: "🔧" },
  { label: "Export", href: "/alarms/export", icon: "📤" },
];

export default function AlarmsSubnav() {
  const pathname = usePathname();

  // Automatski sačuvaj trenutnu stranicu kada se komponenta učita
  useEffect(() => {
    if (pathname.startsWith("/alarms")) {
      // Sačuvaj trenutnu stranicu
      localStorage.setItem("toccata-last-active-alarms-page", pathname);
      
      // Za stranice sa filterima, sačuvaj i aktivan filter
      if (pathname === "/alarms") {
        const currentFilter = localStorage.getItem("toccata-current-alarm-filter");
        if (currentFilter) {
          localStorage.setItem("toccata-last-active-alarms-filter", currentFilter);
        }
      }
    }
  }, [pathname]);

  // Funkcija za čuvanje poslednje aktivne stranice
  const handleLinkClick = (href) => {
    localStorage.setItem("toccata-last-active-alarms-page", href);
    
    // Za stranice sa filterima, sačuvaj i aktivan filter
    if (href === "/alarms") {
      const currentFilter = localStorage.getItem("toccata-current-alarm-filter");
      if (currentFilter) {
        localStorage.setItem("toccata-last-active-alarms-filter", currentFilter);
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
        {/* Prva grupa - Alarms Management */}
        {renderGroup(alarmsGroup, "alarms")}
        
        {/* Separator */}
        <div className="w-px h-8 bg-gray-300"></div>
        
        {/* Druga grupa - Configuration */}
        {renderGroup(configGroup, "config")}
        
        {/* Separator */}
        <div className="w-px h-8 bg-gray-300"></div>
        
        {/* Treća grupa - Settings */}
        {renderGroup(settingsGroup, "settings")}
      </div>
    </div>
  );
}
