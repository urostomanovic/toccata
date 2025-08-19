"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import RoomCardMini from "@/components/RoomCardMini";
import Subnav from "@/components/RoomsSubnav";
import RoomsFilter from "@/components/RoomsFilter";

const roomsItems = [
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

export default function OccupiedRoomsPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  
  const floors = 10;
  const roomsPerFloor = 20;

  // Generišemo sve sobe kao pre
  const allRooms = Array.from({ length: floors }, (_, floorIndex) =>
    Array.from({ length: roomsPerFloor }, (_, roomIndex) => {
      const roomNumber = (floorIndex + 1) * 100 + roomIndex + 1;
      const statusOptions = ["occupied", "vacant", "alarm", "offline"];
      const iconsOptions = ["alarm", "light", "dnd", "wifi"];
      return {
        id: roomNumber,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        icons: [
          iconsOptions[Math.floor(Math.random() * iconsOptions.length)],
        ],
      };
    })
  ).flat();

  // Filtrirano samo zauzete sobe
  const occupiedRooms = allRooms.filter((room) => room.status === "occupied");

  // Grupišemo zauzete sobe po spratovima
  const occupiedRoomsByFloor = occupiedRooms.reduce((acc, room) => {
    const floorNumber = Math.floor(room.id / 100);
    if (!acc[floorNumber]) {
      acc[floorNumber] = [];
    }
    acc[floorNumber].push(room);
    return acc;
  }, {});

  const handleRoomClick = (roomId) => {
    router.push(`/roomtypeone?id=${roomId}`);
  };

  const handleApplyFilter = (filterData) => {
    console.log('Applied filter on occupied page:', filterData);
    setCurrentFilter(filterData);
    // Ovde ćemo implementirati filtriranje soba
  };

  return (
    <>
      <Navbar />
      <Subnav items={roomsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          {/* Filter Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Occupied Rooms</h1>
            <div className="flex items-center gap-4">
              {currentFilter && (
                <div className="text-sm text-gray-600">
                  Active filter: <span className="font-medium">{currentFilter.name}</span>
                </div>
              )}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Filter
              </button>
            </div>
          </div>

          {/* Prikaz po spratovima */}
          {Object.keys(occupiedRoomsByFloor)
            .sort((a, b) => parseInt(a) - parseInt(b)) // Sortiramo od najnižeg ka najvišem spratu
            .map((floorNumber) => (
              <div key={floorNumber} className="mb-8">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">
                  Floor {floorNumber} ({occupiedRoomsByFloor[floorNumber].length} occupied)
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {occupiedRoomsByFloor[floorNumber].map((room) => (
                    <div 
                      key={room.id} 
                      onClick={() => handleRoomClick(room.id)}
                      className="cursor-pointer hover:scale-105 transition-transform"
                    >
                      <RoomCardMini
                        id={room.id}
                        status={room.status}
                        icons={room.icons}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>
      
      {/* RoomsFilter Modal */}
      <RoomsFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        currentFilter={currentFilter}
      />
    </>
  );
}
