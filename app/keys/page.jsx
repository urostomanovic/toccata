"use client";
import Navbar from "@/components/Navbar";
import Subnav from "@/components/RoomsSubnav";

const keysItems = [
  { label: "Keys Item 1", href: "/keys/keys_item1" },
  { label: "Keys Item 2", href: "/keys/keys_item2" },
  { label: "Keys Item 3", href: "/keys/keys_item3" },
  { label: "Keys Item 4", href: "/keys/keys_item4" },
  { label: "Keys Item 5", href: "/keys/keys_item5" },
];

export default function KeysPage() {
  return (
    <>
      <Navbar />
      <Subnav items={keysItems} />
      <main className="pt-24 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Keys Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Keys management system - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
