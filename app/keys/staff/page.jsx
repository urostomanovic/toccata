"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import KeysSubnav from "@/components/KeysSubnav";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { mockStaffData } from "@/lib/mockData";

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  // STARI KOD - Test podaci za osoblje - slično kao na slici
  // const staffData = [
  //   {
  //     id: 1,
  //     name: "Garnier",
  //     lastname: "Yves",
  //     function: "Maid",
  //     email: "yves.garnier@hotel.com",
  //     phone: "06 12 34 56 78"
  //   },
  //   {
  //     id: 2,
  //     name: "Yves",
  //     lastname: "Garnier", 
  //     function: "Maid",
  //     email: "yves.garnier2@hotel.com",
  //     phone: "06 98 76 54 32"
  //   },
  //   {
  //     id: 3,
  //     name: "John",
  //     lastname: "Smith",
  //     function: "Administrator",
  //     email: "john.smith@hotel.com",
  //     phone: "06 11 22 33 44"
  //   },
  //   {
  //     id: 4,
  //     name: "Maria",
  //     lastname: "Garcia",
  //     function: "Receptionist",
  //     email: "maria.garcia@hotel.com",
  //     phone: "06 55 66 77 88"
  //   },
  //   {
  //     id: 5,
  //     name: "David",
  //     lastname: "Johnson",
  //     function: "Maintenance",
  //     email: "david.johnson@hotel.com",
  //     phone: "06 99 88 77 66"
  //   }
  // ];

  // NOVI KOD - Use mock data from centralized source
  const staffData = mockStaffData;

  // Filtriranje osoblja na osnovu pretrage
  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.phone.includes(searchTerm)
  );

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
  };

  return (
    <>
      <Navbar />
      <KeysSubnav />
      <main className="pt-32 pb-6 px-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">STAFF</h1>
          
          {/* Search bar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
              <PencilIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Staff table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lastname
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Function
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.map((staff, index) => (
                    <tr 
                      key={staff.id}
                      onClick={() => handleStaffSelect(staff)}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedStaff?.id === staff.id 
                          ? 'bg-blue-100' 
                          : index % 2 === 0 
                            ? 'bg-white' 
                            : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {staff.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.lastname}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.function}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {staff.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected staff info */}
          {selectedStaff && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Selected Staff: {selectedStaff.name} {selectedStaff.lastname}
              </h3>
              <p className="text-blue-700">
                Function: {selectedStaff.function} | Email: {selectedStaff.email} | Phone: {selectedStaff.phone}
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

