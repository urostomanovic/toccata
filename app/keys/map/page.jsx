"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { mockReservations, mockRoomsByFloor } from "@/lib/mockData";



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
  const [isRoomsDragging, setIsRoomsDragging] = useState(false);
  const [roomsDragStartY, setRoomsDragStartY] = useState(0);
  const [roomsScrollTop, setRoomsScrollTop] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const calendarRef = useRef(null);
  const roomsContainerRef = useRef(null);

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
    setIsRoomsDragging(false);
  };

  // Rooms drag and scroll handlers
  const handleRoomsMouseDown = (e) => {
    setIsRoomsDragging(true);
    setRoomsDragStartY(e.clientY);
    setRoomsScrollTop(roomsContainerRef.current?.scrollTop || 0);
  };

  const handleRoomsMouseMove = (e) => {
    if (!isRoomsDragging || !roomsContainerRef.current) return;
    
    const deltaY = roomsDragStartY - e.clientY;
    const newScrollTop = roomsScrollTop + deltaY;
    
    roomsContainerRef.current.scrollTop = newScrollTop;
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else if (isRoomsDragging) {
      document.addEventListener('mousemove', handleRoomsMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleRoomsMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleRoomsMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isDragging, isRoomsDragging, dragStartX, dragStartDate, roomsDragStartY, roomsScrollTop]);

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

  // STARI KOD - Fetch real rooms data from TOCCATA API
  // useEffect(() => {
  //   const fetchRooms = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch('/api/rooms');
  //       
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       
  //       const data = await response.json();
  //       
  //       if (data.success) {
  //         // Group rooms by floor
  //         const roomsByFloor = {};
  //         data.rooms.forEach(room => {
  //           const floorNumber = parseInt(room.floorName.split('.')[0]);
  //           if (!roomsByFloor[floorNumber]) {
  //             roomsByFloor[floorNumber] = [];
  //           }
  //           
  //           // Transform TOCCATA data to our format
  //           const transformedRoom = {
  //             id: room.roomName,
  //             status: room.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
  //             online: room.online,
  //             cleanliness: room.cleanliness,
  //             icons: room.online ? ['wifi'] : ['offline']
  //           };
  //           
  //           roomsByFloor[floorNumber].push(transformedRoom);
  //         });
  //         
  //         // Convert to 2D array format
  //         const floorsArray = Object.keys(roomsByFloor)
  //           .sort((a, b) => parseInt(a) - parseInt(b))
  //           .map(floorNumber => roomsByFloor[floorNumber]);
  //         
  //         setHotel(floorsArray);
  //       } else {
  //         throw new Error(data.error || 'Failed to fetch rooms');
  //       }
  //     } catch (err) {
  //       console.error('Error fetching rooms:', err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRooms();
  // }, []);

  // NOVI KOD - Use mock data from centralized source
  useEffect(() => {
    const loadMockRooms = () => {
      try {
        setLoading(true);
        // Use mock data directly from lib/mockData.js
        setHotel(mockRoomsByFloor);
      } catch (err) {
        console.error('Error loading mock rooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMockRooms();
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

  const handleCalendarToggle = () => {
    if (!isCalendarOpen) {
      // Kada se otvara kalendar, postavi selectedDate na trenutni startDate
      setSelectedDate(new Date(startDate));
    }
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStartDate(date);
    setIsCalendarOpen(false);
  };

  const handleMoveLeft = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 1);
    setStartDate(newStartDate);
  };

  const handleMoveRight = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 1);
    setStartDate(newStartDate);
  };

  // Keyboard navigation for horizontal and vertical scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Proveri da li je fokus na stranici (ne na input poljima)
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Horizontal scroll (datumi)
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() - 1);
        setStartDate(newStartDate);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + 1);
        setStartDate(newStartDate);
      }
      
      // Vertical scroll (sobe)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (roomsContainerRef.current) {
          const currentScroll = roomsContainerRef.current.scrollTop;
          roomsContainerRef.current.scrollTop = Math.max(0, currentScroll - 50);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (roomsContainerRef.current) {
          const currentScroll = roomsContainerRef.current.scrollTop;
          const maxScroll = roomsContainerRef.current.scrollHeight - roomsContainerRef.current.clientHeight;
          roomsContainerRef.current.scrollTop = Math.min(maxScroll, currentScroll + 50);
        }
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        if (roomsContainerRef.current) {
          const currentScroll = roomsContainerRef.current.scrollTop;
          roomsContainerRef.current.scrollTop = Math.max(0, currentScroll - 300);
        }
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        if (roomsContainerRef.current) {
          const currentScroll = roomsContainerRef.current.scrollTop;
          const maxScroll = roomsContainerRef.current.scrollHeight - roomsContainerRef.current.clientHeight;
          roomsContainerRef.current.scrollTop = Math.min(maxScroll, currentScroll + 300);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [startDate]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

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

  // Funkcija za boju meseca (žuta/narandžasta)
  const getMonthColor = (currentDate) => {
    const month = currentDate.getMonth(); // 0-11
    const year = currentDate.getFullYear();
    const monthKey = year * 12 + month; // Jedinstveni ključ za mesec
    
    return monthKey % 2 === 0 ? 'bg-yellow-100' : 'bg-orange-100';
  };

  // Funkcija za proveru da li postoji rezervacija za sobu/dan
  const hasReservation = (roomId, date) => {
    return mockReservations.some(reservation => {
      // Proveri da li je soba ista
      if (reservation.roomNumber !== roomId) return false;
      
      // Konvertuj datume u Date objekte za poređenje
      const checkIn = new Date(reservation.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(reservation.checkOut.split('-').reverse().join('-'));
      
      // Proveri da li je datum u periodu rezervacije (uključujući check-in, ali ne check-out)
      return date >= checkIn && date < checkOut;
    });
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

              {/* Calendar Icon */}
              <div className="relative" ref={calendarRef}>
                <button
                  onClick={handleCalendarToggle}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                </button>
                
                {/* Calendar Dropdown */}
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
                    <CalendarPicker 
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-1">
                <button
                  onClick={handleMoveLeft}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button
                  onClick={handleMoveRight}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                </button>
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
            
            {/* Telo tabele sa sobama */}
            <div className="relative">
              {/* Fiksirani header sa datumima */}
              <div 
                ref={headerRef}
                className={`sticky top-0 z-10 bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                style={{ userSelect: 'none' }}
              >
                {/* Red 1: Godina + Mesec */}
                <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}>
                  {/* Fiksirano polje za mesec */}
                  <div className="px-4 py-1 text-sm font-normal text-gray-700 bg-gray-100 border-r border-gray-200 text-center">
                    Month
                  </div>
                  
                  {/* Godina + Mesec - fluid scroll */}
                  {Array.from({ length: VISIBLE_DAYS }, (_, index) => {
                    const currentDate = new Date(startDate);
                    currentDate.setDate(startDate.getDate() + index);
                    
                    // Proveri da li je ovo prvi dan meseca ili prvi prikazani dan
                    const isFirstDayOfMonth = currentDate.getDate() === 1;
                    const isFirstVisibleDay = index === 0;
                    
                    // Prikaži mesec ako je prvi dan meseca ILI ako je prvi prikazani dan
                    if (!isFirstDayOfMonth && !isFirstVisibleDay) {
                      return null;
                    }
                    
                    // Izračunaj koliko dana traje ovaj mesec
                    let daysInMonth;
                    if (isFirstVisibleDay) {
                      // Za prvi prikazani dan, računaj koliko dana ostaje do kraja meseca
                      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                      daysInMonth = Math.min(lastDayOfMonth - currentDate.getDate() + 1, VISIBLE_DAYS);
                    } else {
                      // Za ostale dane, koristi standardnu logiku
                      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                      daysInMonth = Math.min(lastDayOfMonth - currentDate.getDate() + 1, VISIBLE_DAYS - index);
                    }
                    
                    return (
                      <div
                        key={index}
                        className={`px-2 py-1 text-center text-xs font-semibold text-gray-700 border-r border-gray-200 ${getMonthColor(currentDate)} ${
                          isFirstDayOfMonth ? 'border-l-2 border-l-blue-300' : ''
                        }`}
                        style={{ 
                          gridColumn: `${index + 2} / span ${daysInMonth}`
                        }}
                      >
                        <div className="font-medium">
                          {daysInMonth > 1 ? `${currentDate.getFullYear()} ${currentDate.toLocaleDateString('en-US', { month: 'short' })}` : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Red 2: Nedelje */}
                <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}>
                  {/* Fiksirano polje za nedelju */}
                  <div 
                    className={`px-4 py-1 text-sm font-normal text-gray-700 bg-gray-100 border-r border-gray-200 text-center ${isRoomsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleRoomsMouseDown}
                  >
                    Week
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
                  {/* Fiksirano polje za sobu/dan */}
                  <div 
                    className={`px-4 py-2 text-sm font-normal text-gray-700 bg-gray-100 border-r border-gray-200 text-center ${isRoomsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    onMouseDown={handleRoomsMouseDown}
                  >
                    Room / Day
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
              
              {/* Scroll-abilno telo tabele sa sobama */}
              <div 
                ref={roomsContainerRef}
                className={`max-h-96 overflow-y-auto ${isRoomsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleRoomsMouseDown}
              >
                {loading && (
                  <div className="text-center py-8">
                    <div className="text-lg font-semibold text-gray-600">Učitavanje soba...</div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg m-4">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Greška</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
                
                {!loading && !error && hotel.map((floor, floorIndex) => (
                  <div key={floorIndex}>
                    {floor.map((room) => (
                      <div 
                        key={room.id} 
                        className="grid gap-0 border-b border-gray-200"
                        style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS}, 1fr)` }}
                      >
                        {/* Fiksirani broj sobe */}
                        <div 
                          className={`px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0 z-5 ${isRoomsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                          onMouseDown={handleRoomsMouseDown}
                        >
                          {room.id}
                        </div>
                        
                        {/* Polja za datume sa rezervacijama */}
                        {Array.from({ length: VISIBLE_DAYS }, (_, index) => {
                          const currentDate = new Date(startDate);
                          currentDate.setDate(startDate.getDate() + index);
                          
                          const isReserved = hasReservation(room.id, currentDate);
                          
                          return (
                            <div
                              key={index}
                              className={`px-1 py-3 text-center text-xs border-r border-gray-100 ${
                                isReserved 
                                  ? 'bg-blue-100' 
                                  : 'text-gray-500'
                              }`}
                            >
                              {/* Polje je prazno, samo obeleženo ako postoji rezervacija */}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))}
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
          onUpdate={handleFilterUpdate}
          currentFilter={currentFilter}
          onApplyFilter={handleApplyFilter}
        />
      )}
    </>
  );
}

// Calendar Picker Component
function CalendarPicker({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(newDate);
  };

  const isSelectedDate = (day) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() && 
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSelectedDate(day);
      const isTodayDate = isToday(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 text-sm rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSelected 
              ? 'bg-blue-600 text-white' 
              : isTodayDate 
                ? 'bg-blue-100 text-blue-800 font-semibold' 
                : 'text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronDownIcon className="h-4 w-4 transform rotate-90" />
        </button>
        <h3 className="text-sm font-semibold text-gray-700">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronDownIcon className="h-4 w-4 transform -rotate-90" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
    </div>
  );
}