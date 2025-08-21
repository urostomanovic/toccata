"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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

export default function BRegionPage() {
  const router = useRouter();
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [filteredHotel, setFilteredHotel] = useState([]);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Učitavanje sačuvanih filtera
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
      } catch (err) {
        console.error('Error loading saved filters:', err);
      }
    }
  }, []);

  // Učitavanje sačuvanog filtera za B region
  useEffect(() => {
    const savedFilter = localStorage.getItem("toccata-b-region-filter");
    if (savedFilter) {
      try {
        setCurrentFilter(JSON.parse(savedFilter));
      } catch (err) {
        console.error('Error loading saved filter:', err);
      }
    }
  }, []);

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
          
          // Inicijalno postavi filteredHotel
          setFilteredHotel(floorsArray);
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

  // Parsiranje teksta u brojeve
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

  // Filtriranje soba
  const filterRooms = (hotel, filterData) => {
    if (!filterData) return hotel;
    
    return hotel.map(floor => 
      floor.filter(room => {
        // Filtriranje po spratovima
        if (filterData.rooms && filterData.rooms.floors) {
          const roomFloor = parseInt(room.id.split('.')[0]);
          const selectedFloors = parseTextToNumbers(filterData.rooms.floors);
          if (selectedFloors.length > 0 && !selectedFloors.includes(roomFloor)) {
            return false;
          }
        }
        
        // Filtriranje po sobama
        if (filterData.rooms && filterData.rooms.rooms) {
          const roomNumber = parseInt(room.id.split('.')[1]);
          const selectedRooms = parseTextToNumbers(filterData.rooms.rooms);
          if (selectedRooms.length > 0 && !selectedRooms.includes(roomNumber)) {
            return false;
          }
        }
        
        // Filtriranje po statusu
        if (filterData.status) {
          let statusMatch = true;
          Object.entries(filterData.status).forEach(([statusKey, value]) => {
            if (value === 'none') return;
            
            let roomValue = false;
            switch (statusKey) {
              case 'occupied':
                roomValue = room.status === 'occupied';
                break;
              case 'vacant':
                roomValue = room.status === 'vacant';
                break;
              case 'alarm':
                roomValue = room.icons.includes('alarm');
                break;
              case 'to-be-cleaned':
                roomValue = room.cleanliness === 'DIRTY';
                break;
              case 'out-of-order':
                roomValue = room.status === 'out-of-order';
                break;
              default:
                roomValue = false;
            }
            
            if (value === 'include') return roomValue;
            if (value === 'exclude') return !roomValue;
            return true;
          });
          
          if (!statusMatch) return false;
        }
        
        // Filtriranje po atributima
        if (filterData.attributes) {
          let attributeMatch = true;
          Object.entries(filterData.attributes).forEach(([attrKey, value]) => {
            if (value === 'none') return;
            
            let roomValue = false;
            switch (attrKey) {
              case 'online':
                roomValue = room.online;
                break;
              case 'clean':
                roomValue = room.cleanliness === 'CLEAN';
                break;
              case 'a-region':
                roomValue = room.id.startsWith('1.');
                break;
              case 'b-region':
                roomValue = room.id.startsWith('2.');
                break;
              case 'c-region':
                roomValue = room.id.startsWith('3.');
                break;
              default:
                roomValue = false;
            }
            
            if (value === 'include') return roomValue;
            if (value === 'exclude') return !roomValue;
            return true;
          });
          
          if (!attributeMatch) return false;
        }

        return true;
      })
    ).filter(floor => floor.length > 0); // Ukloni prazne spratove
  };

  const handleApplyFilter = (filterData) => {
    console.log('Applied filter on B region:', filterData);
    setCurrentFilter(filterData);
    
    // Sačuvaj filter za B region
    localStorage.setItem("toccata-b-region-filter", JSON.stringify(filterData));
    
    // Primeni filtriranje
    const filtered = filterRooms(hotel, filterData);
    setFilteredHotel(filtered);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    localStorage.setItem("toccata-b-region-filter", JSON.stringify(filter));
    setIsFilterDropdownOpen(false);
    
    // Primeni filtriranje
    const filtered = filterRooms(hotel, filter);
    setFilteredHotel(filtered);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Zatvori dropdown kada se klikne van njega
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  // Primeni filter kada se promeni hotel data ili currentFilter
  useEffect(() => {
    if (hotel.length > 0) {
      const filtered = filterRooms(hotel, currentFilter);
      setFilteredHotel(filtered);
    }
  }, [hotel, currentFilter]);

  return (
    <>
      <Navbar />
      <Subnav items={roomsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
                     {/* Filter Header */}
           <div className="flex justify-between items-center mb-6">
             <h1 className="text-2xl font-bold text-gray-800">B Region</h1>
             
             {/* Filter Dropdown - Centered */}
             <div className="relative filter-dropdown">
               <button
                 onClick={toggleFilterDropdown}
                 className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 <span className="text-sm text-gray-700">
                   Selected filter: {currentFilter ? currentFilter.name : "All Rooms"}
                 </span>
                 <ChevronDownIcon className="h-4 w-4 text-gray-500" />
               </button>
               
               {/* Dropdown Menu */}
               {isFilterDropdownOpen && (
                 <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                   {savedFilters.map((filter) => (
                     <button
                       key={filter.id}
                       onClick={() => handleFilterSelect(filter)}
                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                     >
                       {filter.name}
                     </button>
                   ))}
                 </div>
               )}
             </div>
             
             <button
               onClick={() => setIsFilterOpen(true)}
               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               Edit Filter
             </button>
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
                {filteredHotel.map((floor, floorIndex) => (
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
