// Backup funkcije za dohvatanje pravih podataka sa TOCCATA API-ja
// Ove funkcije su sačuvane za buduću upotrebu kada se vratimo na prave podatke

// Funkcija za dohvatanje soba sa TOCCATA API-ja
export const fetchRealRoomsData = async () => {
  try {
    const response = await fetch('/api/rooms');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      // Group rooms by floor
      const roomsByFloor = {};
      data.rooms.forEach(room => {
        const floorNumber = parseInt(room.floorName.split('.')[0]);
        if (!roomsByFloor[floorNumber]) {
          roomsByFloor[floorNumber] = [];
        }
        
        // Transform TOCCATA data to our format
        const transformedRoom = {
          id: room.roomName,
          status: room.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
          online: room.online,
          cleanliness: room.cleanliness,
          icons: room.online ? ['wifi'] : ['offline']
        };
        
        roomsByFloor[floorNumber].push(transformedRoom);
      });
      
      // Convert to 2D array format
      const floorsArray = Object.keys(roomsByFloor)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(floorNumber => roomsByFloor[floorNumber]);
      
      return floorsArray;
    } else {
      throw new Error(data.error || 'Failed to fetch rooms');
    }
  } catch (err) {
    console.error('Error fetching rooms:', err);
    throw err;
  }
};

// Funkcija za dohvatanje pojedinačne sobe sa TOCCATA API-ja
export const fetchRealRoomData = async (roomId) => {
  try {
    const response = await fetch(`/api/room/${roomId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.room;
    } else {
      throw new Error(data.error || 'Failed to fetch room');
    }
  } catch (err) {
    console.error('Error fetching room:', err);
    throw err;
  }
};

// Funkcija za dohvatanje rezervacija sa TOCCATA API-ja (ako postoji)
export const fetchRealReservationsData = async () => {
  try {
    // Ova funkcija je placeholder za buduću implementaciju
    // kada TOCCATA API podržava dohvatanje rezervacija
    const response = await fetch('/api/reservations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.reservations;
    } else {
      throw new Error(data.error || 'Failed to fetch reservations');
    }
  } catch (err) {
    console.error('Error fetching reservations:', err);
    throw err;
  }
};

// Funkcija za dohvatanje alarma sa TOCCATA API-ja (ako postoji)
export const fetchRealAlarmsData = async () => {
  try {
    // Ova funkcija je placeholder za buduću implementaciju
    // kada TOCCATA API podržava dohvatanje alarma
    const response = await fetch('/api/alarms');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return data.alarms;
    } else {
      throw new Error(data.error || 'Failed to fetch alarms');
    }
  } catch (err) {
    console.error('Error fetching alarms:', err);
    throw err;
  }
};

// Utility funkcija za transformaciju TOCCATA podataka u naš format
export const transformToccataRoomData = (toccataRoom) => {
  return {
    id: toccataRoom.roomName,
    status: toccataRoom.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
    online: toccataRoom.online,
    cleanliness: toccataRoom.cleanliness,
    icons: toccataRoom.online ? ['wifi'] : ['offline'],
    // Dodaj ostale potrebne polja
    floorName: toccataRoom.floorName,
    roomType: toccataRoom.roomType,
    // ... ostala polja
  };
};

// Utility funkcija za grupisanje soba po spratovima
export const groupRoomsByFloor = (rooms) => {
  const roomsByFloor = {};
  
  rooms.forEach(room => {
    const floorNumber = parseInt(room.floorName.split('.')[0]);
    if (!roomsByFloor[floorNumber]) {
      roomsByFloor[floorNumber] = [];
    }
    
    const transformedRoom = transformToccataRoomData(room);
    roomsByFloor[floorNumber].push(transformedRoom);
  });
  
  // Convert to 2D array format
  return Object.keys(roomsByFloor)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(floorNumber => roomsByFloor[floorNumber]);
};

// Primer korišćenja u komponenti:
/*
import { fetchRealRoomsData, fetchRealRoomData } from '@/lib/realDataBackup';

// U useEffect-u:
useEffect(() => {
  const loadRooms = async () => {
    try {
      setLoading(true);
      const roomsData = await fetchRealRoomsData();
      setHotel(roomsData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  loadRooms();
}, []);
*/
