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
  
  // State za Open dropdown
  const [isOpenDropdownVisible, setIsOpenDropdownVisible] = useState(false);
  
  // State za Save As modal
  const [isSaveAsModalVisible, setIsSaveAsModalVisible] = useState(false);
  const [saveAsName, setSaveAsName] = useState("");
  
  // State za Save modal (informacija korisniku)
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  
  // State za Delete modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteFilterInfo, setDeleteFilterInfo] = useState(null);
  
  // State za Overwrite warning modal
  const [isOverwriteModalVisible, setIsOverwriteModalVisible] = useState(false);
  const [overwriteFilterInfo, setOverwriteFilterInfo] = useState(null);
  
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

  // Uklanjanje duplikata iz liste filtera
  const removeDuplicateFilters = (filters) => {
    return filters.filter((filter, index, self) => 
      index === self.findIndex(f => f.name === filter.name)
    );
  };

  // Učitavanje saved filtera iz localStorage
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-filters");
    if (saved) {
      const parsed = JSON.parse(saved);
      const uniqueFilters = removeDuplicateFilters(parsed);
      setSavedFilters(uniqueFilters);
      // Ažuriraj localStorage sa očišćenom listom
      if (uniqueFilters.length !== parsed.length) {
        localStorage.setItem("toccata-saved-filters", JSON.stringify(uniqueFilters));
      }
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

  // Toggle Open dropdown
  const handleOpenClick = () => {
    setIsOpenDropdownVisible(!isOpenDropdownVisible);
  };

  // Zatvaranje Open dropdown-a
  const handleOpenDropdownClose = () => {
    setIsOpenDropdownVisible(false);
  };

  // Izbor filtera iz Open dropdown-a
  const handleFilterSelect = (filterId) => {
    handleLoadFilter(filterId);
    setIsOpenDropdownVisible(false);
  };

  // Otvaranje Save As modala
  const handleSaveAsClick = () => {
    setIsSaveAsModalVisible(true);
    setSaveAsName("");
  };

  // Zatvaranje Save As modala
  const handleSaveAsClose = () => {
    setIsSaveAsModalVisible(false);
    setSaveAsName("");
  };

  // Čuvanje filtera kao novi
  const handleSaveAsSave = () => {
    if (saveAsName.trim()) {
      // Proveri da li već postoji filter sa istim imenom
      const existingFilter = savedFilters.find(f => f.name === saveAsName.trim());
      
      if (existingFilter) {
        // Prikaži upozorenje za overwrite
        setOverwriteFilterInfo({
          name: saveAsName.trim(),
          existingFilter: existingFilter
        });
        setIsOverwriteModalVisible(true);
        return;
      }
      
      // Ako ne postoji, nastavi sa čuvanjem
      saveFilterAsNew();
    }
  };
  
  // Funkcija za čuvanje novog filtera
  const saveFilterAsNew = () => {
    // Prikaži Save modal
    setIsSaveModalVisible(true);
    
    const newFilter = {
      id: Date.now().toString(),
      name: saveAsName.trim(),
      filters: { rooms, status, attributes },
      logic,
      deletable: true
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    saveToLocalStorage(updatedFilters);
    
    // Ažuriraj naziv selektovanog filtera
    setFilterName(saveAsName.trim());
    
    handleSaveAsClose();
    
    // Zatvori Save modal nakon 2 sekunde
    setTimeout(() => {
      setIsSaveModalVisible(false);
    }, 2000);
  };
  
  // Funkcija za overwrite postojećeg filtera
  const handleOverwriteFilter = () => {
    // Prikaži Save modal
    setIsSaveModalVisible(true);
    
    // Ažuriraj postojeći filter
    const updatedFilters = savedFilters.map(f => 
      f.name === overwriteFilterInfo.name 
        ? { ...f, filters: { rooms, status, attributes }, logic }
        : f
    );
    
    setSavedFilters(updatedFilters);
    saveToLocalStorage(updatedFilters);
    
    // Ažuriraj naziv selektovanog filtera
    setFilterName(overwriteFilterInfo.name);
    
    // Zatvori modale
    setIsOverwriteModalVisible(false);
    setOverwriteFilterInfo(null);
    handleSaveAsClose();
    
    // Zatvori Save modal nakon 2 sekunde
    setTimeout(() => {
      setIsSaveModalVisible(false);
    }, 2000);
  };
  
  // Zatvaranje overwrite modala
  const handleOverwriteClose = () => {
    setIsOverwriteModalVisible(false);
    setOverwriteFilterInfo(null);
  };

  // Keyboard handler za Save As modal
  const handleSaveAsKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveAsSave();
    } else if (e.key === 'Escape') {
      handleSaveAsClose();
    }
  };

  // Čuvanje filtera
  const handleSaveFilter = () => {
    // Prikaži Save modal
    setIsSaveModalVisible(true);
    
    // Proveri da li već postoji filter sa istim imenom
    const existingFilterIndex = savedFilters.findIndex(f => f.name === filterName);
    
    let updatedFilters;
    
    if (existingFilterIndex !== -1) {
      // Ažuriraj postojeći filter
      updatedFilters = [...savedFilters];
      updatedFilters[existingFilterIndex] = {
        ...updatedFilters[existingFilterIndex],
        filters: { rooms, status, attributes },
        logic
      };
    } else {
      // Kreiraj novi filter
      const newFilter = {
        id: Date.now().toString(),
        name: filterName,
        filters: { rooms, status, attributes },
        logic,
        deletable: true
      };
      updatedFilters = [...savedFilters, newFilter];
    }
    
    setSavedFilters(updatedFilters);
    saveToLocalStorage(updatedFilters);
    
    // Zatvori Save modal nakon 2 sekunde
    setTimeout(() => {
      setIsSaveModalVisible(false);
    }, 2000);
  };

  // Brisanje filtera
  const handleDeleteFilter = () => {
    // Pronađi trenutno selektovan filter
    const currentFilter = savedFilters.find(f => f.name === filterName);
    
    if (!currentFilter) {
      return;
    }
    
    if (!currentFilter.deletable) {
      // Prikaži informaciju da se ne može obrisati
      setDeleteFilterInfo({ id: currentFilter.id, name: currentFilter.name, notDeletable: true });
      setIsDeleteModalVisible(true);
    } else {
      // Traži potvrdu za brisanje
      setDeleteFilterInfo({ id: currentFilter.id, name: currentFilter.name, notDeletable: false });
      setIsDeleteModalVisible(true);
    }
  };

  // Potvrda brisanja filtera
  const handleConfirmDelete = () => {
    if (deleteFilterInfo) {
      const updatedFilters = savedFilters.filter(f => f.id !== deleteFilterInfo.id);
      setSavedFilters(updatedFilters);
      saveToLocalStorage(updatedFilters);
      
      // Nakon brisanja, selektuj sledeći filter
      if (updatedFilters.length > 0) {
        // Pronađi poziciju obrisanog filtera u originalnoj listi
        const deletedIndex = savedFilters.findIndex(f => f.id === deleteFilterInfo.id);
        
        // Ako je obrisan poslednji filter, uzmi prvi
        // Ako nije poslednji, uzmi filter na istoj poziciji (koji je sada sledeći)
        const nextIndex = deletedIndex >= updatedFilters.length ? 0 : deletedIndex;
        const nextFilter = updatedFilters[nextIndex];
        
        setFilterName(nextFilter.name);
        setRooms(nextFilter.filters.rooms || { floors: "", rooms: "" });
        setStatus(nextFilter.filters.status || {
          occupied: 'none',
          vacant: 'none',
          alarm: 'none',
          'to-be-cleaned': 'none',
          'out-of-order': 'none'
        });
        setAttributes(nextFilter.filters.attributes || {
          online: 'none',
          clean: 'none',
          'a-region': 'none',
          'b-region': 'none',
          'c-region': 'none'
        });
        setLogic(nextFilter.logic || "AND");
      }
      
      setIsDeleteModalVisible(false);
      setDeleteFilterInfo(null);
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
        {/* Header - Selected Filter */}
        <div className="p-6 border-b">
          <div className="text-lg font-semibold text-gray-800">
            Selected Filter: {filterName}
          </div>
        </div>

        {/* Navbar sa opcijama */}
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Open Dropdown */}
            <div className="relative">
              <button
                onClick={handleOpenClick}
                className="px-3 py-1 text-sm text-white hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                Open ▼
              </button>
              
              {/* Dropdown Menu */}
              {isOpenDropdownVisible && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[150px]">
                  {savedFilters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterSelect(filter.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSaveFilter}
              className="px-3 py-1 text-sm text-white hover:text-gray-300 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleSaveAsClick}
              className="px-3 py-1 text-sm text-white hover:text-gray-300 transition-colors"
            >
              Save As...
            </button>
            <button
              onClick={handleDeleteFilter}
              className="px-3 py-1 text-sm text-white hover:text-gray-300 transition-colors"
            >
              Delete
            </button>
          </div>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-1 text-sm text-white hover:text-gray-300 transition-colors"
          >
            Apply
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Rooms Section */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 px-3 py-1 text-gray-600 font-medium">Selected Rooms</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
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

          {/* Status Section */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 px-3 py-1 text-gray-600 font-medium">AND Status:</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
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

          {/* Attributes Section */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="mx-4 px-3 py-1 text-gray-600 font-medium">AND Attributes:</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
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
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Save Modal (informacija korisniku) */}
      {isSaveModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Saving {filterName}...
              </div>
              <div className="text-sm text-gray-600">
                Please wait while your filter is being saved.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save As Modal */}
      {isSaveAsModalVisible && (
        <div className="modal-overlay" onClick={handleSaveAsClose}>
          <div className="modal-content max-w-sm mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <label htmlFor="saveAsName" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Filter Save as:
                </label>
                <input
                  type="text"
                  id="saveAsName"
                  value={saveAsName}
                  onChange={(e) => setSaveAsName(e.target.value)}
                  onKeyDown={handleSaveAsKeyDown}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter filter name"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Delete Modal */}
       {isDeleteModalVisible && deleteFilterInfo && (
         <div className="modal-overlay" onClick={() => setIsDeleteModalVisible(false)}>
           <div className="modal-content max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
             <div className="p-6 text-center">
               <div className="text-lg font-semibold text-gray-800 mb-2">
                 {deleteFilterInfo.notDeletable ? "Cannot Delete Filter" : "Confirm Deletion"}
               </div>
               <div className="text-sm text-gray-600 mb-4">
                 {deleteFilterInfo.notDeletable ? 
                   `Filter "${deleteFilterInfo.name}" cannot be deleted as it is a default filter.` :
                   `Are you sure you want to delete the filter "${deleteFilterInfo.name}"? This action cannot be undone.`
                 }
               </div>
               <div className="flex justify-end gap-3">
                 <button
                   onClick={() => setIsDeleteModalVisible(false)}
                   className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                 >
                   {deleteFilterInfo.notDeletable ? "OK" : "Cancel"}
                 </button>
                 {!deleteFilterInfo.notDeletable && (
                   <button
                     onClick={handleConfirmDelete}
                     className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                   >
                     Delete
                   </button>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Overwrite Warning Modal */}
      {isOverwriteModalVisible && overwriteFilterInfo && (
        <div className="modal-overlay" onClick={handleOverwriteClose}>
          <div className="modal-content max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Filter Already Exists
              </div>
              <div className="text-sm text-gray-600 mb-4">
                A filter with the name "{overwriteFilterInfo.name}" already exists.
                Do you want to overwrite it?
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleOverwriteClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOverwriteFilter}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Overwrite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
