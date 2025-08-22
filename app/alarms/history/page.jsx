"use client";

import Navbar from "@/components/Navbar";
import AlarmsSubnav from "@/components/AlarmsSubnav";

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <AlarmsSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Alarms History</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Alarms History page - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

