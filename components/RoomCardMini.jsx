"use client";

import {
  ExclamationTriangleIcon,
  LightBulbIcon,
  LockClosedIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";

export default function RoomCardMini({ id, status = "vacant", icons = [] }) {
  const statusColor = {
    occupied: "bg-red-500",
    vacant: "bg-green-500",
    alarm: "bg-yellow-500",
    offline: "bg-gray-400",
  }[status] || "bg-blue-500";

  return (
    <div className={`rounded-lg p-4 w-28 h-28 text-center shadow ${statusColor}`}>
      <div className="text-white text-xl font-bold mb-1">#{id}</div>
      
      {/* Ikone sa fiksnim mestima - siva kada nisu aktivne */}
      <div className="flex justify-center gap-1">
        {/* Alarm ikona - uvek na prvom mestu */}
        <ExclamationTriangleIcon 
          className={`h-5 w-5 ${
            icons.includes("alarm") ? "text-white" : "text-gray-300"
          }`} 
        />
        
        {/* Light ikona - uvek na drugom mestu */}
        <LightBulbIcon 
          className={`h-5 w-5 ${
            icons.includes("light") ? "text-yellow-300" : "text-gray-300"
          }`} 
        />
        
        {/* DND ikona - uvek na trećem mestu */}
        <LockClosedIcon 
          className={`h-5 w-5 ${
            icons.includes("dnd") ? "text-white" : "text-gray-300"
          }`} 
        />
        
        {/* WiFi ikona - uvek na četvrtom mestu */}
        <WifiIcon 
          className={`h-5 w-5 ${
            icons.includes("wifi") ? "text-white" : "text-gray-300"
          }`} 
        />
      </div>
    </div>
  );
}
