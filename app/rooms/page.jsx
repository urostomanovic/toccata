"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoomsSubnav from "@/components/RoomsSubnav";
import RoomCardMini from "@/components/RoomCardMini";

export default function RoomsPage() {
  const router = useRouter();
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <Navbar />
      <RoomsSubnav />
      <main className="p-6">
        <div className="p-4">
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
    </>
  );
}


