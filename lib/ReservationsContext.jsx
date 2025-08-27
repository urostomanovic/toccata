"use client";
import { createContext, useContext, useState, useCallback } from 'react';
import { mockReservations as initialReservations } from './mockData';

const ReservationsContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationsProvider');
  }
  return context;
};

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState(initialReservations);
  
  // State za MAP poziciju
  const [mapPosition, setMapPosition] = useState(() => {
    // Pokušaj da učitaj sačuvanu poziciju iz localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toccata-map-position');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (error) {
          console.error('Error parsing saved map position:', error);
        }
      }
    }
    // Default pozicija - današnji datum
    return {
      startDate: new Date().toISOString(),
      selectedRoom: null
    };
  });

  // Dodavanje nove rezervacije
  const addReservation = useCallback((newReservation) => {
    setReservations(prev => [...prev, newReservation]);
  }, []);

  // Brisanje rezervacije
  const deleteReservation = useCallback((reservationId) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== reservationId));
  }, []);

  // Editovanje rezervacije
  const updateReservation = useCallback((reservationId, updatedData) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId 
        ? { ...reservation, ...updatedData }
        : reservation
    ));
  }, []);

  // Provera da li je soba slobodna u određenom periodu
  const isRoomAvailable = useCallback((roomId, checkInDate, checkOutDate, excludeReservationId = null) => {
    return !reservations.some(reservation => {
      // Preskoči rezervaciju koju editujemo
      if (excludeReservationId && reservation.id === excludeReservationId) return false;
      
      // Proveri da li je soba ista
      if (reservation.roomNumber !== roomId) return false;
      
      // Konvertuj postojeće datume u Date objekte
      const existingCheckIn = new Date(reservation.checkIn.split('-').reverse().join('-'));
      const existingCheckOut = new Date(reservation.checkOut.split('-').reverse().join('-'));
      
      // Proveri da li se periodi preklapaju
      return checkInDate < existingCheckOut && checkOutDate > existingCheckIn;
    });
  }, [reservations]);

  // Dobijanje rezervacije za sobu/dan
  const getReservationInfo = useCallback((roomId, date) => {
    return reservations.find(reservation => {
      if (reservation.roomNumber !== roomId) return false;
      
      const checkIn = new Date(reservation.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(reservation.checkOut.split('-').reverse().join('-'));
      
      return date >= checkIn && date < checkOut;
    });
  }, [reservations]);

  // Provera da li postoji rezervacija za sobu/dan
  const hasReservation = useCallback((roomId, date) => {
    return reservations.some(reservation => {
      if (reservation.roomNumber !== roomId) return false;
      
      const checkIn = new Date(reservation.checkIn.split('-').reverse().join('-'));
      const checkOut = new Date(reservation.checkOut.split('-').reverse().join('-'));
      
      return date >= checkIn && date < checkOut;
    });
  }, [reservations]);

  // Funkcija za ažuriranje MAP pozicije
  const updateMapPosition = useCallback((startDate, selectedRoom = null) => {
    const newPosition = {
      startDate: startDate.toISOString(),
      selectedRoom
    };
    setMapPosition(newPosition);
    
    // Sačuvaj u localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('toccata-map-position', JSON.stringify(newPosition));
    }
  }, []);

  const value = {
    reservations,
    addReservation,
    deleteReservation,
    updateReservation,
    isRoomAvailable,
    getReservationInfo,
    hasReservation,
    mapPosition,
    updateMapPosition
  };

  return (
    <ReservationsContext.Provider value={value}>
      {children}
    </ReservationsContext.Provider>
  );
};
