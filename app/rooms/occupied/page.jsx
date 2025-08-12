"use client";

import RoomCardMini from "@/components/RoomCardMini";
import RoomsSubnav from "@/components/RoomsSubnav";

export default function OccupiedRoomsPage() {
  const floors = 10;
  const roomsPerFloor = 20;

  // Generišemo sve sobe kao pre
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

  // Filtrirano samo zauzete sobe
  const occupiedRooms = allRooms.filter((room) => room.status === "occupied");

  // Grupišemo zauzete sobe po spratovima
  const occupiedRoomsByFloor = occupiedRooms.reduce((acc, room) => {
    const floorNumber = Math.floor(room.id / 100);
    if (!acc[floorNumber]) {
      acc[floorNumber] = [];
    }
    acc[floorNumber].push(room);
    return acc;
  }, {});

  return (
    <>
      <RoomsSubnav />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Occupied Rooms</h1>

        {/* Prikaz po spratovima */}
        {Object.keys(occupiedRoomsByFloor)
          .sort((a, b) => parseInt(a) - parseInt(b)) // Sortiramo od najnižeg ka najvišem spratu
          .map((floorNumber) => (
            <div key={floorNumber} className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                Floor {floorNumber} ({occupiedRoomsByFloor[floorNumber].length} occupied)
              </h2>
                             <div className="flex gap-2 flex-wrap">
                {occupiedRoomsByFloor[floorNumber].map((room) => (
                  <RoomCardMini
                    key={room.id}
                    id={room.id}
                    status={room.status}
                    icons={room.icons}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
