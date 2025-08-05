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
      <div className="flex justify-center gap-1">
        {icons.includes("alarm") && (
          <ExclamationTriangleIcon className="h-5 w-5 text-white" />
        )}
        {icons.includes("light") && (
          <LightBulbIcon className="h-5 w-5 text-yellow-300" />
        )}
        {icons.includes("dnd") && (
          <LockClosedIcon className="h-5 w-5 text-white" />
        )}
        {icons.includes("wifi") && (
          <WifiIcon className="h-5 w-5 text-white" />
        )}
      </div>
    </div>
  );
}
