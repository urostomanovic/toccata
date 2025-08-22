"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AlarmsSubnav from "@/components/AlarmsSubnav";
import AlarmFilter from "@/components/AlarmFilter";
import { 
  ExclamationTriangleIcon, 
  ChevronDownIcon 
} from "@heroicons/react/24/outline";

export default function AlarmsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [filteredAlarms, setFilteredAlarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(null);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Load saved filters
  useEffect(() => {
    const saved = localStorage.getItem("toccata-saved-alarm-filters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
        setCurrentFilter(parsed.find(f => f.name === "All Alarms") || parsed[0]);
      } catch (err) {
        console.error('Error loading saved filters:', err);
      }
    }
  }, []);

  // Save current filter to localStorage
  useEffect(() => {
    if (currentFilter) {
      localStorage.setItem("toccata-current-alarm-filter", JSON.stringify(currentFilter));
    }
  }, [currentFilter]);

  // Generate mock alarms data
  useEffect(() => {
    const generateMockAlarms = () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const alarmTypes = [
        { type: "Door", description: "Door 1 -> 0", value: "Closed", priority: "Info" },
        { type: "Door", description: "Door 0 -> 1", value: "Open", priority: "Warning" },
        { type: "Window", description: "Window 1 -> 0", value: "Closed", priority: "Info" },
        { type: "Window", description: "Window 0 -> 1", value: "Open", priority: "Warning" },
        { type: "Temperature", description: "High temperature detected", value: "36°C", priority: "Critical" },
      ];

      const rooms = [101, 103, 105, 107, 109, 201, 203, 205, 207, 209];
      const mockAlarms = [];
      
      for (let i = 0; i < 50; i++) {
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

    setTimeout(() => {
      const mockAlarms = generateMockAlarms();
      setAlarms(mockAlarms);
      setFilteredAlarms(mockAlarms);
      setLoading(false);
      
      // Load last active filter after data is loaded
      const lastActiveFilter = localStorage.getItem("toccata-last-active-alarms-filter");
      if (lastActiveFilter) {
        try {
          const parsedFilter = JSON.parse(lastActiveFilter);
          setCurrentFilter(parsedFilter);
          
          // Apply the filter if it has data
          if (parsedFilter.data) {
            const filtered = mockAlarms.filter(alarm => {
              const filterData = parsedFilter.data;
              
              // Time range filter
              if (filterData.timeRange?.fromDate && filterData.timeRange?.fromTime) {
                const fromDateTime = new Date(`${filterData.timeRange.fromDate}T${filterData.timeRange.fromTime}`);
                const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
                if (alarmDateTime < fromDateTime) return false;
              }
              
              if (filterData.timeRange?.toDate && filterData.timeRange?.toTime) {
                const toDateTime = new Date(`${filterData.timeRange.toDate}T${filterData.timeRange.toTime}`);
                const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
                if (alarmDateTime > toDateTime) return false;
              }

              // Rooms filter
              if (filterData.rooms?.trim()) {
                const numbers = [];
                const parts = filterData.rooms.split(',');
                
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
                
                if (numbers.length > 0 && !numbers.includes(alarm.room)) {
                  return false;
                }
              }

              // Status and attributes filters
              if (filterData.statuses && filterData.statuses[alarm.status] === 2) return false;
              if (filterData.attributes && filterData.attributes[alarm.type] === 2) return false;

              return true;
            });
            setFilteredAlarms(filtered);
          }
        } catch (error) {
          console.error("Error parsing last active filter:", error);
        }
      }
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

  const handleApplyFilter = (filterData) => {
    if (!alarms || alarms.length === 0) return;
    
    // Apply filtering logic
    const filtered = alarms.filter(alarm => {
      // Time range filter
      if (filterData.timeRange?.fromDate && filterData.timeRange?.fromTime) {
        const fromDateTime = new Date(`${filterData.timeRange.fromDate}T${filterData.timeRange.fromTime}`);
        const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
        if (alarmDateTime < fromDateTime) return false;
      }
      
      if (filterData.timeRange?.toDate && filterData.timeRange?.toTime) {
        const toDateTime = new Date(`${filterData.timeRange.toDate}T${filterData.timeRange.toTime}`);
        const alarmDateTime = new Date(`${alarm.date}T${alarm.time}`);
        if (alarmDateTime > toDateTime) return false;
      }

      // Rooms filter
      if (filterData.rooms?.trim()) {
        const numbers = [];
        const parts = filterData.rooms.split(',');
        
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
        
        if (numbers.length > 0 && !numbers.includes(alarm.room)) {
          return false;
        }
      }

      // Status filter
      if (filterData.statuses && filterData.statuses[alarm.status] === 2) return false; // OFF
      if (filterData.statuses && filterData.statuses[alarm.status] === 1) return true; // ON

      // Attributes filter
      if (filterData.attributes && filterData.attributes[alarm.type] === 2) return false; // OFF
      if (filterData.attributes && filterData.attributes[alarm.type] === 1) return true; // ON

      return true;
    });
    
    setFilteredAlarms(filtered);
    
    if (currentFilter) {
      const updatedFilter = { ...currentFilter, data: filterData };
      setCurrentFilter(updatedFilter);
    }
  };

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
    
    // Apply the selected filter
    if (filter.data && alarms.length > 0) {
      handleApplyFilter(filter.data);
    } else {
      setFilteredAlarms(alarms);
    }
    
    localStorage.setItem("toccata-current-alarm-filter", JSON.stringify(filter));
    localStorage.setItem("toccata-last-active-alarms-filter", JSON.stringify(filter));
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest('.filter-dropdown')) {
        setIsFilterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  if (loading) {
    return (
      <>
        <Navbar />
        <AlarmsSubnav />
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
      <AlarmsSubnav />
      
      <div className="pt-24 px-6">
        <div className="sticky top-24 bg-white z-20 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Alarms Table</h1>
            
            <div className="relative filter-dropdown">
              <button
                onClick={toggleFilterDropdown}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-sm text-gray-700">
                  Selected filter: {currentFilter ? currentFilter.name : "All Alarms"}
                </span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>
              
              {isFilterDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 min-w-[200px]">
                  {savedFilters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => handleFilterSelect(filter)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsFilterOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Alarm Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alarm.room}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-900">{alarm.type}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alarm.priority)}`}>
                          {alarm.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{alarm.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alarm.status)}`}>
                        {alarm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {alarm.status === "Active" && (
                          <>
                            <button className="text-blue-600 hover:text-blue-900">Acknowledge</button>
                            <button className="text-green-600 hover:text-green-900">Resolve</button>
                          </>
                        )}
                        {alarm.status === "Acknowledged" && (
                          <button className="text-green-600 hover:text-green-900">Resolve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AlarmFilter
          isOpen={isFilterOpen}
          onClose={() => {
            setIsFilterOpen(false);
            handleFilterUpdate();
          }}
          onApplyFilter={handleApplyFilter}
          currentFilter={currentFilter}
          onFilterUpdate={handleFilterUpdate}
        />
      </div>
    </>
  );
}