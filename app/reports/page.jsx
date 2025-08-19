"use client";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";

const reportsItems = [
  { label: "Reports Item 1", href: "/reports/reports_item1" },
  { label: "Reports Item 2", href: "/reports/reports_item2" },
  { label: "Reports Item 3", href: "/reports/reports_item3" },
  { label: "Reports Item 4", href: "/reports/reports_item4" },
  { label: "Reports Item 5", href: "/reports/reports_item5" },
];

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <Subnav items={reportsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Reports Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Reports management system - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
