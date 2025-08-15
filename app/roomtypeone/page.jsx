"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoomsSubnav from "@/components/RoomsSubnav";

export default function RoomTypeOnePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Uzima ID sobe iz URL parametra, ili default na 101
  const initialRoomId = searchParams.get('id') || '101';
  const [roomId, setRoomId] = useState(initialRoomId);

  const handleGoClick = () => {
    // Navigira na istu stranicu sa novim ID-om sobe
    router.push(`/roomtypeone?id=${roomId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGoClick();
    }
  };

  // Statusi sobe - fiksni za roomtypeone, u produkciji će se čitati sa servera
  const roomStatuses = [
    { id: 'fan1', label: 'Fan1', value: 'OFF', icon: '🌪️' },
    { id: 'roomSetPoint', label: 'Room Set Point', value: '23°C', icon: '🎯' },
    { id: 'roomTemperature', label: 'Room Temperature', value: '26°C', icon: '🌡️' },
    { id: 'window', label: 'Window', value: 'CLOSED', icon: '🪟' },
    { id: 'door', label: 'Door', value: 'CLOSED', icon: '🚪' },
    { id: 'mur', label: 'MUR', value: 'ON', icon: '🛏️' },
    { id: 'dnd', label: 'DND', value: 'ON', icon: '🚫' },
    { id: 'presence', label: 'Presence', value: 'DETECTED', icon: '👤' },
  ];

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
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Statusi sobe {roomId}</h2>
                             <div className="space-y-1">
                                 {roomStatuses.map((status) => (
                   <div 
                     key={status.id} 
                     className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
                   >
                                                                 <span className="text-xl mr-2.5">{status.icon}</span>
                      <div className="text-xs font-medium text-gray-700 flex-1">{status.label}</div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        status.value === 'ON' || status.value === 'DETECTED' 
                          ? 'bg-green-100 text-green-800' 
                          : status.value === 'OFF' || status.value === 'CLOSED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {status.value}
                      </span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Centralni sadržaj - preostala širina */}
            <div className="flex-1">
              <div className="text-center text-gray-500">
                <h2 className="text-xl font-bold mb-4">Centralni deo</h2>
                <p>Slika sobe i grafik temperature će biti dodani u sledećim koracima</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
