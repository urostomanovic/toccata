"use client";

import { useState, useEffect } from "react";

export default function RoomsFilter({ isOpen, onClose, onApplyFilter, currentFilter = null }) {
  // State za filter podatke - 3 stanja: 'none', 'include', 'exclude'
  const [filterName, setFilterName] = useState("All Rooms");
  const [rooms, setRooms] = useState({ floors: "", rooms: "" });
  const [status, setStatus] = useState({
    occupied: 'none',
    vacant: 'none',
    alarm: 'none',
    'to-be-cleaned': 'none',
    'out-of-order': 'none'
  });
  const [attributes, setAttributes] = useState({
    online: 'none',
    clean: 'none',
    'a-region': 'none',
    'b-region': 'none',
    'c-region': 'none'
  });
  const [logic, setLogic] = useState("AND");
  
  // State za saved filters
  const [savedFilters, setSavedFilters] = useState([
    { 
      id: "all", 
      name: "All Rooms", 
      filters: { 
        rooms: { floors: "", rooms: "" }, 
        status: {
          occupied: 'none',
          vacant: 'none',
          alarm: 'none',
          'to-be-cleaned': 'none',
          'out-of-order': 'none'
        }, 
        attributes: {
          online: 'none',
          clean: 'none',
          'a-region': 'none',
          'b-region': 'none',
          'c-region': 'none'
        }
      }, 
      logic: "AND", 
      deletable: false 
    }
  ]);

  // Status opcije
  const statusOptions = ["occupied", "vacant", "alarm", "to-be-cleaned", "out-of-order"];
  const attributeOptions = ["online", "clean", "a-region", "b-region", "c-region"];

  // Učitavanje saved filtera iz localStorage
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedFilters(parsed);
    }
  }, []);

  // Čuvanje filtera u localStorage
  const saveToLocalStorage = (filters) => {
    localStorage.setItem("toccata-saved-filters", JSON.stringify(filters));
  };

  // Kreiranje novog filtera
  const handleNewFilter = () => {
    setFilterName("New Filter");
    setRooms({ floors: "", rooms: "" });
    setStatus({
      occupied: 'none',
      vacant: 'none',
      alarm: 'none',
      'to-be-cleaned': 'none',
      'out-of-order': 'none'
    });
    setAttributes({
      online: 'none',
      clean: 'none',
      'a-region': 'none',
      'b-region': 'none',
      'c-region': 'none'
    });
    setLogic("AND");
  };

  // Učitavanje postojećeg filtera
  const handleLoadFilter = (filterId) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter) {
      setFilterName(filter.name);
      setRooms(filter.filters.rooms || { floors: "", rooms: "" });
      setStatus(filter.filters.status || {
        occupied: 'none',
        vacant: 'none',
        alarm: 'none',
        'to-be-cleaned': 'none',
        'out-of-order': 'none'
      });
      setAttributes(filter.filters.attributes || {
        online: 'none',
        clean: 'none',
        'a-region': 'none',
        'b-region': 'none',
        'c-region': 'none'
      });
      setLogic(filter.logic || "AND");
    }
  };

  // Čuvanje filtera
  const handleSaveFilter = () => {
    const newFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { rooms, status, attributes },
      logic,
      deletable: true
    };

    const updatedFilters = [...savedFilters.filter(f => f.id !== newFilter.id), newFilter];
    setSavedFilters(updatedFilters);
    saveToLocalStorage(updatedFilters);
  };

  // Brisanje filtera
  const handleDeleteFilter = (filterId) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter && filter.deletable) {
      const updatedFilters = savedFilters.filter(f => f.id !== filterId);
      setSavedFilters(updatedFilters);
      saveToLocalStorage(updatedFilters);
    }
  };

  // Primena filtera
  const handleApplyFilter = () => {
    const filterData = {
      name: filterName,
      rooms,
      status,
      attributes,
      logic
    };
    onApplyFilter(filterData);
    onClose();
  };

  // Toggle checkbox-a sa 3 stanja: none -> include -> exclude -> none
  const toggleStatus = (statusItem) => {
    setStatus(prev => ({
      ...prev,
      [statusItem]: prev[statusItem] === 'none' ? 'include' : 
                    prev[statusItem] === 'include' ? 'exclude' : 'none'
    }));
  };

  const toggleAttribute = (attributeItem) => {
    setAttributes(prev => ({
      ...prev,
      [attributeItem]: prev[attributeItem] === 'none' ? 'include' : 
                      prev[attributeItem] === 'include' ? 'exclude' : 'none'
    }));
  };

  // Funkcija za render checkbox-a sa 3 stanja
  const renderThreeStateCheckbox = (item, currentState, onToggle, label) => {
    let checkboxClasses = "w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-0 appearance-none bg-white";
    let icon = null;
    
    if (currentState === 'include') {
      checkboxClasses += " border-green-500";
      icon = "✓";
    } else if (currentState === 'exclude') {
      checkboxClasses += " border-red-500";
      icon = "✗";
    } else {
      checkboxClasses += " border-gray-300";
    }

    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={currentState !== 'none'}
            onChange={() => onToggle(item)}
            className={checkboxClasses}
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none'
            }}
          />
          {icon && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold pointer-events-none">
              {icon}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-700 capitalize">
          {label.replace(/-/g, ' ')}
        </span>
      </label>
    );
  };

  // Parsiranje teksta u brojeve
  const parseTextToNumbers = (text) => {
    if (!text.trim()) return [];
    
    const numbers = [];
    const parts = text.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.push(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    });
    
    return [...new Set(numbers)].sort((a, b) => a - b);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-lg">Room Filter:</span>
            <select 
              value={filterName}
              onChange={(e) => handleLoadFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1"
            >
              {savedFilters.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNewFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            NEW
          </button>
        </div>

        {/* Filter Name Input */}
        <div className="px-6 pt-4 pb-2 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Name:</label>
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter filter name..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Rooms Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Rooms:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floors:</label>
                <input
                  type="text"
                  value={rooms.floors}
                  onChange={(e) => setRooms(prev => ({ ...prev, floors: e.target.value }))}
                  placeholder="1-5,3,8"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rooms:</label>
                <input
                  type="text"
                  value={rooms.rooms}
                  onChange={(e) => setRooms(prev => ({ ...prev, rooms: e.target.value }))}
                  placeholder="101,104-105"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Logic Separator */}
          <div className="flex items-center justify-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 px-3 py-1 text-gray-600 font-medium">{logic}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Status:</h3>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <div key={option}>
                  {renderThreeStateCheckbox(
                    option, 
                    status[option], 
                    toggleStatus, 
                    option
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Logic Separator */}
          <div className="flex items-center justify-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 px-3 py-1 text-gray-600 font-medium">{logic}</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Attributes Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Attributes:</h3>
            <div className="grid grid-cols-2 gap-2">
              {attributeOptions.map(option => (
                <div key={option}>
                  {renderThreeStateCheckbox(
                    option, 
                    attributes[option], 
                    toggleAttribute, 
                    option
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleSaveFilter}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Filter
          </button>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
