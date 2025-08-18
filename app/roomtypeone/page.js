"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoomsSubnav from "@/components/RoomsSubnav";

export default function RoomTypeOnePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Uzima ID sobe iz URL parametra, ili default na 101
  const initialRoomId = searchParams.get('id') || '101';
  console.log('=== ROOMTYPEONE COMPONENT START ===');
  console.log('searchParams:', searchParams);
  console.log('initialRoomId:', initialRoomId);
  
  const [roomId, setRoomId] = useState(initialRoomId);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  console.log('Current roomId state:', roomId);

  // Fetch room data when roomId changes
  useEffect(() => {
    console.log('=== ROOMTYPEONE useEffect ===');
    console.log('roomId changed to:', roomId);
    
    const fetchRoomData = async () => {
      try {
        console.log('Starting to fetch room data for:', roomId);
        setLoading(true);
        setError(null);
        
        const apiUrl = `/api/room/${roomId}`;
        console.log('Calling API:', apiUrl);
        
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          console.log('Setting room data:', data.room);
          setRoomData(data.room);
        } else {
          throw new Error(data.error || 'Failed to fetch room data');
        }
      } catch (err) {
        console.error('Error fetching room data:', err);
        setError(err.message);
        setRoomData(null);
      } finally {
        setLoading(false);
        console.log('Fetch completed');
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleGoClick = () => {
    // Navigira na istu stranicu sa novim ID-om sobe
    router.push(`/roomtypeone?id=${roomId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGoClick();
    }
  };

  // Transform room data to status format
  const getRoomStatuses = () => {
    if (!roomData) return [];
    
    return [
      { id: 'temperature', label: 'Temperature', value: roomData.statuses.temperature, icon: '🌡️' },
      { id: 'humidity', label: 'Humidity', value: roomData.statuses.humidity, icon: '💧' },
      { id: 'light', label: 'Light', value: roomData.statuses.light, icon: '💡' },
      { id: 'ac', label: 'AC', value: roomData.statuses.ac, icon: '❄️' },
      { id: 'door', label: 'Door', value: roomData.statuses.door, icon: '🚪' },
      { id: 'window', label: 'Window', value: roomData.statuses.window, icon: '🪟' },
      { id: 'tv', label: 'TV', value: roomData.statuses.tv, icon: '📺' },
      { id: 'wifi', label: 'WiFi', value: roomData.statuses.wifi, icon: '📶' },
    ];
  };

  return (
    <>
      <Navbar />
      <RoomsSubnav />
      <main className="p-6">
        <div className="p-4">
          {/* Gornji levi ugao - broj sobe i Go dugme */}
          <div className="flex justify-start mb-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Broj sobe"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGoClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Go
              </button>
            </div>
          </div>

          {/* Statusi sobe - leva kolona */}
          <div className="flex gap-6">
            <div className="w-1/5 max-w-xs">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">
                Statusi sobe {roomId}
                {roomData && (
                  <span className={`ml-2 text-sm px-2 py-1 rounded-full ${
                    roomData.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {roomData.online ? 'ONLINE' : 'OFFLINE'}
                  </span>
                )}
              </h2>
              
              {loading && (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-600">Učitavanje...</div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {!loading && !error && roomData && (
                <div className="space-y-1">
                  {getRoomStatuses().map((status) => (
                    <div 
                      key={status.id} 
                      className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
                    >
                      <span className="text-xl mr-2.5">{status.icon}</span>
                      <div className="text-xs font-medium text-gray-700 flex-1">{status.label}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status.value === 'ON' || status.value === 'CONNECTED' || status.value === 'COOL'
                          ? 'bg-green-100 text-green-800' 
                          : status.value === 'OFF' || status.value === 'CLOSED' || status.value === 'OFFLINE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Centralni sadržaj - preostala širina */}
            <div className="flex-1">
              {!loading && !error && roomData && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Detalji sobe {roomId}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">Osnovne informacije</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Sprat:</span> {roomData.floor}</div>
                        <div><span className="font-medium">Status:</span> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            roomData.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {roomData.status === 'occupied' ? 'ZAUZETA' : 'SLOBODNA'}
                          </span>
                        </div>
                        <div><span className="font-medium">Čistoća:</span> {roomData.cleanliness}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">BACnet informacije</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Instance:</span> {roomData.bacnetInstance}</div>
                        <div><span className="font-medium">Network:</span> {roomData.bacnetNetwork}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-gray-500">
                    <p>Slika sobe i grafik temperature će biti dodani u sledećim koracima</p>
                  </div>
                </div>
              )}
              
              {!loading && !error && !roomData && (
                <div className="text-center text-gray-500">
                  <h2 className="text-xl font-bold mb-4">Centralni deo</h2>
                  <p>Slika sobe i grafik temperature će biti dodani u sledećim koracima</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
