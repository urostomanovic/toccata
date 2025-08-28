"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { mockReservations, mockRooms } from "@/lib/mockData";

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [startDate, setStartDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toccata-map-startdate');
      if (saved) {
        try {
          return new Date(saved);
        } catch (error) {
          console.error('Error parsing saved startDate:', error);
        }
      }
    }
    return new Date();
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartDate, setDragStartDate] = useState(null);
  const [isRoomsDragging, setIsRoomsDragging] = useState(false);
  const [roomsDragStartY, setRoomsDragStartY] = useState(0);
  const [roomsScrollTop, setRoomsScrollTop] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hotel, setHotel] = useState([]);
  const [startRoom, setStartRoom] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toccata-map-startroom');
      if (saved) {
        try {
          return parseInt(saved);
        } catch (error) {
          console.error('Error parsing saved startRoom:', error);
        }
      }
    }
    return 0;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const calendarRef = useRef(null);
  const roomsContainerRef = useRef(null);

  // Konstante za fluid scroll
  const VISIBLE_DAYS = 21; // 3 nedelje
  const VISIBLE_ROOMS = 15; // broj soba koji se prikazuje
  const DAY_WIDTH = 25; // px po polovini dana (levi/desni deo)
  const DAY_PARTS = 2; // levi i desni deo dana

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
    const weekMap = new Map();
    
    for (let i = 0; i < VISIBLE_DAYS; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const dayOfWeek = currentDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const weekStartDate = new Date(currentDate);
      weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
      
      const weekKey = weekStartDate.toISOString().split('T')[0];
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
    
    const firstDayOfView = new Date(start);
    const firstDayOfWeek = firstDayOfView.getDay();
    
    let displayPattern;
    if (firstDayOfWeek === 0) {
      displayPattern = [false, true, true, true];
    } else if (firstDayOfWeek === 1) {
      displayPattern = [true, true, true, false];
    } else if (firstDayOfWeek === 2) {
      displayPattern = [true, true, true, false];
    } else {
      displayPattern = [true, true, true, true];
    }
    
    for (let weekIndex = 0; weekIndex < 4; weekIndex++) {
      if (displayPattern[weekIndex]) {
        const weekStartDate = new Date(start);
        weekStartDate.setDate(start.getDate() + (weekIndex * 7) - firstDayOfWeek);
        
        const weekNumber = getWeekNumber(weekStartDate);
        const daysInWeek = weekIndex === 0 ? 7 - firstDayOfWeek : (weekIndex === 3 ? firstDayOfWeek : 7);
        
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
    const daysToMove = Math.round(deltaX / (DAY_WIDTH * 2));
    
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
    
    if (deltaY < 0 && startRoom > 0) {
      const newStartRoom = Math.max(0, startRoom - 1);
      setStartRoom(newStartRoom);
      setRoomsDragStartY(e.clientY);
      roomsContainerRef.current.scrollTop = 0;
    }
    else if (deltaY > 0 && startRoom < hotel.length - VISIBLE_ROOMS) {
      const newStartRoom = Math.min(hotel.length - VISIBLE_ROOMS, startRoom + 1);
      setStartRoom(newStartRoom);
      setRoomsDragStartY(e.clientY);
      roomsContainerRef.current.scrollTop = 0;
    }
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

  // NOVI KOD - Use mock data from centralized source
  useEffect(() => {
    const loadMockRooms = () => {
      try {
        setLoading(true);
        setHotel(mockRooms);
      } catch (err) {
        console.error('Error loading mock rooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMockRooms();
  }, []);

  // Sačuvaj startRoom i startDate poziciju pri izlasku
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('toccata-map-startroom', startRoom.toString());
        localStorage.setItem('toccata-map-startdate', startDate.toISOString());
      }
    };
  }, [startRoom, startDate]);

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    setIsFilterDropdownOpen(false);
  };

  const handleFilterUpdate = () => {
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    }
  };

  const handleCalendarToggle = () => {
    if (!isCalendarOpen) {
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

  // Funkcije za pomeranje kroz sobe (analogno datuma)
  const handleRoomsMoveLeft = () => {
    setStartRoom(Math.max(0, startRoom - 1));
  };

  const handleRoomsMoveRight = () => {
    const maxStartRoom = Math.max(0, hotel.length - VISIBLE_ROOMS);
    setStartRoom(Math.min(maxStartRoom, startRoom + 1));
  };

  // Keyboard navigation for horizontal and vertical scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

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
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleRoomsMoveLeft();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleRoomsMoveRight();
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        setStartRoom(Math.max(0, startRoom - 3));
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        const maxStartRoom = Math.max(0, hotel.length - VISIBLE_ROOMS);
        setStartRoom(Math.min(maxStartRoom, startRoom + 3));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [startDate, startRoom, hotel.length]);

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
    if (currentFilter && updateCurrentFilter) {
      const updatedFilter = {
        ...currentFilter,
        data: filterData,
        name: filterName || currentFilter.name
      };
      setCurrentFilter(updatedFilter);
    }
    
    setIsFilterOpen(false);
  };

  // Funkcija za određivanje boje nedelje - fluid scroll
  const getWeekColor = (currentDate) => {
    const dayOfWeek = currentDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStartDate = new Date(currentDate);
    weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
    
    const weekNumber = getWeekNumber(weekStartDate);
    
    const colors = ['bg-blue-50', 'bg-green-50'];
    const colorIndex = (weekNumber - 1) % 2;
    return colors[colorIndex] || 'bg-gray-50';
  };

  // Funkcija za boju meseca (žuta/narandžasta)
  const getMonthColor = (currentDate) => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthKey = year * 12 + month;
    
    return monthKey % 2 === 0 ? 'bg-yellow-100' : 'bg-orange-100';
  };

  // NOVA FUNKCIJA - Vraća status: "free", "reserved", "checkin", "checkout", "both"
  const getReservationStatus = (roomId, date) => {
    // Pronađi sve rezervacije za ovu sobu na ovaj datum
    const reservations = mockReservations.filter(res => {
      if (res.roomNumber !== roomId) return false;
      
      // Konvertuj datume u Date objekte za poređenje
      const checkIn = new Date(res.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(res.checkOut.split('-').reverse().join('-'));
      
      // Proveri da li je datum u periodu rezervacije (uključujući check-out dan)
      return date >= checkIn && date <= checkOut;
    });
    
    if (reservations.length === 0) return "free";
    
    // Proveri da li postoji check-in i check-out na isti dan
    let hasCheckIn = false;
    let hasCheckOut = false;
    
    reservations.forEach(res => {
      const checkIn = new Date(res.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(res.checkOut.split('-').reverse().join('-'));
      
      // Proveri da li je ovo check-in dan
      if (date.getTime() === checkIn.getTime()) {
        hasCheckIn = true;
      }
      // Proveri da li je ovo check-out dan
      if (date.getTime() === checkOut.getTime()) {
        hasCheckOut = true;
      }
    });
    
    if (hasCheckIn && hasCheckOut) {
      return "both"; // Check-in i check-out isti dan
    } else if (hasCheckIn) {
      return "checkin"; // Check-in dan
    } else if (hasCheckOut) {
      return "checkout"; // Check-out dan
    } else {
      return "reserved"; // Srednji dani rezervacije
    }
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

              {/* Navigation Arrows - Datumi */}
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

              {/* Navigation Arrows - Sobe (Gore/Dole) */}
              <div className="flex gap-1">
                <button
                  onClick={handleRoomsMoveLeft}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={startRoom === 0}
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={handleRoomsMoveRight}
                  className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={startRoom >= Math.max(0, hotel.length - VISIBLE_ROOMS)}
                >
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
                    
                    const isFirstDayOfMonth = currentDate.getDate() === 1;
                    const isFirstVisibleDay = index === 0;
                    
                    if (!isFirstDayOfMonth && !isFirstVisibleDay) {
                      return null;
                    }
                    
                    let daysInMonth;
                    if (isFirstVisibleDay) {
                      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                      daysInMonth = Math.min(lastDayOfMonth - currentDate.getDate() + 1, VISIBLE_DAYS);
                    } else {
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
                    
                    const dayOfWeek = currentDate.getDay();
                    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    const weekStartDate = new Date(currentDate);
                    weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
                    
                    const isFirstDayOfWeek = weekStartDate.getTime() === currentDate.getTime();
                    const isFirstVisibleDay = index === 0;
                    
                    if (!isFirstDayOfWeek && !isFirstVisibleDay) {
                      return null;
                    }
                    
                    let daysInWeek;
                    if (isFirstVisibleDay) {
                      const daysToEndOfWeek = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
                      daysInWeek = Math.min(daysToEndOfWeek, VISIBLE_DAYS);
                    } else {
                      daysInWeek = Math.min(7, VISIBLE_DAYS - index);
                    }
                    
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
                    
                    const dayOfWeek = currentDate.getDay();
                    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    const weekStartDate = new Date(currentDate);
                    weekStartDate.setDate(currentDate.getDate() - daysToSubtract);
                    
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
                
                {!loading && !error && Array.from({ length: VISIBLE_ROOMS }, (_, roomIndex) => {
                  const actualRoomIndex = startRoom + roomIndex;
                  const roomNumber = hotel[actualRoomIndex];
                  
                  if (!roomNumber) return null;
                  
                  return (
                    <div 
                      key={actualRoomIndex} 
                      className="grid gap-0 border-b border-gray-200"
                      style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS * DAY_PARTS}, 1fr)` }}
                    >
                      {/* Fiksirani broj sobe */}
                      <div 
                        className={`px-4 py-1 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0 z-5 ${isRoomsDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                        onMouseDown={handleRoomsMouseDown}
                      >
                        {roomNumber}
                      </div>
                      
                      {/* Polja za datume sa rezervacijama - levi i desni deo */}
                      {Array.from({ length: VISIBLE_DAYS }, (_, index) => {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + index);
                        
                        const reservationStatus = getReservationStatus(roomNumber, currentDate);
                        
                        // Debug log za sobu 107, 20.8
                        if (roomNumber === "107" && currentDate.getDate() === 20 && currentDate.getMonth() === 7) {
                          console.log(`Room ${roomNumber}, Date ${currentDate}, Status: ${reservationStatus}`);
                        }
                        
                        // Logika za boje i separatore u jednom bloku
                        let leftBgColor = 'text-gray-500';
                        let rightBgColor = 'text-gray-500';
                        let leftSeparator = 'border-gray-100';
                        let rightSeparator = 'none';
                        
                        if (reservationStatus === 'both') {
                          leftBgColor = 'bg-blue-100';
                          rightBgColor = 'bg-blue-100';
                          leftSeparator = 'border-black';
                          rightSeparator = '1px solid black';
                        } else if (reservationStatus === 'checkin') {
                          leftBgColor = 'text-gray-500';
                          rightBgColor = 'bg-blue-100';
                          leftSeparator = 'border-black';
                          rightSeparator = 'none';
                        } else if (reservationStatus === 'checkout') {
                          leftBgColor = 'bg-blue-100';
                          rightBgColor = 'text-gray-500';
                          leftSeparator = 'border-gray-100';
                          rightSeparator = '1px solid black';
                        } else if (reservationStatus === 'reserved') {
                          leftBgColor = 'bg-blue-100';
                          rightBgColor = 'bg-blue-100';
                          leftSeparator = 'border-gray-100';
                          rightSeparator = 'none';
                        } else if (reservationStatus === 'free') {
                          leftBgColor = 'text-gray-500';
                          rightBgColor = 'text-gray-500';
                          leftSeparator = 'border-gray-100';
                          rightSeparator = 'none';
                        }
                        
                        return (
                          <React.Fragment key={index}>
                            {/* Levi deo dana */}
                            <div
                              className={`px-1 py-3 text-center text-xs border-r ${leftSeparator} ${leftBgColor}`}
                            >
                            </div>
                            {/* Desni deo dana */}
                            <div
                              className={`px-1 py-3 text-center text-xs border-r border-gray-100 ${rightBgColor}`}
                              style={{
                                borderLeft: rightSeparator
                              }}
                            >
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  );
                })}
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

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

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