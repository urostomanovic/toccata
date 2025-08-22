"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";

export default function KeysPage() {
  const router = useRouter();

  useEffect(() => {
    // Proveri localStorage za poslednju aktivnu Keys stranicu
    const lastActiveKeysPage = localStorage.getItem("toccata-last-active-keys-page");
    
    if (lastActiveKeysPage) {
      // Proveri da li postoji sačuvan filter za tu stranicu
      const lastActiveFilter = localStorage.getItem("toccata-last-active-keys-filter");
      
      if (lastActiveFilter && lastActiveKeysPage === "/keys/reservations") {
        // Ako postoji sačuvan filter za reservations, osiguraj da se učita
        try {
          const parsedFilter = JSON.parse(lastActiveFilter);
          // Sačuvaj filter u reservations-specific localStorage
          localStorage.setItem("toccata-current-reservation-filter", lastActiveFilter);
        } catch (error) {
          console.error("Error parsing last active filter:", error);
        }
      }
      
      // Preusmeri na poslednju aktivnu stranicu
      router.replace(lastActiveKeysPage);
    } else {
      // Ako nema sačuvane stranice, preusmeri na Reservations kao default
      router.replace("/keys/reservations");
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Keys Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Preusmeravanje na poslednju aktivnu stranicu...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
