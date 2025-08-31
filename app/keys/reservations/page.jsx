"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import ReservationsFilter from "@/components/ReservationsFilter";
import { ChevronDownIcon, MagnifyingGlassIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { mockReservations } from "@/lib/mockData";

export default function ReservationsPage() {
  // State za filter
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState(mockReservations);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditCalendarOpen, setIsEditCalendarOpen] = useState(false);
  const [editingDateField, setEditingDateField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Apply search filter when searchTerm changes
  useEffect(() => {
    if (currentFilter && currentFilter.data) {
      handleApplyFilter(currentFilter.data);
    } else {
      // If no filter is applied, just apply search
      let filtered = mockReservations;
      if (searchTerm.trim()) {
        filtered = filtered.filter(reservation =>
          reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.roomNumber.includes(searchTerm) ||
          reservation.phone.includes(searchTerm) ||
          reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.keyStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.reservationStatus.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredReservations(filtered);
    }
  }, [searchTerm]);

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setEditFormData({
      guestName: reservation.guestName,
      roomNumber: reservation.roomNumber,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      keyStatus: reservation.keyStatus,
      reservationStatus: reservation.reservationStatus,
      phone: reservation.phone,
      email: reservation.email
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedReservation(null);
    setEditFormData({});
    setIsEditCalendarOpen(false);
    setEditingDateField(null);
    setSelectedDate(null);
  };

  const updateEditFormData = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date) => {
    if (isEditModalOpen && editingDateField) {
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      updateEditFormData(editingDateField, formattedDate);
      setIsEditCalendarOpen(false);
      setEditingDateField(null);
    }
  };

  const openCalendar = (field) => {
    setEditingDateField(field);
    setIsEditCalendarOpen(true);
    // Set selectedDate based on current form data
    if (editFormData[field]) {
      const [day, month, year] = editFormData[field].split('-');
      setSelectedDate(new Date(year, month - 1, day));
    } else {
      setSelectedDate(new Date());
    }
  };

  const validateEditReservation = (roomId, checkIn, checkOut, existingReservationId) => {
    if (!checkIn || !checkOut) {
      alert('Check-in and Check-out dates are required');
      return false;
    }

    // Parse dates
    const [dayIn, monthIn, yearIn] = checkIn.split('-');
    const [dayOut, monthOut, yearOut] = checkOut.split('-');
    const checkInDate = new Date(yearIn, monthIn - 1, dayIn);
    const checkOutDate = new Date(yearOut, monthOut - 1, dayOut);

    if (checkInDate >= checkOutDate) {
      alert('Check-out date must be after check-in date');
      return false;
    }

    // Check for overlaps with other reservations
    const overlappingReservations = mockReservations.filter(res => 
      res.id !== existingReservationId && 
      res.roomNumber === roomId.toString()
    );

    for (const reservation of overlappingReservations) {
      const [resDayIn, resMonthIn, resYearIn] = reservation.checkIn.split('-');
      const [resDayOut, resMonthOut, resYearOut] = reservation.checkOut.split('-');
      const resCheckIn = new Date(resYearIn, resMonthIn - 1, resDayIn);
      const resCheckOut = new Date(resYearOut, resMonthOut - 1, resDayOut);

      // Check if dates overlap
      if (checkInDate < resCheckOut && checkOutDate > resCheckIn) {
        alert(`Room ${roomId} is already reserved for this period`);
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!editFormData.guestName || !editFormData.checkIn || !editFormData.checkOut) {
      alert('Guest Name, Check In, and Check Out are required fields');
      return;
    }

    if (validateEditReservation(editFormData.roomNumber, editFormData.checkIn, editFormData.checkOut, selectedReservation.id)) {
      // Update the reservation in mockReservations
      const existingIndex = mockReservations.findIndex(r => r.id === selectedReservation.id);
      if (existingIndex !== -1) {
        mockReservations[existingIndex] = {
          ...mockReservations[existingIndex],
          guestName: editFormData.guestName,
          roomNumber: editFormData.roomNumber.toString(),
          checkIn: editFormData.checkIn,
          checkOut: editFormData.checkOut,
          keyStatus: editFormData.keyStatus || "Active",
          reservationStatus: editFormData.reservationStatus || "Confirmed",
          phone: editFormData.phone || "",
          email: editFormData.email || ""
        };
        console.log('Reservation updated:', mockReservations[existingIndex]);
      }
      
      alert('Reservation updated successfully!');
      closeEditModal();
      // Refresh the filtered reservations
      if (currentFilter && currentFilter.data) {
        handleApplyFilter(currentFilter.data);
      }
    }
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      const existingIndex = mockReservations.findIndex(r => r.id === selectedReservation.id);
      if (existingIndex !== -1) {
        mockReservations.splice(existingIndex, 1);
        console.log('Reservation deleted');
      }
      
      alert('Reservation deleted successfully!');
      closeEditModal();
      // Refresh the filtered reservations
      if (currentFilter && currentFilter.data) {
        handleApplyFilter(currentFilter.data);
      }
    }
  };

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

    // Search filter - applies to all text fields
    if (searchTerm.trim()) {
      filtered = filtered.filter(reservation =>
        reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.roomNumber.includes(searchTerm) ||
        reservation.phone.includes(searchTerm) ||
        reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.keyStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.reservationStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Reservations</h1>
              
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
            <div className="max-h-[32rem] overflow-y-auto">
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
                    <button 
                      onClick={() => handleEditReservation(reservation)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
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

      {/* Edit Reservation Modal */}
      {isEditModalOpen && selectedReservation && (
        <div className="test-modal" onClick={closeEditModal}>
          <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Edit Reservation</h2>
              <button
                onClick={closeEditModal}
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
                  value={editFormData.guestName || ''}
                  onChange={(e) => updateEditFormData('guestName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                <input
                  type="text"
                  value={editFormData.roomNumber || ''}
                  onChange={(e) => updateEditFormData('roomNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.checkIn || ''}
                    onClick={() => openCalendar('checkIn')}
                    readOnly
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.checkOut || ''}
                    onClick={() => openCalendar('checkOut')}
                    readOnly
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Status</label>
                <select
                  value={editFormData.keyStatus || 'Active'}
                  onChange={(e) => updateEditFormData('keyStatus', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Lost">Lost</option>
                  <option value="Invalidated">Invalidated</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Status</label>
                <select
                  value={editFormData.reservationStatus || 'Confirmed'}
                  onChange={(e) => updateEditFormData('reservationStatus', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={editFormData.phone || ''}
                  onChange={(e) => updateEditFormData('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="text"
                  value={editFormData.email || ''}
                  onChange={(e) => updateEditFormData('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Calendar Picker */}
            {isEditCalendarOpen && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}
              >
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Select {editingDateField === 'checkIn' ? 'Check-in' : 'Check-out'} Date
                  </h3>
                  
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    
                    {(() => {
                      const currentDate = selectedDate || new Date();
                      const year = currentDate.getFullYear();
                      const month = currentDate.getMonth();
                      const firstDay = new Date(year, month, 1);
                      const lastDay = new Date(year, month + 1, 0);
                      const startDate = new Date(firstDay);
                      startDate.setDate(startDate.getDate() - firstDay.getDay());
                      
                      const days = [];
                      for (let i = 0; i < 42; i++) {
                        const date = new Date(startDate);
                        date.setDate(startDate.getDate() + i);
                        
                        if (date.getMonth() === month) {
                          const dayNumber = date.getDate();
                          const isSelected = editFormData[editingDateField] === `${dayNumber.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`;
                          
                          days.push(
                            <button
                              key={i}
                              onClick={() => handleDateSelect(date)}
                              className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                                isSelected 
                                  ? 'bg-blue-600 text-white' 
                                  : 'hover:bg-gray-100 text-gray-700'
                              }`}
                            >
                              {dayNumber}
                            </button>
                          );
                        } else {
                          days.push(<div key={i} className="w-10 h-10"></div>);
                        }
                      }
                      return days;
                    })()}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate || new Date());
                        newDate.setMonth(newDate.getMonth() - 1);
                        setSelectedDate(newDate);
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        const newDate = new Date(selectedDate || new Date());
                        newDate.setMonth(newDate.getMonth() + 1);
                        setSelectedDate(newDate);
                      }}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Next
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsEditCalendarOpen(false)}
                    className="mt-4 w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
