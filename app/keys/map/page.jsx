"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
  // NOVI STATE ZA MODAL
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [allowRoomEdit, setAllowRoomEdit] = useState(false);
  const [editingDateField, setEditingDateField] = useState(null); // 'checkIn' ili 'checkOut'
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
    // Ako je edit modal otvoren, ažuriraj odgovarajući datum
    if (isEditModalOpen && editingDateField) {
      const dateString = date.toISOString().split('T')[0].split('-').reverse().join('-');
      updateEditFormData(editingDateField, dateString);
      setEditingDateField(null);
      setIsCalendarOpen(false);
    } else {
      // Inače, ažuriraj startDate za MAP
      setSelectedDate(date);
      setStartDate(date);
      setIsCalendarOpen(false);
    }
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
      // Ako je kalendar otvoren u edit modal-u, zatvori ga
      if (isCalendarOpen && isEditModalOpen) {
        setIsCalendarOpen(false);
        setEditingDateField(null);
        return;
      }
      
      // Ako je kalendar otvoren u header-u, zatvori ga
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
  }, [isCalendarOpen, isEditModalOpen]);

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
    const roomReservations = mockReservations.filter(res => res.roomNumber === roomId);
    const dateString = date.toDateString();
    
    let checkinCount = 0;
    let checkoutCount = 0;
    let occupiedCount = 0;
    
    roomReservations.forEach(res => {
      const checkIn = new Date(res.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(res.checkOut.split('-').reverse().join('-'));
      
      if (dateString === checkIn.toDateString()) checkinCount++;
      if (dateString === checkOut.toDateString()) checkoutCount++;
      if (date > checkIn && date < checkOut) occupiedCount++;
    });
    
    if (checkinCount > 0 && checkoutCount > 0) return "both";
    if (checkinCount > 0) return "checkin";
    if (checkoutCount > 0) return "checkout";
    if (occupiedCount > 0) return "reserved";
    
    return "free";
  };

  // NOVA FUNKCIJA - Edit reservation modal
  const editReservation = (roomId, date, isRightHalf = false, allowRoomEditParam = false) => {
    // Postavi allowRoomEdit state
    setAllowRoomEdit(allowRoomEditParam);
    
    // Pronađi rezervaciju koja odgovara sobi i datumu
    const reservation = mockReservations.find(res => {
      const checkIn = new Date(res.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(res.checkOut.split('-').reverse().join('-'));
      const dateString = date.toDateString();
      
      // Proveri da li je datum u periodu rezervacije
      return res.roomNumber === roomId && 
             date >= checkIn && 
             date <= checkOut;
    });
    
    // Proveri da li postoji rezervaciju koja počinje ili se završava na taj datum
    const checkInReservation = mockReservations.find(res => {
      const checkIn = new Date(res.checkIn.split('-').reverse().join('-'));
      return res.roomNumber === roomId && date.toDateString() === checkIn.toDateString();
    });
    
    const checkOutReservation = mockReservations.find(res => {
      const checkOut = new Date(res.checkOut.split('-').reverse().join('-'));
      return res.roomNumber === roomId && date.toDateString() === checkOut.toDateString();
    });
    
    // Ako je kliknuto na desni deo (check-in) i postoji rezervaciju koja počinje tog dana
    if (isRightHalf && checkInReservation) {
      setSelectedReservation(checkInReservation);
      setEditFormData(checkInReservation);
      setIsEditModalOpen(true);
    }
    // Ako je kliknuto na levi deo (check-out) i postoji rezervaciju koja se završava tog dana
    else if (!isRightHalf && checkOutReservation) {
      setSelectedReservation(checkOutReservation);
      setEditFormData(checkOutReservation);
      setIsEditModalOpen(true);
    }
    // Ako postoji rezervaciju u periodu, ali nije check-in/check-out dan
    else if (reservation && !checkInReservation && !checkOutReservation) {
      setSelectedReservation(reservation);
      setEditFormData(reservation);
      setIsEditModalOpen(true);
    }
    // Inače, kreiraj novu rezervaciju
    else {
      const newReservation = {
        id: Date.now(), // Privremeni ID
        guestName: "",
        roomNumber: roomId,
        checkIn: isRightHalf ? `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}` : "",
        checkOut: !isRightHalf ? `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}` : "",
        keyStatus: "Active",
        reservationStatus: "Confirmed",
        phone: "",
        email: ""
      };
      setSelectedReservation(newReservation);
      setEditFormData(newReservation);
      setIsEditModalOpen(true);
    }
  };

  // Funkcija za ažuriranje form podataka
  const updateEditFormData = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS * DAY_PARTS}, 1fr)` }}>
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
                          gridColumn: `${index * 2 + 2} / span ${daysInMonth * 2}`
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
                <div className="grid gap-0 relative" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS * DAY_PARTS}, 1fr)` }}>
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
                          gridColumn: `${index * 2 + 2} / span ${daysInWeek * 2}`
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
                <div className="grid gap-0" style={{ gridTemplateColumns: `120px repeat(${VISIBLE_DAYS * DAY_PARTS}, 1fr)` }}>
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
                        style={{ 
                          gridColumn: `${index * 2 + 2} / span 2`
                        }}
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
                        
                        // Log za dan, sobu i status (samo ako nije free)
                        // if (reservationStatus !== 'free') {
                        //   console.log(`Room ${roomNumber}, Date ${currentDate.toLocaleDateString()}, Status: ${reservationStatus}`);
                        // }
                        
                        
                                                 // Logika za boje i separatore u jednom bloku
                         let leftBgColor = 'text-gray-500';
                         let rightBgColor = 'text-gray-500';
                         let leftSeparator = 'border-gray-100';
                         let rightSeparator = 'none';
                         
                        if (reservationStatus === 'both') {
                            // Check-in i check-out isti dan - oba dela zauzeta (jedna rezervacija se završava, druga počinje)
                            leftBgColor = 'bg-blue-100';
                            rightBgColor = 'bg-blue-100';
                            leftSeparator = 'border-black';
                            rightSeparator = '1px solid black';
                          } else if (reservationStatus === 'checkin') {
                           // Check-in dan - levi deo slobodan (do 14:00), desni zauzet (od 14:00)
                           leftBgColor = 'text-gray-500';
                           rightBgColor = 'bg-blue-100';
                           leftSeparator = 'border-black';
                           rightSeparator = 'none';
                         } else if (reservationStatus === 'checkout') {
                           // Check-out dan - levi deo zauzet (do 10:00), desni slobodan (od 10:00)
                           leftBgColor = 'bg-blue-100';
                           rightBgColor = 'text-gray-500';
                           leftSeparator = 'border-gray-100';
                           rightSeparator = '1px solid black';
                         } else if (reservationStatus === 'reserved') {
                           // Srednji dani rezervacije - ceo dan zauzet
                           leftBgColor = 'bg-blue-100';
                           rightBgColor = 'bg-blue-100';
                           leftSeparator = 'border-gray-100';
                           rightSeparator = 'none';
                         } else if (reservationStatus === 'free') {
                           // Slobodan dan
                           leftBgColor = 'text-gray-500';
                           rightBgColor = 'text-gray-500';
                           leftSeparator = 'border-gray-100';
                           rightSeparator = 'none';
                         }
                        
                        return (
                          <React.Fragment key={index}>
                            {/* Levi deo dana */}
                            <div
                              className={`px-1 py-3 text-center text-xs border-r ${leftSeparator} ${leftBgColor} cursor-pointer hover:bg-gray-100`}
                              onClick={() => editReservation(roomNumber, currentDate, false, false)}
                            >
                            </div>
                            {/* Desni deo dana */}
                            <div
                              className={`px-1 py-3 text-center text-xs border-r border-gray-100 ${rightBgColor} cursor-pointer hover:bg-gray-100`}
                              style={{
                                borderLeft: rightSeparator
                              }}
                              onClick={() => editReservation(roomNumber, currentDate, true, false)}
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

      {/* Edit Reservation Modal */}
      {isEditModalOpen && selectedReservation && (
        <div className="test-modal" onClick={() => setIsEditModalOpen(false)}>
          <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Calendar Dropdown */}
            {isCalendarOpen && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-4">
                <CalendarPicker 
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  roomId={editFormData.roomNumber}
                  editingDateField={editingDateField}
                  getReservationStatus={getReservationStatus}
                />
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedReservation.id > 1000 ? "New Reservation" : "Edit Reservation"}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input
                  type="text"
                  value={editFormData.guestName || ""}
                  onChange={(e) => updateEditFormData('guestName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter guest name..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                {allowRoomEdit ? (
                  <input
                    type="text"
                    value={editFormData.roomNumber || ""}
                    onChange={(e) => updateEditFormData('roomNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter room number..."
                  />
                ) : (
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    {editFormData.roomNumber || ""}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.checkIn ? editFormData.checkIn.split('-').reverse().join('-') : ""}
                    onChange={(e) => updateEditFormData('checkIn', e.target.value)}
                    onClick={() => {
                      console.log('Opening calendar for checkIn from edit modal');
                      setEditingDateField('checkIn');
                      // Postavi selectedDate na datum iz forme ako postoji
                      if (editFormData.checkIn) {
                        const [day, month, year] = editFormData.checkIn.split('-');
                        setSelectedDate(new Date(year, month - 1, day));
                      }
                      setIsCalendarOpen(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    placeholder="Click to select date..."
                    readOnly
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.checkOut ? editFormData.checkOut.split('-').reverse().join('-') : ""}
                    onChange={(e) => updateEditFormData('checkOut', e.target.value)}
                    onClick={() => {
                      console.log('Opening calendar for checkOut from edit modal');
                      setEditingDateField('checkOut');
                      // Postavi selectedDate na datum iz forme ako postoji
                      if (editFormData.checkOut) {
                        const [day, month, year] = editFormData.checkOut.split('-');
                        setSelectedDate(new Date(year, month - 1, day));
                      }
                      setIsCalendarOpen(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    placeholder="Click to select date..."
                    readOnly
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Status</label>
                <select
                  value={editFormData.keyStatus || "Active"}
                  onChange={(e) => updateEditFormData('keyStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Lost">Lost</option>
                  <option value="Invalidated">Invalidated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Status</label>
                <select
                  value={editFormData.reservationStatus || "Confirmed"}
                  onChange={(e) => updateEditFormData('reservationStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editFormData.phone || ""}
                  onChange={(e) => updateEditFormData('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ""}
                  onChange={(e) => updateEditFormData('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save functionality
                  console.log('Saving reservation:', editFormData);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Calendar Picker Component
function CalendarPicker({ selectedDate, onDateSelect, roomId = null, editingDateField = null, getReservationStatus = null }) {
  console.log('CalendarPicker props:', { roomId, editingDateField, hasGetReservationStatus: !!getReservationStatus });
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
    // Postavi vreme na 12:00:00 da izbegnemo timezone probleme
    newDate.setHours(12, 0, 0, 0);
    
    // Proveri da li je datum dostupan
    if (roomId) {
      const status = getReservationStatus(roomId, newDate);
      
      if (editingDateField === 'checkIn') {
        // Za check-in: zabrani occupied i checkin datume
        if (status === 'reserved' || status === 'checkin' || status === 'both') {
          return; // Ne dozvoli izbor nedostupnog datuma
        }
      } else if (editingDateField === 'checkOut') {
        // Za check-out: zabrani occupied i checkout datume, ali dozvoli checkin datume
        if (status === 'reserved' || status === 'checkout') {
          return; // Ne dozvoli izbor nedostupnog datuma
        }
      }
    }
    
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

  const isDateDisabled = (day) => {
    if (roomId) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      // Postavi vreme na 12:00:00 da izbegnemo timezone probleme
      newDate.setHours(12, 0, 0, 0);
      const status = getReservationStatus(roomId, newDate);
      
      if (editingDateField === 'checkIn') {
        // Za check-in: zabrani occupied i checkin datume
        return status === 'reserved' || status === 'checkin' || status === 'both';
      } else if (editingDateField === 'checkOut') {
        // Za check-out: zabrani occupied i checkout datume, ali dozvoli checkin datume
        return status === 'reserved' || status === 'checkout';
      }
    }
    return false;
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
      const isDisabled = isDateDisabled(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={`p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isSelected 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : isTodayDate 
                  ? 'bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200' 
                  : 'text-gray-700 hover:bg-blue-100'
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