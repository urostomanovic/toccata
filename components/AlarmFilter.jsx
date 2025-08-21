"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export default function AlarmFilter({ isOpen, onClose, onApplyFilter, currentFilter, onFilterUpdate }) {
  const [selectedFilter, setSelectedFilter] = useState("All Alarms");
  const [savedFilters, setSavedFilters] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSaveAsModal, setShowSaveAsModal] = useState(false);
  const [showSavingModal, setShowSavingModal] = useState(false);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState("");
  const [filterToDelete, setFilterToDelete] = useState(null);
  const [filterToOverwrite, setFilterToOverwrite] = useState(null);

  // Filter criteria
  const [filterData, setFilterData] = useState({
    timeRange: {
      fromDate: "",
      fromTime: "",
      toDate: "",
      toTime: ""
    },
    rooms: "",
    statuses: {
      Active: 0,
      Acknowledged: 0,
      Resolved: 0
    },
    attributes: {
      Door: 0,
      Window: 0,
      DND: 0,
      MUR: 0,
      Temperature: 0,
      Power: 0
    }
  });

  // Load saved filters on component mount
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-alarm-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    } else {
      // Initialize with default "All Alarms" filter
      const defaultFilters = [
        {
          name: "All Alarms",
          data: {
            timeRange: { fromDate: "", fromTime: "", toDate: "", toTime: "" },
            rooms: "",
            statuses: { Active: 0, Acknowledged: 0, Resolved: 0 },
            attributes: { Door: 0, Window: 0, DND: 0, MUR: 0, Temperature: 0, Power: 0 }
          }
        }
      ];
      setSavedFilters(defaultFilters);
      localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(defaultFilters));
    }
  }, []);

  // Load currentFilter when modal opens
  useEffect(() => {
    if (isOpen && currentFilter) {
      setSelectedFilter(currentFilter.name);
      setFilterData(currentFilter.data);
    }
  }, [isOpen, currentFilter]);

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
        localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(cleaned));
      }
    }
  }, [savedFilters]);



  const handleSave = () => {
    if (selectedFilter === "All Alarms") {
      return; // Cannot modify "All Alarms"
    }

    const existingFilterIndex = savedFilters.findIndex(f => f.name === selectedFilter);
    const updatedFilters = [...savedFilters];

    if (existingFilterIndex !== -1) {
      // Update existing filter
      updatedFilters[existingFilterIndex] = {
        name: selectedFilter,
        data: filterData
      };
    } else {
      // Add new filter
      updatedFilters.push({
        name: selectedFilter,
        data: filterData
      });
    }

    setSavedFilters(updatedFilters);
    localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(updatedFilters));
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
    
    // Show saving modal
    setShowSavingModal(true);
    setTimeout(() => setShowSavingModal(false), 2000);
  };

  const handleSaveAs = () => {
    setShowSaveAsModal(true);
    setNewFilterName("");
  };

  const handleSaveAsConfirm = () => {
    if (!newFilterName.trim()) return;

    const existingFilter = savedFilters.find(f => f.name === newFilterName);
    if (existingFilter) {
      setFilterToOverwrite(newFilterName);
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
    setSelectedFilter(newFilterName);
    localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(updatedFilters));
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
    
    setShowSaveAsModal(false);
    setNewFilterName("");
  };

  const handleOverwrite = () => {
    const updatedFilters = savedFilters.map(f => 
      f.name === filterToOverwrite ? { name: filterToOverwrite, data: filterData } : f
    );
    setSavedFilters(updatedFilters);
    setSelectedFilter(filterToOverwrite);
    localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(updatedFilters));
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
    
    setShowOverwriteModal(false);
    setFilterToOverwrite(null);
  };

  const handleDelete = () => {
    if (selectedFilter === "All Alarms") {
      setShowDeleteModal(true);
      setTimeout(() => setShowDeleteModal(false), 2000);
      return;
    }

    setFilterToDelete(selectedFilter);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const updatedFilters = savedFilters.filter(f => f.name !== filterToDelete);
    setSavedFilters(updatedFilters);
    localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(updatedFilters));
    
    // Notify parent component about filter update
    if (onFilterUpdate) {
      onFilterUpdate();
    }
    
    // Select next filter
    const currentIndex = savedFilters.findIndex(f => f.name === filterToDelete);
    const nextFilter = updatedFilters[currentIndex] || updatedFilters[0];
    if (nextFilter) {
      setSelectedFilter(nextFilter.name);
      setFilterData(nextFilter.data);
    }
    
    setShowDeleteModal(false);
    setFilterToDelete(null);
  };

  const handleOpen = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFilterSelect = (filterName) => {
    const selectedFilter = savedFilters.find(f => f.name === filterName);
    if (selectedFilter) {
      setSelectedFilter(filterName);
      setFilterData(selectedFilter.data);
    }
    setShowDropdown(false);
  };

  const handleApply = () => {
    // Update the current filter with the new data
    if (selectedFilter !== "All Alarms") {
      const updatedFilters = savedFilters.map(f => 
        f.name === selectedFilter ? { name: selectedFilter, data: filterData } : f
      );
      setSavedFilters(updatedFilters);
      localStorage.setItem("toccata-saved-alarm-filters", JSON.stringify(updatedFilters));
      
      // Notify parent component about filter update
      if (onFilterUpdate) {
        onFilterUpdate();
      }
    }
    
    onApplyFilter(filterData);
    onClose();
  };

  const handleCheckboxChange = (section, key) => {
    setFilterData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: (prev[section][key] + 1) % 3 // Cycle through 0, 1, 2
      }
    }));
  };

  const getCheckboxState = (section, key) => {
    return filterData[section][key];
  };

  const getCheckboxDisplay = (state) => {
    switch (state) {
      case 0: return "⚪"; // None
      case 1: return "✅"; // ON
      case 2: return "❌"; // OFF
      default: return "⚪";
    }
  };

  if (!isOpen) return null;

  return (
    <>
             {/* Main Modal */}
       <div className="alarm-filter-modal" onClick={onClose}>
                   <div className="alarm-filter-content" onClick={(e) => e.stopPropagation()}>
           {/* Header */}
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Selected Filter: {selectedFilter}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

                     {/* Navbar */}
                       <div className="bg-gray-800 text-white p-4 rounded-lg mb-8">
             <div className="flex justify-between items-center">
               <div className="flex gap-4">
                 <div className="relative">
                   <button onClick={handleOpen} className="flex items-center gap-1 hover:text-gray-300">
                     Open
                     <ChevronDownIcon className="h-4 w-4" />
                   </button>
                   
                                       {/* Dropdown for Open */}
                    {showDropdown && (
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

                     

                     {/* Time Range Section */}
           <div className="mb-8">
             <div className="text-center text-gray-500 mb-4">───────────── Time Range ─────────────</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filterData.timeRange.fromDate}
                    onChange={(e) => setFilterData(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, fromDate: e.target.value }
                    }))}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="time"
                    value={filterData.timeRange.fromTime}
                    onChange={(e) => setFilterData(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, fromTime: e.target.value }
                    }))}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filterData.timeRange.toDate}
                    onChange={(e) => setFilterData(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, toDate: e.target.value }
                    }))}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="time"
                    value={filterData.timeRange.toTime}
                    onChange={(e) => setFilterData(prev => ({
                      ...prev,
                      timeRange: { ...prev.timeRange, toTime: e.target.value }
                    }))}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

                     {/* Rooms Section */}
           <div className="mb-8">
             <div className="text-center text-gray-500 mb-4">───────────── Selected Rooms ─────────────</div>
            <input
              type="text"
              placeholder="Enter room numbers (e.g., 101,103,105 or 101-105)"
              value={filterData.rooms}
              onChange={(e) => setFilterData(prev => ({ ...prev, rooms: e.target.value }))}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

                     {/* Statuses Section */}
           <div className="mb-8">
             <div className="text-center text-gray-500 mb-4">───────────── Status ─────────────</div>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(filterData.statuses).map((status) => (
                <button
                  key={status}
                  onClick={() => handleCheckboxChange('statuses', status)}
                  className="flex items-center gap-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <span className="text-lg">{getCheckboxDisplay(getCheckboxState('statuses', status))}</span>
                  <span className="text-sm">{status}</span>
                </button>
              ))}
            </div>
          </div>

                     {/* Attributes Section */}
           <div className="mb-8">
             <div className="text-center text-gray-500 mb-4">───────────── Attributes ─────────────</div>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(filterData.attributes).map((attr) => (
                <button
                  key={attr}
                  onClick={() => handleCheckboxChange('attributes', attr)}
                  className="flex items-center gap-2 p-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  <span className="text-lg">{getCheckboxDisplay(getCheckboxState('attributes', attr))}</span>
                  <span className="text-sm">{attr}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

                           {/* Save As Modal */}
        {showSaveAsModal && (
          <div className="test-modal">
           <div className="test-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <span>Filter Save as:</span>
              <input
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAsConfirm();
                  if (e.key === 'Escape') setShowSaveAsModal(false);
                }}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

                           {/* Saving Modal */}
        {showSavingModal && (
          <div className="test-modal">
           <div className="test-modal-content">
            <div className="text-center">
              <div className="text-lg font-semibold mb-2">Saving {selectedFilter}...</div>
            </div>
          </div>
        </div>
      )}

                           {/* Overwrite Modal */}
        {showOverwriteModal && (
          <div className="test-modal">
           <div className="test-modal-content">
            <div className="text-center">
              <div className="text-lg font-semibold mb-4">Filter "{filterToOverwrite}" already exists</div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleOverwrite}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Overwrite
                </button>
                <button
                  onClick={() => setShowOverwriteModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

                           {/* Delete Modal */}
        {showDeleteModal && (
          <div className="test-modal">
           <div className="test-modal-content">
            <div className="text-center">
              {filterToDelete === "All Alarms" ? (
                <div className="text-lg font-semibold mb-4">"All Alarms" cannot be deleted</div>
              ) : (
                <>
                  <div className="text-lg font-semibold mb-4">Delete filter "{filterToDelete}"?</div>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={handleDeleteConfirm}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
