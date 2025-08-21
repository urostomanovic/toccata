"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";
import AlarmFilter from "@/components/AlarmFilter";
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  FunnelIcon,
  ChevronDownIcon 
} from "@heroicons/react/24/outline";

const alarmsItems = [
  { label: "Alarms Table", href: "/alarms" },
  { label: "Alarm Item 1", href: "/alarms/item1" },
  { label: "Alarm Item 2", href: "/alarms/item2" },
  { label: "Alarm Item 3", href: "/alarms/item3" },
  { label: "Settings", href: "/alarms/settings" },
];

export default function AlarmsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Učitavanje sačuvanih filtera
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-alarm-filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
        // Postavi "All Alarms" kao default filter
        setCurrentFilter(parsed.find(f => f.name === "All Alarms") || parsed[0]);
      } catch (err) {
        console.error('Error loading saved filters:', err);
      }
    }
  }, []);

  // Generisanje mock podataka za alarme
  useEffect(() => {
    const generateMockAlarms = () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const alarmTypes = [
        { type: "Door", description: "Door 1 -> 0", value: "Closed", priority: "Info" },
        { type: "Door", description: "Door 0 -> 1", value: "Open", priority: "Warning" },
        { type: "Window", description: "Window 1 -> 0", value: "Closed", priority: "Info" },
        { type: "Window", description: "Window 0 -> 1", value: "Open", priority: "Warning" },
        { type: "DND", description: "DND 0 -> 1", value: "Active", priority: "Info" },
        { type: "DND", description: "DND 1 -> 0", value: "Inactive", priority: "Info" },
        { type: "MUR", description: "MUR 0 -> 1", value: "Requested", priority: "Info" },
        { type: "MUR", description: "MUR 1 -> 0", value: "Completed", priority: "Info" },
        { type: "Temperature", description: "High temperature detected", value: "36°C", priority: "Critical" },
        { type: "Power", description: "Power consumption high", value: "2.5kW", priority: "Warning" },
      ];

      const rooms = [101, 103, 105, 107, 109, 201, 203, 205, 207, 209, 301, 303, 305, 307, 309, 401, 403, 405, 407, 409];
      
      const mockAlarms = [];
      
      for (let i = 0; i < 100; i++) {
        const randomTime = new Date(oneWeekAgo.getTime() + Math.random() * (now.getTime() - oneWeekAgo.getTime()));
        const randomAlarm = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
        const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
        
        mockAlarms.push({
          id: i + 1,
          date: randomTime.toISOString().split('T')[0],
          time: randomTime.toTimeString().split(' ')[0],
          room: randomRoom,
          type: randomAlarm.type,
          description: randomAlarm.description,
          value: randomAlarm.value,
          priority: randomAlarm.priority,
          status: Math.random() > 0.6 ? "Active" : (Math.random() > 0.5 ? "Acknowledged" : "Resolved")
        });
      }
      
      return mockAlarms.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    };

    // Simuliram loading
    setTimeout(() => {
      const alarms = generateMockAlarms();
      setAlarms(alarms);
      setFilteredAlarms(alarms);
      setLoading(false);
    }, 500);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "text-red-600 bg-red-100";
      case "Warning": return "text-yellow-600 bg-yellow-100";
      case "Info": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "text-red-600 bg-red-100";
      case "Acknowledged": return "text-yellow-600 bg-yellow-100";
      case "Resolved": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Filter alarms based on filter criteria
  const filterAlarms = (alarms, filterData) => {
    return alarms.filter(alarm => {
      // Time range filter
      if (filterData.timeRange.fromDate && filterData.timeRange.fromTime) {
        const fromDateTime = new Date(`${filterData.timeRange.fromDate}T${filterData.timeRange.fromTime}`);
        const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
        if (alarmDateTime < fromDateTime) return false;
      }
      
      if (filterData.timeRange.toDate && filterData.timeRange.toTime) {
        const toDateTime = new Date(`${filterData.timeRange.toDate}T${filterData.timeRange.toTime}`);
        const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
        if (alarmDateTime > toDateTime) return false;
      }

      // Rooms filter
      if (filterData.rooms.trim()) {
        const roomNumbers = parseTextToNumbers(filterData.rooms);
        if (roomNumbers.length > 0 && !roomNumbers.includes(alarm.room)) {
          return false;
        }
      }

      // Status filter
      const statusFilter = filterData.statuses[alarm.status];
      if (statusFilter === 2) return false; // OFF
      if (statusFilter === 1) return true; // ON
      if (statusFilter === 0) {
        // Check if any status is explicitly set to ON
        const anyStatusOn = Object.values(filterData.statuses).some(val => val === 1);
        if (anyStatusOn) return false; // If any status is ON, this one must be ON too
      }

      // Attributes filter
      const attributeFilter = filterData.attributes[alarm.type];
      if (attributeFilter === 2) return false; // OFF
      if (attributeFilter === 1) return true; // ON
      if (attributeFilter === 0) {
        // Check if any attribute is explicitly set to ON
        const anyAttributeOn = Object.values(filterData.attributes).some(val => val === 1);
        if (anyAttributeOn) return false; // If any attribute is ON, this one must be ON too
      }

      return true;
    });
  };

  // Helper function to parse room numbers from text
  const parseTextToNumbers = (text) => {
    const numbers = [];
    const parts = text.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            numbers.push(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    }
    
    return numbers;
  };

  const handleApplyFilter = (filterData) => {
    const filtered = filterAlarms(alarms, filterData);
    setFilteredAlarms(filtered);
    
    // Ažuriraj currentFilter sa imenom trenutnog filtera
    if (currentFilter) {
      const updatedFilter = {
        ...currentFilter,
        data: filterData
      };
      setCurrentFilter(updatedFilter);
    }
  };

  // Callback za ažuriranje savedFilters kada se doda novi filter
  const handleFilterUpdate = () => {
    const saved = localStorage.getItem("toccata-saved-alarm-filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
      } catch (err) {
        console.error('Error loading saved filters:', err);
      }
    }
  };



  const handleFilterSelect = (filter) => {
    setCurrentFilter(filter);
    setIsFilterDropdownOpen(false);
    
    // Primeni filtriranje
    const filtered = filterAlarms(alarms, filter.data);
    setFilteredAlarms(filtered);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Zatvori dropdown kada se klikne van njega
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Subnav items={alarmsItems} />
        <div className="pt-24 px-6">
          <div className="flex justify-center items-center h-64">
                         <div className="text-lg">Loading alarms...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Subnav items={alarmsItems} />
      
             <div className="pt-24 px-6">
                   {/* Fiksirani header sa naslovom i filter dugmetom */}
          <div className="sticky top-24 bg-white z-20 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Alarms Table</h1>
              
              {/* Filter Dropdown - Centered */}
              <div className="relative filter-dropdown">
                <button
                  onClick={toggleFilterDropdown}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-sm text-gray-700">
                    Selected filter: {currentFilter ? currentFilter.name : "All Alarms"}
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
                onClick={() => setIsFilterOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Filter
              </button>
            </div>
          </div>

                   {/* Alarm tabela */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50 sticky top-0 z-10">
                 <tr>
                                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Alarm Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                      Actions
                    </th>
                 </tr>
               </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                 {filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alarm.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alarm.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alarm.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-900">{alarm.type}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alarm.priority)}`}>
                          {alarm.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {alarm.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alarm.status)}`}>
                        {alarm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {alarm.status === "Active" && (
                          <>
                            <button className="text-blue-600 hover:text-blue-900">
                              Acknowledge
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              Resolve
                            </button>
                          </>
                        )}
                        {alarm.status === "Acknowledged" && (
                          <button className="text-green-600 hover:text-green-900">
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

                 {/* Alarm Filter Modal */}
         <AlarmFilter
           isOpen={isFilterOpen}
           onClose={() => {
             setIsFilterOpen(false);
             handleFilterUpdate(); // Ažuriraj filtere kada se modal zatvori
           }}
           onApplyFilter={handleApplyFilter}
           currentFilter={currentFilter}
           onFilterUpdate={handleFilterUpdate}
         />
      </div>
    </>
  );
}
