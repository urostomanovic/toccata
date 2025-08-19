"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";
import RoomsFilter from "@/components/RoomsFilter";
import RoomCardMini from "@/components/RoomCardMini";

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

export default function ARegionPage() {
  const router = useRouter();
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);

  // Fetch real rooms data from TOCCATA API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rooms');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Group rooms by floor
          const roomsByFloor = {};
          data.rooms.forEach(room => {
            const floorNumber = parseInt(room.floorName.split('.')[0]);
            if (!roomsByFloor[floorNumber]) {
              roomsByFloor[floorNumber] = [];
            }
            
            // Transform TOCCATA data to our format
            const transformedRoom = {
              id: room.roomName,
              status: room.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
              online: room.online,
              cleanliness: room.cleanliness,
              icons: room.online ? ['wifi'] : ['offline']
            };
            
            roomsByFloor[floorNumber].push(transformedRoom);
          });
          
          // Convert to 2D array format
          const floorsArray = Object.keys(roomsByFloor)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(floorNumber => roomsByFloor[floorNumber]);
          
          setHotel(floorsArray);
        } else {
          throw new Error(data.error || 'Failed to fetch rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId) => {
    router.push(`/roomtypeone?id=${roomId}`);
  };

  const handleApplyFilter = (filterData) => {
    console.log('Applied filter on A region:', filterData);
    setCurrentFilter(filterData);
    // Ovde ćemo implementirati filtriranje soba za A region
  };

  return (
    <>
      <Navbar />
      <Subnav items={roomsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          {/* Filter Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">A Region</h1>
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

          {loading && (
            <div className="text-center py-8">
              <div className="text-lg font-semibold text-gray-600">Učitavanje soba...</div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Greška</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {!loading && !error && (
            <div className="overflow-x-auto overflow-y-auto max-h-[85vh] border rounded shadow-inner">
              <div className="flex flex-col gap-2 min-w-[1300px]">
                {hotel.map((floor, floorIndex) => (
                  <div key={floorIndex} className="flex gap-2">
                    {floor.map((room) => (
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
                ))}
              </div>
            </div>
          )}
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
