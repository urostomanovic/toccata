"use client";

import { useState } from "react";
import RoomsSubnav from "@/components/RoomsSubnav";
import RoomCardMini from "@/components/RoomCardMini";

export default function RoomsPage() {
  const floors = 10;
  const roomsPerFloor = 20;

  // Koristim useState sa inicijalizatorom da se podaci generišu samo jednom na klijentu
  const [hotel, setHotel] = useState(() => {
    // Generiši 2D niz: svaki red = sprat, sobe = kartice
    // Izbacujem deseti sprat (sobe 1001-1020) jer imaju drugačiji format
    return Array.from({ length: floors - 1 }, (_, floorIndex) =>
      Array.from({ length: roomsPerFloor }, (_, roomIndex) => {
        // Počinjemo od prvog sprata (101-120), ali preskačemo deseti sprat
        let roomNumber;
        if (floorIndex < 9) {
          // Prvi do deveti sprat: 101-120, 201-220, ..., 901-920
          roomNumber = (floorIndex + 1) * 100 + roomIndex + 1;
        } else {
          // Ovaj slučaj se neće desiti jer imamo floors - 1 = 9 sprata
          roomNumber = (floorIndex + 1) * 100 + roomIndex + 1;
        }

        const statusOptions = ["occupied", "vacant", "alarm", "offline"];
        const iconsOptions = ["alarm", "light", "dnd", "wifi"];
        return {
          id: roomNumber,
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
          icons: [
            iconsOptions[Math.floor(Math.random() * iconsOptions.length)],
          ],
        };
      })
    );
  });

  return (
    <>
      {/* RoomsSubnav skroz do glavnog menija - bez praznog prostora */}
      <RoomsSubnav />

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Virtual Hotel Overview</h1>

        {/* Glavni sadržaj sa scroll barovima */}
        <div className="overflow-x-auto overflow-y-auto max-h-[75vh] border rounded shadow-inner">
          <div className="flex flex-col gap-2 min-w-[1300px]">
            {hotel.map((floor, floorIndex) => (
              <div key={floorIndex} className="flex gap-2">
                {floor.map((room) => (
                  <RoomCardMini
                    key={room.id}
                    id={room.id}
                    status={room.status}
                    icons={room.icons}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


