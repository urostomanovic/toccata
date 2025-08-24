"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Mock podaci za rezervacije (koristimo postojeće + proširujemo)
const mockReservations = [
  {
    id: 1,
    guestName: "John Smith",
    roomNumber: "101",
    checkIn: "22-08-2025",
    checkOut: "25-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0123",
    email: "john.smith@email.com"
  },
  {
    id: 2,
    guestName: "Maria Garcia",
    roomNumber: "102",
    checkIn: "23-08-2025",
    checkOut: "26-08-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0124",
    email: "maria.garcia@email.com"
  }
];

export default function MapPage() {
  // State za filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState(mockReservations);
  const [searchTerm, setSearchTerm] = useState("");
  
     // State za radni prozor
   const [dateOffset, setDateOffset] = useState(0); // Offset za datume
   const [roomOffset, setRoomOffset] = useState(0); // Offset za sobe

  // Load saved filters on component mount
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
      const defaultFilter = parsed.find(f => f.name === "All Reservations");
      if (defaultFilter) {
        setCurrentFilter(defaultFilter);
      }
    } else {
      const defaultFilter = {
        name: "All Reservations",
        data: {
          guestName: "",
          roomNumber: "",
          checkInDate: "",
          checkOutDate: "",
          keyStatus: { Active: 0, Lost: 0, Invalidated: 0 },
          reservationStatus: { Confirmed: 0, Pending: 0, Cancelled: 0 },
          phone: "",
          email: ""
        }
      };
      setCurrentFilter(defaultFilter);
    }
  }, []);

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    setIsFilterDropdownOpen(false);
  };

  // Generisanje datuma za prikaz
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // 30 dana unapred
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toLocaleDateString('sr-RS', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }));
    }
    return dates;
  };

  // Generisanje brojeva soba
  const generateRooms = () => {
    const rooms = [];
    for (let floor = 1; floor <= 5; floor++) {
      for (let room = 1; room <= 20; room++) {
        rooms.push(`${floor}${room.toString().padStart(2, '0')}`);
      }
    }
    return rooms;
  };

     // Fiksna veličina polja
   const cellSize = 14; // Veličina polja u karakterima
   
   // Izračunavanje vidljivih datuma i soba
   const allDates = generateDates();
   const allRooms = generateRooms();
   const visibleDates = allDates.slice(dateOffset, dateOffset + 15); // Prikaži 15 dana
   const visibleRooms = allRooms.slice(roomOffset, roomOffset + 20); // Prikaži 20 soba
   
   // Širina za brojeve soba
   const roomNumberWidth = 80;
   
   // Handler za klik na ćeliju matrice
   const handleCellClick = (date, room) => {
     console.log(`Klik na ćeliju: ${date} - ${room}`);
     // Ovo će biti implementirano u koraku 3
   };

  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
                     {/* Filter Header - Sticky */}
           <div className="sticky top-32 z-40 bg-white border-b border-gray-200 pb-4 mb-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <h1 className="text-2xl font-bold text-gray-800">Hotel Reservation Map</h1>
                 
                 {/* Search Bar */}
                 <div className="relative">
                   <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                   <input
                     type="text"
                     placeholder="Search reservations..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   />
                 </div>
                 
                 {/* Filter Dropdown */}
                 <div className="relative filter-dropdown">
                   <button
                     onClick={toggleFilterDropdown}
                     className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <span className="text-sm text-gray-700">
                       Selected filter: {currentFilter ? currentFilter.name : "All Reservations"}
                     </span>
                     <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                   </button>
                   
                   {/* Dropdown Menu */}
                   {isFilterDropdownOpen && (
                     <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                       {savedFilters.map((filter) => (
                         <button
                           key={filter.name}
                           onClick={() => handleFilterSelect(filter)}
                           className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                         >
                           {filter.name}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
                 
                 
               </div>
               
               {/* Edit Filter Button */}
               <button
                 onClick={() => setIsFilterOpen(true)}
                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 Edit Filter
               </button>
             </div>
           </div>
          
          {/* Radni prozor - korak 2 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Radni prozor sa skrolom */}
            <div className="relative">
                             {/* Datumi na vrhu - horizontalni skrol */}
               <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="flex">
                  {/* Prazan ugao */}
                  <div 
                    className="bg-gray-50 border-r border-gray-200"
                    style={{ width: `${roomNumberWidth}px`, minWidth: `${roomNumberWidth}px` }}
                  ></div>
                  
                                     {/* Datumi */}
                   <div className="flex overflow-x-auto" style={{ marginLeft: `-32px` }}>
                    {visibleDates.map((date, index) => (
                      <div
                        key={date}
                        className="border-r border-gray-200 bg-gray-50 px-2 py-3 text-center text-sm font-medium text-gray-700"
                        style={{ 
                          width: `${cellSize * 8}px`, 
                          minWidth: `${cellSize * 8}px` 
                        }}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
                             {/* Glavni sadržaj - vertikalni i horizontalni skrol */}
               <div className="flex relative">
                {/* Brojevi soba - leva ivica */}
                <div className="sticky left-0 z-30 bg-white border-r border-gray-200 shadow-sm">
                  {visibleRooms.map((room) => (
                    <div
                      key={room}
                      className="border-b border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 text-center"
                      style={{ height: `${cellSize * 2}px` }}
                    >
                      {room}
                    </div>
                  ))}
                </div>
                
                {/* Matrica - placeholder za korak 3 */}
                <div className="flex-1 overflow-auto" style={{ 
                  height: `${visibleRooms.length * cellSize * 2}px`,
                  direction: 'rtl' 
                }}>
                  <div className="flex" style={{ direction: 'ltr' }}>
                    {visibleDates.map((date) => (
                      <div key={date} className="flex flex-col">
                        {visibleRooms.map((room) => (
                          <div
                            key={`${date}-${room}`}
                            className="border-b border-r border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                            style={{ 
                              width: `${cellSize * 8}px`, 
                              height: `${cellSize * 2}px` 
                            }}
                            onClick={() => handleCellClick(date, room)}
                          >
                            {/* Placeholder za sadržaj matrice */}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Kontrole za skrol */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Prikazano: {visibleRooms.length} soba, {visibleDates.length} datuma
                </div>
                                 <div className="flex gap-2">
                   <button
                     onClick={() => setDateOffset(Math.max(0, dateOffset - 15))}
                     disabled={dateOffset === 0}
                     className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                   >
                     ← Prethodnih 15 dana
                   </button>
                   <button
                     onClick={() => setDateOffset(dateOffset + 15)}
                     className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                   >
                     Sledećih 15 dana →
                   </button>
                 </div>
                 
                 <div className="flex gap-2">
                   <button
                     onClick={() => setRoomOffset(Math.max(0, roomOffset - 20))}
                     disabled={roomOffset === 0}
                     className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                   >
                     ↑ Prethodnih 20 soba
                   </button>
                   <button
                     onClick={() => setRoomOffset(roomOffset + 20)}
                     className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                   >
                     Sledećih 20 soba ↓
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      {isFilterOpen && (
        <ReservationsFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onUpdate={() => {}}
          currentFilter={currentFilter}
          onApplyFilter={() => {}}
        />
      )}
    </>
  );
}

