"use client";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";

const alarmsItems = [
  { label: "Alarms Item 1", href: "/alarms/alarms_item1" },
  { label: "Alarms Item 2", href: "/alarms/alarms_item2" },
  { label: "Alarms Item 3", href: "/alarms/alarms_item3" },
  { label: "Alarms Item 4", href: "/alarms/alarms_item4" },
  { label: "Alarms Item 5", href: "/alarms/alarms_item5" },
];

export default function AlarmsPage() {
  return (
    <>
      <Navbar />
      <Subnav items={alarmsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Alarms Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Alarms management system - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
