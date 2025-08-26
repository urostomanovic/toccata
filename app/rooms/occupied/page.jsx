"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import RoomCardMini from "@/components/RoomCardMini";
import Subnav from "@/components/RoomsSubnav";
import RoomsFilter from "@/components/RoomsFilter";
import { mockRoomsByFloor } from "@/lib/mockData";

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

  // STARI KOD - Generišemo sve sobe sa više atributa za filtriranje
  // const floors = 10;
  // const roomsPerFloor = 20;
  // const allRooms = useMemo(() => Array.from({ length: floors }, (_, floorIndex) =>
  //   Array.from({ length: roomsPerFloor }, (_, roomIndex) => {
  //     const roomNumber = (floorIndex + 1) * 100 + roomIndex + 1;
  //     const statusOptions = ["occupied", "vacant", "alarm", "to-be-cleaned", "out-of-order"];
  //     const iconsOptions = ["alarm", "light", "dnd", "wifi"];
  //     
  //     // Dodajemo atribute za filtriranje
  //     const isOnline = Math.random() > 0.1; // 90% šanse da je online
  //     const isClean = Math.random() > 0.3; // 70% šanse da je čista
  //     
  //     // Region atributi (A, B, C) - svaka soba pripada jednom regionu
  //     const regions = ["a-region", "b-region", "c-region"];
  //     const region = regions[Math.floor(Math.random() * regions.length)];
  //     
  //     return {
  //       id: roomNumber,
  //       floor: floorIndex + 1,
  //       status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
  //       icons: [
  //         iconsOptions[Math.floor(Math.random() * iconsOptions.length)],
  //       ],
  //       attributes: {
  //         online: isOnline,
  //         clean: isClean,
  //         region: region
  //       }
  //     };
  //   })
  // ).flat(), []);

  // NOVI KOD - Use mock data from centralized source
  const allRooms = useMemo(() => {
    // Flatten mockRoomsByFloor into a single array
    return mockRoomsByFloor.flat().map(room => ({
      id: room.id,
      floor: parseInt(room.id.charAt(0)), // Extract floor from room ID (e.g., "101" -> 1)
      status: room.status,
      icons: room.icons,
      attributes: {
        online: room.online,
        clean: room.cleanliness === 'clean',
        region: room.id.charAt(0) === '1' ? 'a-region' : 
                room.id.charAt(0) === '2' ? 'b-region' : 
                room.id.charAt(0) === '3' ? 'c-region' : 'a-region'
      }
    }));
  }, []);

  // Funkcija za parsiranje teksta u brojeve (floors, rooms)
  const parseTextToNumbers = (text) => {
    if (!text.trim()) return [];
    
    const numbers = [];
    const parts = text.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.push(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    });
    
    return [...new Set(numbers)].sort((a, b) => a - b);
  };

  // Funkcija za filtriranje soba
  const filterRooms = (rooms, filter) => {
    if (!filter) return rooms;

    let filteredRooms = [...rooms];

    // Filtriranje po spratovima
    if (filter.rooms.floors) {
      const allowedFloors = parseTextToNumbers(filter.rooms.floors);
      if (allowedFloors.length > 0) {
        filteredRooms = filteredRooms.filter(room => 
          allowedFloors.includes(room.floor)
        );
      }
    }

    // Filtriranje po brojevima soba
    if (filter.rooms.rooms) {
      const allowedRooms = parseTextToNumbers(filter.rooms.rooms);
      if (allowedRooms.length > 0) {
        filteredRooms = filteredRooms.filter(room => 
          allowedRooms.includes(room.id)
        );
      }
    }

    // Filtriranje po statusu
    const statusFilters = Object.entries(filter.status).filter(([_, value]) => value !== 'none');
    if (statusFilters.length > 0) {
      filteredRooms = filteredRooms.filter(room => {
        return statusFilters.every(([status, action]) => {
          const roomHasStatus = room.status === status;
          return action === 'include' ? roomHasStatus : !roomHasStatus;
        });
      });
    }

    // Filtriranje po atributima
    const attributeFilters = Object.entries(filter.attributes).filter(([_, value]) => value !== 'none');
    if (attributeFilters.length > 0) {
      filteredRooms = filteredRooms.filter(room => {
        return attributeFilters.every(([attribute, action]) => {
          let roomHasAttribute = false;
          
          switch (attribute) {
            case 'online':
              roomHasAttribute = room.attributes.online;
              break;
            case 'clean':
              roomHasAttribute = room.attributes.clean;
              break;
            case 'a-region':
            case 'b-region':
            case 'c-region':
              roomHasAttribute = room.attributes.region === attribute;
              break;
            default:
              roomHasAttribute = false;
          }
          
          return action === 'include' ? roomHasAttribute : !roomHasAttribute;
        });
      });
    }

    return filteredRooms;
  };

  // Filtrirano samo zauzete sobe
  const occupiedRooms = useMemo(() => {
    let rooms = allRooms.filter((room) => room.status === "occupied");
    
    // Ako postoji filter, primeni ga
    if (currentFilter) {
      rooms = filterRooms(rooms, currentFilter);
    }
    
    return rooms;
  }, [allRooms, currentFilter]);

  // Grupišemo zauzete sobe po spratovima
  const occupiedRoomsByFloor = useMemo(() => {
    return occupiedRooms.reduce((acc, room) => {
      const floorNumber = Math.floor(room.id / 100);
      if (!acc[floorNumber]) {
        acc[floorNumber] = [];
      }
      acc[floorNumber].push(room);
      return acc;
    }, {});
  }, [occupiedRooms]);

  const handleRoomClick = (roomId) => {
    router.push(`/roomtypeone?id=${roomId}`);
  };

  const handleApplyFilter = (filterData) => {
    console.log('Applied filter on occupied page:', filterData);
    setCurrentFilter(filterData);
  };

  const clearFilter = () => {
    setCurrentFilter(null);
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
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-600">
                    Active filter: <span className="font-medium">{currentFilter.name}</span>
                  </div>
                  <button
                    onClick={clearFilter}
                    className="text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Clear
                  </button>
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
          {Object.keys(occupiedRoomsByFloor).length > 0 ? (
            Object.keys(occupiedRoomsByFloor)
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
              ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {currentFilter ? "No rooms match the current filter criteria." : "No occupied rooms found."}
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
