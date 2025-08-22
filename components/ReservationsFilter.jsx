"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function ReservationsFilter({ isOpen, onClose, onApplyFilter, currentFilter = null, onFilterUpdate }) {
  const [selectedFilter, setSelectedFilter] = useState("All Reservations");
  const [savedFilters, setSavedFilters] = useState([]);
  const [isOpenDropdownVisible, setIsOpenDropdownVisible] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [filterToDelete, setFilterToDelete] = useState(null);
  const [filterToOverwrite, setFilterToOverwrite] = useState(null);

  // Filter criteria za rezervacije
  const [filterData, setFilterData] = useState({
    guestName: "",
    roomNumber: "",
    checkInDate: "",
    checkOutDate: "",
    keyStatus: {
      Active: 0,
      Lost: 0,
      Invalidated: 0
    },
    reservationStatus: {
      Confirmed: 0,
      Pending: 0,
      Cancelled: 0
    },
    phone: "",
    email: ""
  });



  // Load saved filters on component mount
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-reservation-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    } else {
      // Initialize with default "All Reservations" filter
      const defaultFilters = [
        {
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
        }
      ];
      setSavedFilters(defaultFilters);
      localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(defaultFilters));
    }
  }, []);

  // Load currentFilter when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentFilter) {
        setSelectedFilter(currentFilter.name);
        setFilterData(currentFilter.data);
      }
      // Ne resetuj selectedFilter ako nema currentFilter - ostavi ga kako jeste
    }
  }, [isOpen, currentFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
         const handleClickOutside = (event) => {
       if (isOpenDropdownVisible && !event.target.closest('.relative')) {
         setIsOpenDropdownVisible(false);
       }
     };

    if (isOpenDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenDropdownVisible]);

  // Remove duplicate filters
  const removeDuplicateFilters = (filters) => {
    const seen = new Set();
    return filters.filter(filter => {
      if (seen.has(filter.name)) {
        return false;
      }
      seen.add(filter.name);
      return true;
    });
  };

  useEffect(() => {
    if (savedFilters.length > 0) {
      const cleaned = removeDuplicateFilters(savedFilters);
      if (cleaned.length !== savedFilters.length) {
        setSavedFilters(cleaned);
        localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(cleaned));
      }
    }
  }, [savedFilters]);

  const handleSave = () => {
    if (selectedFilter === "All Reservations") {
      return; // Cannot modify "All Reservations"
    }

    const existingFilter = savedFilters.find(f => f.name === selectedFilter);
    if (existingFilter) {
      // Update existing filter
      const updatedFilters = savedFilters.map(f => 
        f.name === selectedFilter ? { ...f, data: filterData } : f
      );
      setSavedFilters(updatedFilters);
      localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(updatedFilters));
      setShowSavingModal(true);
      setTimeout(() => setShowSavingModal(false), 1500);
    }
  };

  const handleSaveAs = () => {
    setShowSaveAsModal(true);
  };

  const handleSaveAsConfirm = () => {
    if (!newFilterName.trim()) return;

    const existingFilter = savedFilters.find(f => f.name === newFilterName);
    if (existingFilter) {
      setFilterToOverwrite(existingFilter);
      setShowOverwriteModal(true);
      setShowSaveAsModal(false);
      return;
    }

    const newFilter = {
      name: newFilterName,
      data: filterData
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(updatedFilters));
    setSelectedFilter(newFilterName);
    setNewFilterName("");
    setShowSaveAsModal(false);
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
  };

  const handleOverwriteConfirm = () => {
    const updatedFilters = savedFilters.map(f => 
      f.name === filterToOverwrite.name ? { ...f, data: filterData } : f
    );
    setSavedFilters(updatedFilters);
    localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(updatedFilters));
    setSelectedFilter(filterToOverwrite.name);
    setFilterToOverwrite(null);
    setShowOverwriteModal(false);
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
  };

  const handleDelete = () => {
    if (selectedFilter === "All Reservations") {
      return; // Cannot delete "All Reservations"
    }

    const filterToDelete = savedFilters.find(f => f.name === selectedFilter);
    if (filterToDelete) {
      setFilterToDelete(filterToDelete);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    const updatedFilters = savedFilters.filter(f => f.name !== filterToDelete.name);
    setSavedFilters(updatedFilters);
    localStorage.setItem("toccata-saved-reservation-filters", JSON.stringify(updatedFilters));
    setSelectedFilter("All Reservations");
    setFilterData({
      guestName: "",
      roomNumber: "",
      checkInDate: "",
      checkOutDate: "",
      keyStatus: { Active: 0, Lost: 0, Invalidated: 0 },
      reservationStatus: { Confirmed: 0, Pending: 0, Cancelled: 0 },
      phone: "",
      email: ""
    });
    setFilterToDelete(null);
    setShowDeleteModal(false);
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
  };

  const handleFilterSelect = (filterName) => {
    handleLoadFilter(filterName);
    setIsOpenDropdownVisible(false);
  };

  // Funkcija za učitavanje filtera (kao u RoomsFilter)
  const handleLoadFilter = (filterName) => {
    const filter = savedFilters.find(f => f.name === filterName);
    if (filter) {
      setSelectedFilter(filterName);
      setFilterData(filter.data);
    }
  };

  const handleOpenClick = () => {
    setIsOpenDropdownVisible(!isOpenDropdownVisible);
  };

  const handleApply = () => {
    onApplyFilter(filterData, true, selectedFilter);
    
    // Sačuvaj aktivan filter u localStorage
    const activeFilter = {
      name: selectedFilter,
      data: filterData
    };
    localStorage.setItem("toccata-current-reservation-filter", JSON.stringify(activeFilter));
    localStorage.setItem("toccata-last-active-keys-filter", JSON.stringify(activeFilter));
    
    onClose();
  };

  const updateFilterData = (field, value) => {
    setFilterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateKeyStatus = (status, value) => {
    setFilterData(prev => ({
      ...prev,
      keyStatus: {
        ...prev.keyStatus,
        [status]: value
      }
    }));
  };

  const updateReservationStatus = (status, value) => {
    setFilterData(prev => ({
      ...prev,
      reservationStatus: {
        ...prev.reservationStatus,
        [status]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="test-modal" onClick={onClose}>
      <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
                         <h2 className="text-xl font-semibold text-gray-900">Reservations Filter</h2>
                         <p className="text-sm text-gray-600 mt-1">Current filter: {selectedFilter}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navbar */}
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
                             <div className="relative">
                <button onClick={handleOpenClick} className="flex items-center gap-1 hover:text-gray-300">
                  Open
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                
                {/* Dropdown for Open */}
                {isOpenDropdownVisible && (
                  <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-60 mt-1 w-48" style={{ top: '100%', left: '0' }}>
                    {savedFilters.map((filter) => (
                      <button
                        key={filter.name}
                        onClick={() => handleFilterSelect(filter.name)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleSave} className="hover:text-gray-300">Save</button>
              <button onClick={handleSaveAs} className="hover:text-gray-300">Save As...</button>
              <button onClick={handleDelete} className="hover:text-gray-300">Delete</button>
            </div>
            <button onClick={handleApply} className="hover:text-gray-300">Apply</button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="space-y-6">
          {/* Guest Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name
              </label>
              <input
                type="text"
                value={filterData.guestName}
                onChange={(e) => updateFilterData('guestName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter guest name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="text"
                value={filterData.roomNumber}
                onChange={(e) => updateFilterData('roomNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room number..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={filterData.checkInDate}
                onChange={(e) => updateFilterData('checkInDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={filterData.checkOutDate}
                onChange={(e) => updateFilterData('checkOutDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="text"
                value={filterData.phone}
                onChange={(e) => updateFilterData('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={filterData.email}
                onChange={(e) => updateFilterData('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email..."
              />
            </div>
          </div>

          {/* Key Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Key Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(filterData.keyStatus).map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`key-${status}`}
                    checked={filterData.keyStatus[status] === 1}
                    onChange={(e) => updateKeyStatus(status, e.target.checked ? 1 : 0)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`key-${status}`} className="ml-2 text-sm text-gray-700">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reservation Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Reservation Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(filterData.reservationStatus).map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`reservation-${status}`}
                    checked={filterData.reservationStatus[status] === 1}
                    onChange={(e) => updateReservationStatus(status, e.target.checked ? 1 : 0)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`reservation-${status}`} className="ml-2 text-sm text-gray-700">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save As Modal */}
        {showSaveAsModal && (
          <div className="test-modal" onClick={() => setShowSaveAsModal(false)}>
            <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Save Filter As</h3>
              <input
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                placeholder="Enter filter name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSaveAsModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overwrite Modal */}
        {showOverwriteModal && (
          <div className="test-modal" onClick={() => setShowOverwriteModal(false)}>
            <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Overwrite Filter</h3>
              <p className="text-gray-600 mb-4">
                Filter "{filterToOverwrite?.name}" already exists. Do you want to overwrite it?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowOverwriteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverwriteConfirm}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Overwrite
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="test-modal" onClick={() => setShowDeleteModal(false)}>
            <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Filter</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{filterToDelete?.name}"?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saving Modal */}
        {showSavingModal && (
          <div className="test-modal">
            <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
              <p className="text-gray-900">Filter saved successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
