"use client";

import RoomCardMini from "@/components/RoomCardMini";
import RoomsSubnav from "@/components/RoomsSubnav";

export default function OccupiedRoomsPage() {
  const floors = 10;
  const roomsPerFloor = 20;

  const allRooms = Array.from({ length: floors }, (_, floorIndex) =>
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
  ).flat();

  const occupiedRooms = allRooms.filter((room) => room.status === "occupied");

  return (
    <>
      <RoomsSubnav />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Occupied Rooms</h1>

        <div className="grid grid-cols-4 gap-4">
          {occupiedRooms.map((room) => (
            <RoomCardMini
              key={room.id}
              id={room.id}
              status={room.status}
              icons={room.icons}
            />
          ))}
        </div>
      </div>
    </>
  );
}
