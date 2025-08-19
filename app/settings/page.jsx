"use client";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";

const settingsItems = [
  { label: "Settings Item 1", href: "/settings/settings_item1" },
  { label: "Settings Item 2", href: "/settings/settings_item2" },
  { label: "Settings Item 3", href: "/settings/settings_item3" },
  { label: "Settings Item 4", href: "/settings/settings_item4" },
  { label: "Settings Item 5", href: "/settings/settings_item5" },
];

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <Subnav items={settingsItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Settings Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Settings management system - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
