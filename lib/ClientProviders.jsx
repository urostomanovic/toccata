"use client";
import { ReservationsProvider } from './ReservationsContext';

export default function ClientProviders({ children }) {
  return (
    <ReservationsProvider>
      {children}
    </ReservationsProvider>
  );
}



