"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Mock podaci za rezervacije
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
  },
  {
    id: 3,
    guestName: "David Johnson",
    roomNumber: "103",
    checkIn: "24-08-2025",
    checkOut: "27-08-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0125",
    email: "david.johnson@email.com"
  },
  {
    id: 4,
    guestName: "Sarah Wilson",
    roomNumber: "201",
    checkIn: "25-08-2025",
    checkOut: "28-08-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Confirmed",
    phone: "+1 555-0126",
    email: "sarah.wilson@email.com"
  },
  {
    id: 5,
    guestName: "Michael Brown",
    roomNumber: "202",
    checkIn: "26-08-2025",
    checkOut: "29-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0127",
    email: "michael.brown@email.com"
  },
  {
    id: 6,
    guestName: "Lisa Davis",
    roomNumber: "203",
    checkIn: "27-08-2025",
    checkOut: "30-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0128",
    email: "lisa.davis@email.com"
  },
  {
    id: 7,
    guestName: "Robert Miller",
    roomNumber: "301",
    checkIn: "28-08-2025",
    checkOut: "31-08-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0129",
    email: "robert.miller@email.com"
  },
  {
    id: 8,
    guestName: "Jennifer Taylor",
    roomNumber: "302",
    checkIn: "29-08-2025",
    checkOut: "01-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0130",
    email: "jennifer.taylor@email.com"
  }
];

export default function ReservationsPage() {
  // State za filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState(mockReservations);



  // Load saved filters on component mount
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
      // Set default filter
      const defaultFilter = parsed.find(f => f.name === "All Reservations");
      if (defaultFilter) {
        setCurrentFilter(defaultFilter);
      }
    } else {
      // Initialize with default filter if no saved filters exist
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

  // Load last active filter when component mounts
  useEffect(() => {
    const lastActiveFilter = localStorage.getItem("toccata-last-active-keys-filter");
    if (lastActiveFilter) {
      try {
        const parsedFilter = JSON.parse(lastActiveFilter);
        setCurrentFilter(parsedFilter);
        // Apply the filter to the data
        handleApplyFilter(parsedFilter.data, false);
      } catch (error) {
        console.error("Error parsing last active filter:", error);
      }
    }
  }, []);

  // Save current filter to localStorage whenever it changes
  useEffect(() => {
    if (currentFilter) {
      localStorage.setItem("toccata-current-reservation-filter", JSON.stringify(currentFilter));
    }
  }, [currentFilter]);

  const handleFilterUpdate = () => {
    // Reload saved filters from localStorage
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    }
  };

  const getKeyStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Lost":
        return "bg-red-100 text-red-800";
      case "Invalidated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getReservationStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    setIsFilterDropdownOpen(false);
    // Apply filter immediately but don't update currentFilter
    handleApplyFilter(filter.data, false);
    
    // Sačuvaj aktivan filter u localStorage
    localStorage.setItem("toccata-current-reservation-filter", JSON.stringify(filter));
    localStorage.setItem("toccata-last-active-keys-filter", JSON.stringify(filter));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const handleApplyFilter = (filterData, updateCurrentFilter = true, filterName = null) => {
    // Ažuriraj currentFilter sa novim podacima
    if (currentFilter && updateCurrentFilter) {
      const updatedFilter = {
        ...currentFilter,
        data: filterData,
        // Ako je prosleđeno ime filtera, koristi ga, inače zadrži postojeće ime
        name: filterName || currentFilter.name
      };
      setCurrentFilter(updatedFilter);
    }
    
    let filtered = mockReservations;

    // Filter by guest name
    if (filterData.guestName) {
      filtered = filtered.filter(reservation =>
        reservation.guestName.toLowerCase().includes(filterData.guestName.toLowerCase())
      );
    }

    // Filter by room number
    if (filterData.roomNumber) {
      filtered = filtered.filter(reservation =>
        reservation.roomNumber.includes(filterData.roomNumber)
      );
    }

    // Filter by check-in date
    if (filterData.checkInDate) {
      filtered = filtered.filter(reservation =>
        reservation.checkIn === filterData.checkInDate
      );
    }

    // Filter by check-out date
    if (filterData.checkOutDate) {
      filtered = filtered.filter(reservation =>
        reservation.checkOut === filterData.checkOutDate
      );
    }

    // Filter by phone
    if (filterData.phone) {
      filtered = filtered.filter(reservation =>
        reservation.phone.includes(filterData.phone)
      );
    }

    // Filter by email
    if (filterData.email) {
      filtered = filtered.filter(reservation =>
        reservation.email.toLowerCase().includes(filterData.email.toLowerCase())
      );
    }

    // Filter by key status
    const selectedKeyStatuses = Object.keys(filterData.keyStatus).filter(
      status => filterData.keyStatus[status] === 1
    );
    if (selectedKeyStatuses.length > 0) {
      filtered = filtered.filter(reservation =>
        selectedKeyStatuses.includes(reservation.keyStatus)
      );
    }

    // Filter by reservation status
    const selectedReservationStatuses = Object.keys(filterData.reservationStatus).filter(
      status => filterData.reservationStatus[status] === 1
    );
    if (selectedReservationStatuses.length > 0) {
      filtered = filtered.filter(reservation =>
        selectedReservationStatuses.includes(reservation.reservationStatus)
      );
    }

    setFilteredReservations(filtered);
  };

  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          {/* Filter Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>
            
            {/* Filter Dropdown - Centered */}
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
            
                                                                                                       <button
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   setIsFilterOpen(true);
                 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Filter
              </button>
          </div>
          
          {/* Tabela sa fiksnim zaglavljem */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Fiksno zaglavlje tabele */}
            <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <div className="grid grid-cols-9 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
                <div>Guest Name</div>
                <div>Room</div>
                <div>Check In</div>
                <div>Check Out</div>
                <div>Key Status</div>
                <div>Status</div>
                <div>Phone</div>
                <div>Email</div>
                <div>Actions</div>
              </div>
            </div>
            
            {/* Skrolabilno telo tabele */}
            <div className="max-h-96 overflow-y-auto">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="grid grid-cols-9 gap-4 px-6 py-4 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    {reservation.guestName}
                  </div>
                  <div className="text-gray-700">
                    {reservation.roomNumber}
                  </div>
                  <div className="text-gray-700">
                    {reservation.checkIn}
                  </div>
                  <div className="text-gray-700">
                    {reservation.checkOut}
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKeyStatusColor(reservation.keyStatus)}`}>
                      {reservation.keyStatus}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReservationStatusColor(reservation.reservationStatus)}`}>
                      {reservation.reservationStatus}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    {reservation.phone}
                  </div>
                  <div className="text-gray-700 truncate">
                    {reservation.email}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ReservationsFilter Modal */}
      <ReservationsFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        currentFilter={currentFilter}
        onFilterUpdate={handleFilterUpdate}
      />
    </>
  );
}
