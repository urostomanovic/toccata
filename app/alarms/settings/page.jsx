"use client";

import Navbar from "@/components/Navbar";
import AlarmsSubnav from "@/components/AlarmsSubnav";

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <AlarmsSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Alarms Settings</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Alarms Settings page - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}


