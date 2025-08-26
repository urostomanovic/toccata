"use client";
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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
  },
  {
    id: 4,
    guestName: "Sarah Wilson",
    roomNumber: "104",
    checkIn: "28-08-2025",
    checkOut: "31-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0126",
    email: "sarah.wilson@email.com"
  },
  {
    id: 5,
    guestName: "Michael Brown",
    roomNumber: "105",
    checkIn: "29-08-2025",
    checkOut: "01-09-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Cancelled",
    phone: "+1 555-0127",
    email: "michael.brown@email.com"
  },
  {
    id: 6,
    guestName: "Emily Davis",
    roomNumber: "201",
    checkIn: "30-08-2025",
    checkOut: "02-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0128",
    email: "emily.davis@email.com"
  },
  {
    id: 7,
    guestName: "Robert Miller",
    roomNumber: "202",
    checkIn: "31-08-2025",
    checkOut: "03-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0129",
    email: "robert.miller@email.com"
  },
  {
    id: 8,
    guestName: "Lisa Anderson",
    roomNumber: "203",
    checkIn: "01-09-2025",
    checkOut: "04-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0130",
    email: "lisa.anderson@email.com"
  },
  {
    id: 9,
    guestName: "James Taylor",
    roomNumber: "204",
    checkIn: "02-09-2025",
    checkOut: "05-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0131",
    email: "james.taylor@email.com"
  },
  {
    id: 10,
    guestName: "Jennifer White",
    roomNumber: "205",
    checkIn: "03-09-2025",
    checkOut: "06-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0132",
    email: "jennifer.white@email.com"
  },
  {
    id: 11,
    guestName: "Christopher Lee",
    roomNumber: "301",
    checkIn: "04-09-2025",
    checkOut: "07-09-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Cancelled",
    phone: "+1 555-0133",
    email: "christopher.lee@email.com"
  },
  {
    id: 12,
    guestName: "Amanda Martinez",
    roomNumber: "302",
    checkIn: "05-09-2025",
    checkOut: "08-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0134",
    email: "amanda.martinez@email.com"
  },
  {
    id: 13,
    guestName: "Daniel Rodriguez",
    roomNumber: "303",
    checkIn: "06-09-2025",
    checkOut: "09-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0135",
    email: "daniel.rodriguez@email.com"
  },
  {
    id: 14,
    guestName: "Jessica Thompson",
    roomNumber: "304",
    checkIn: "07-09-2025",
    checkOut: "10-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0136",
    email: "jessica.thompson@email.com"
  },
  {
    id: 15,
    guestName: "Matthew Garcia",
    roomNumber: "305",
    checkIn: "08-09-2025",
    checkOut: "11-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0137",
    email: "matthew.garcia@email.com"
  },
  {
    id: 16,
    guestName: "Nicole Clark",
    roomNumber: "306",
    checkIn: "09-09-2025",
    checkOut: "12-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0138",
    email: "nicole.clark@email.com"
  },
  {
    id: 17,
    guestName: "Kevin Lewis",
    roomNumber: "307",
    checkIn: "10-09-2025",
    checkOut: "13-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0139",
    email: "kevin.lewis@email.com"
  },
  {
    id: 18,
    guestName: "Rachel Hall",
    roomNumber: "308",
    checkIn: "11-09-2025",
    checkOut: "14-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0140",
    email: "rachel.hall@email.com"
  },
  {
    id: 19,
    guestName: "Steven Young",
    roomNumber: "309",
    checkIn: "12-09-2025",
    checkOut: "15-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0141",
    email: "steven.young@email.com"
  },
  {
    id: 20,
    guestName: "Michelle King",
    roomNumber: "310",
    checkIn: "13-09-2025",
    checkOut: "16-09-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Cancelled",
    phone: "+1 555-0142",
    email: "michelle.king@email.com"
  },
  {
    id: 21,
    guestName: "Thomas Wright",
    roomNumber: "401",
    checkIn: "14-09-2025",
    checkOut: "17-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0143",
    email: "thomas.wright@email.com"
  },
  {
    id: 22,
    guestName: "Amanda Lopez",
    roomNumber: "402",
    checkIn: "15-09-2025",
    checkOut: "18-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0144",
    email: "amanda.lopez@email.com"
  },
  {
    id: 23,
    guestName: "Ryan Hill",
    roomNumber: "403",
    checkIn: "16-09-2025",
    checkOut: "19-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0145",
    email: "ryan.hill@email.com"
  },
  {
    id: 24,
    guestName: "Stephanie Scott",
    roomNumber: "404",
    checkIn: "17-09-2025",
    checkOut: "20-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0146",
    email: "stephanie.scott@email.com"
  },
  {
    id: 25,
    guestName: "Jason Green",
    roomNumber: "405",
    checkIn: "18-09-2025",
    checkOut: "21-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0147",
    email: "jason.green@email.com"
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hotel, setHotel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const headerRef = useRef(null);
  const calendarRef = useRef(null);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Proveri da li je fokus na stranici (ne na input poljima)
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
                  {/* Fiksirano polje za broj sobe */}
                  <div className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-100 border-r border-gray-200">
                    Room
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
                  {/* Fiksirano polje za broj sobe */}
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
                  {/* Fiksirano polje za broj sobe */}
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
              
              {/* Scroll-abilno telo tabele sa sobama */}
              <div className="max-h-96 overflow-y-auto">
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
                        <div className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border-r border-gray-200 sticky left-0 z-5">
                          {room.id}
                        </div>
                        
                        {/* Polja za datume (placeholder za sada) */}
                        {Array.from({ length: VISIBLE_DAYS }, (_, index) => (
                          <div
                            key={index}
                            className="px-1 py-3 text-center text-xs text-gray-500 border-r border-gray-100"
                          >
                            {/* Ovde će biti rezervacije */}
                          </div>
                        ))}
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