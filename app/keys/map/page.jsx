"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Mock podaci za rezervacije
const mockReservations = [
  {
    id: 1,
    guestName: "John Smith",
    roomNumber: "101",
    checkIn: "25-08-2025",
    checkOut: "28-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0123",
    email: "john.smith@email.com"
  },
  {
    id: 2,
    guestName: "Maria Garcia",
    roomNumber: "102",
    checkIn: "26-08-2025",
    checkOut: "29-08-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0124",
    email: "maria.garcia@email.com"
  },
  {
    id: 3,
    guestName: "David Johnson",
    roomNumber: "103",
    checkIn: "27-08-2025",
    checkOut: "30-08-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0125",
    email: "david.johnson@email.com"
  }
];

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartDate, setDragStartDate] = useState(null);
  const headerRef = useRef(null);

  // Konstante za fluid scroll
  const VISIBLE_DAYS = 21; // 3 nedelje
  const DAY_WIDTH = 50; // px po danu

  // Funkcija za računanje broja nedelje u godini
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Generisanje datuma za header (21 dan - 3 nedelje)
  const generateDateHeaders = (start) => {
    const headers = [];
    
    for (let i = 0; i < VISIBLE_DAYS; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      
      headers.push({
        day: dayName,
        date: dayNumber,
        fullDate: date.toLocaleDateString('sr-RS', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        })
      });
    }
    
    return headers;
  };

  // Generisanje nedelja header-a - fluid scroll
  const generateWeekHeaders = (start) => {
    const headers = [];
    const weekMap = new Map(); // Map za praćenje nedelja i njihovih dana
    
    // Prođi kroz sve vidljive dane i grupisi ih po nedeljama
    for (let i = 0; i < VISIBLE_DAYS; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Izračunaj prvi dan nedelje za ovaj datum (ponedeljak)
      const dayOfWeek = currentDate.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ako je nedelja, idemo na prethodni ponedeljak
      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
      
      const weekKey = weekStartDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      const weekNumber = getWeekNumber(weekStartDate);
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          weekNumber: weekNumber,
          startIndex: i,
          days: []
        });
      }
      
      weekMap.get(weekKey).days.push(i);
    }
    
    // Konvertuj map u array i sortiraj po startIndex
    return Array.from(weekMap.values()).sort((a, b) => a.startIndex - b.startIndex);
  };

  // Generisanje mesec header-a (3 nedelje)
  const generateMonthHeaders = (start) => {
    const headers = [];
    
    for (let i = 0; i < VISIBLE_DAYS; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      
      const year = date.getFullYear();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      
      headers.push({
        year: year,
        month: month,
        isFirstDayOfMonth: date.getDate() === 1
      });
    }
    
    return headers;
  };

  // Funkcija za određivanje gde treba da se prikaže nedelja
  const getWeekDisplayInfo = (start) => {
    const weekInfo = [];
    
    // Odredi koji je prvi dan u view-u
    const firstDayOfView = new Date(start);
    const firstDayOfWeek = firstDayOfView.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
    
    // Odredi prikaz na osnovu prvog dana
    let displayPattern;
    if (firstDayOfWeek === 0) {
      // Nedelja: 0,1,1,1 - ne prikazuj prvu, prikazuj druge tri
      displayPattern = [false, true, true, true];
    } else if (firstDayOfWeek === 1) {
      // Ponedeljak: 1,1,1,0 - prikazuj prve tri, ne prikazuj poslednju
      displayPattern = [true, true, true, false];
    } else if (firstDayOfWeek === 2) {
      // Utorak: 1,1,1,0 - prikazuj prve tri, ne prikazuj poslednju
      displayPattern = [true, true, true, false];
    } else {
      // Ostali dani (3-6): 1,1,1,1 - prikazuj sve četiri
      displayPattern = [true, true, true, true];
    }
    

    
    // Generiši nedelje prema pattern-u
    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      if (displayPattern[weekIndex]) {
        const weekStartDate = new Date(start);
        weekStartDate.setDate(start.getDate() + (weekIndex * 7) - firstDayOfWeek);
        
        const weekNumber = getWeekNumber(weekStartDate);
        const daysInWeek = weekIndex === 0 ? 7 - firstDayOfWeek : (weekIndex === 3 ? firstDayOfWeek : 7);
        
        // Izračunaj poziciju na osnovu stvarnog prvog dana nedelje u view-u
        let index = Math.max(0, weekIndex * 7 - firstDayOfWeek);
        
        weekInfo.push({
          index: index,
          weekNumber: weekNumber,
          daysInWeek: daysInWeek,
          weekStartDate: weekStartDate
        });
      }
    }
    
    return weekInfo;
  };

  const dateHeaders = generateDateHeaders(startDate);
  const weekHeaders = generateWeekHeaders(startDate);
  const monthHeaders = generateMonthHeaders(startDate);
  const weekDisplayInfo = getWeekDisplayInfo(startDate);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartDate(new Date(startDate));
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const daysToMove = Math.round(deltaX / DAY_WIDTH);
    
    if (daysToMove !== 0) {
      const newStartDate = new Date(dragStartDate);
      newStartDate.setDate(dragStartDate.getDate() - daysToMove);
      setStartDate(newStartDate);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, dragStartX, dragStartDate]);

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

  const handleFilterUpdate = () => {
    // Reload saved filters from localStorage
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    }
  };

  const handleApplyFilter = (filterData, updateCurrentFilter = true, filterName = null) => {
    // Ažuriraj currentFilter sa novim podacima
    if (currentFilter && updateCurrentFilter) {
      const updatedFilter = {
        ...currentFilter,
        data: filterData,
        name: filterName || currentFilter.name
      };
      setCurrentFilter(updatedFilter);
    }
    
    // Ovde bi trebalo da se primeni filter na podatke
    // Za sada samo zatvaramo modal
    setIsFilterOpen(false);
  };

     // Funkcija za određivanje boje nedelje - fluid scroll
   const getWeekColor = (currentDate) => {
     // Izračunaj prvi dan nedelje za ovaj datum (ponedeljak)
     const dayOfWeek = currentDate.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
     const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ako je nedelja, idemo na prethodni ponedeljak
     const weekStartDate = new Date(currentDate);
     weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
     
     // Izračunaj broj nedelje za ovaj ponedeljak
     const weekNumber = getWeekNumber(weekStartDate);
     
           // Koristi broj nedelje za određivanje boje - samo plava i zelena
      const colors = ['bg-blue-50', 'bg-green-50'];
      const colorIndex = (weekNumber - 1) % 2; // -1 jer weekNumber počinje od 1, % 2 za samo 2 boje
      return colors[colorIndex] || 'bg-gray-50';
   };

  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Reservation Map</h1>
              
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
          
          {/* Tabela sa header-om */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header tabele sa 3 reda - draggable */}
            <div 
              ref={headerRef}
              className={`bg-gray-50 border-b border-gray-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              style={{ userSelect: 'none' }}
            >
              {/* Red 1: Godina + Mesec */}
              <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}>
                {/* Prazno polje za broj sobe */}
                <div className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-100 border-r border-gray-200">
                  Room
                </div>
                
                                 {/* Godina + Mesec - fluid scroll */}
                 {Array.from({ length: VISIBLE_DAYS }, (_, index) => {
                   const currentDate = new Date(startDate);
                   currentDate.setDate(startDate.getDate() + index);
                   
                   // Izračunaj prvi dan nedelje za ovaj datum (ponedeljak)
                   const dayOfWeek = currentDate.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
                   const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ako je nedelja, idemo na prethodni ponedeljak
                   const weekStartDate = new Date(currentDate);
                   weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
                   
                                                                                                                           // Proveri da li je ovo prvi dan ove nedelje (ponedeljak)
                      const isFirstDayOfWeek = weekStartDate.getTime() === currentDate.getTime();
                     
                     if (isFirstDayOfWeek) {
                       // Izračunaj koliko dana traje ova nedelja (do sledećeg ponedeljka ili kraja vidljivog perioda)
                       const daysInWeek = Math.min(7, VISIBLE_DAYS - index);
                       
                       // Prikaži mesec ako ima najmanje 2 dana, osim ako je prva ili poslednja nedelja sa samo 1 danom
                       if (daysInWeek >= 2 && !(index === 0 && daysInWeek === 1) && !(index + daysInWeek >= VISIBLE_DAYS && daysInWeek === 1)) {
                       const year = weekStartDate.getFullYear();
                       const month = weekStartDate.toLocaleDateString('en-US', { month: 'short' });
                       
                       return (
                         <div
                           key={index}
                           className={`px-2 py-1 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 ${getWeekColor(currentDate)}`}
                           style={{ 
                             gridColumn: `${index + 2} / span ${daysInWeek}`
                           }}
                         >
                           <div className="font-medium">{year} {month}</div>
                         </div>
                       );
                     }
                   }
                   
                   return null;
                 })}
              </div>
              
              {/* Red 2: Nedelje */}
              <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}>
                {/* Prazno polje za broj sobe */}
                <div className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-100 border-r border-gray-200">
                  Room
                </div>
                
                                 {/* Nedelje - fluid scroll */}
                 {Array.from({ length: VISIBLE_DAYS }, (_, index) => {
                   const currentDate = new Date(startDate);
                   currentDate.setDate(startDate.getDate() + index);
                   
                   // Izračunaj prvi dan nedelje za ovaj datum (ponedeljak)
                   const dayOfWeek = currentDate.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
                   const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ako je nedelja, idemo na prethodni ponedeljak
                   const weekStartDate = new Date(currentDate);
                   weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
                   
                   // Proveri da li je ovo prvi dan nedelje (ponedeljak) ili prvi prikazani dan
                   const isFirstDayOfWeek = weekStartDate.getTime() === currentDate.getTime();
                   const isFirstVisibleDay = index === 0;
                   

                   
                   // Prikaži nedelju ako je prvi dan nedelje ILI ako je prvi prikazani dan
                   if (!isFirstDayOfWeek && !isFirstVisibleDay) {
                     return null;
                   }
                   
                   // Izračunaj koliko dana traje ova nedelja
                   let daysInWeek;
                   if (isFirstVisibleDay) {
                     // Za prvi prikazani dan, računaj koliko dana ostaje do kraja nedelje
                     // dayOfWeek: 0=nedelja, 1=ponedeljak, 2=utorak, ..., 6=subota
                     // Ako je nedelja (0), ostaje 1 dan; ako je ponedeljak (1), ostaje 7 dana
                     const daysToEndOfWeek = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
                     daysInWeek = Math.min(daysToEndOfWeek, VISIBLE_DAYS);
                   } else {
                     // Za ostale dane, koristi standardnu logiku
                     daysInWeek = Math.min(7, VISIBLE_DAYS - index);
                   }
                   
                   // Proveri da li je ovo poslednja nedelja (kraj vidljivog perioda)
                   const isLastWeek = index + daysInWeek >= VISIBLE_DAYS;
                   
                   return (
                     <div
                       key={index}
                       className={`px-1 py-1 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 ${getWeekColor(currentDate)} ${
                         (isFirstDayOfWeek && index > 0) || (isFirstVisibleDay && dayOfWeek === 1) ? 'border-l-2 border-l-blue-300' : ''
                       }`}
                       style={{ 
                         gridColumn: `${index + 2} / span ${daysInWeek}`
                       }}
                     >
                       <div className="font-medium">
                         {daysInWeek > 1 ? `Week ${getWeekNumber(weekStartDate)}` : ''}
                       </div>
                     </div>
                   );
                 })}
              </div>
              
              {/* Red 3: Dani */}
              <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}>
                {/* Prazno polje za broj sobe */}
                <div className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border-r border-gray-200">
                  Room
                </div>
                
                                 {/* Datumi */}
                 {dateHeaders.map((header, index) => {
                   const currentDate = new Date(startDate);
                   currentDate.setDate(startDate.getDate() + index);
                   
                   // Izračunaj prvi dan nedelje za ovaj datum (ponedeljak)
                   const dayOfWeek = currentDate.getDay(); // 0 = nedelja, 1 = ponedeljak, ...
                   const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ako je nedelja, idemo na prethodni ponedeljak
                   const weekStartDate = new Date(currentDate);
                   weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
                   
                   // Proveri da li je ovo prvi dan nedelje (ponedeljak)
                   const isFirstDayOfWeek = weekStartDate.getTime() === currentDate.getTime();
                   
                   return (
                     <div
                       key={index}
                       className={`px-1 py-1 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 ${getWeekColor(currentDate)} ${
                         isFirstDayOfWeek ? 'border-l-2 border-l-blue-300' : ''
                       }`}
                     >
                       <div className="font-medium leading-tight">{header.day} {header.date}</div>
                     </div>
                   );
                 })}
              </div>
            </div>
            
            {/* Telo tabele - placeholder za sada */}
            <div className="p-8 text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">Reservation Map</h2>
              <p>Ovde će biti implementirane sobe i rezervacije</p>
              <p className="text-sm mt-2">💡 Pokušaj da uhvatiš header i pomeriš ga levo/desno!</p>
                             <p className="text-xs mt-1 text-blue-600">Plava i zelena pozadina označava različite nedelje</p>
            </div>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      {isFilterOpen && (
        <ReservationsFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onUpdate={handleFilterUpdate}
          currentFilter={currentFilter}
          onApplyFilter={handleApplyFilter}
        />
      )}
    </>
  );
}

