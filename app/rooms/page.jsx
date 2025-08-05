"use client";

import RoomsSubnav from "@/components/RoomsSubnav";
import RoomCardMini from "@/components/RoomCardMini";

export default function RoomsPage() {
  const floors = 10;
  const roomsPerFloor = 20;

  // Generiši 2D niz: svaki red = sprat, sobe = kartice
  const hotel = Array.from({ length: floors }, (_, floorIndex) =>
    Array.from({ length: roomsPerFloor }, (_, roomIndex) => {
      const roomNumber = (floorIndex + 1) * 100 + roomIndex + 1;
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

  return (
    <>
      <RoomsSubnav />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Virtual Hotel Overview</h1>

        <div className="overflow-auto max-h-[75vh] border rounded shadow-inner">
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


