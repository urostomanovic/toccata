"use client";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";

export default function AccessPage() {
  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Access Management</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Staff access management - coming soon...
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

