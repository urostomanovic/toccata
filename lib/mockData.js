// Mock podaci za sobe - osnovni format za rooms stranicu
export const mockRooms = [
  "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
  "201", "202", "203", "204", "205", "206", "207", "208", "209", "210",
  "301", "302", "303", "304", "305", "306", "307", "308", "309", "310",
  "401", "402", "403", "404", "405", "406", "407", "408", "409", "410"
];

// STARI KOD - Mock podaci za sobe (osnovni format)
// export const mockRooms = [
//   "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
//   "201", "202", "203", "204", "205", "206", "207", "208", "209", "210",
//   "301", "302", "303", "304", "305", "306", "307", "308", "309", "310",
//   "401", "402", "403", "404", "405", "406", "407", "408", "409", "410"
// ];

// Mock podaci za sobe u formatu za rooms stranicu (2D array po spratovima)
export const mockRoomsByFloor = [
  // Sprat 1
  [
    { id: "101", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "102", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "103", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "104", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "105", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "106", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "107", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "108", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "109", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "110", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 2
  [
    { id: "201", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "202", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "203", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "204", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "205", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "206", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "207", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "208", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "209", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "210", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 3
  [
    { id: "301", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "302", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "303", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "304", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "305", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "306", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "307", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "308", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "309", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "310", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 4
  [
    { id: "401", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "402", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "403", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "404", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "405", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "406", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "407", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "408", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "409", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "410", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 5
  [
    { id: "501", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "502", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "503", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "504", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "505", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "506", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "507", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "508", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "509", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "510", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 6
  [
    { id: "601", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "602", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "603", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "604", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "605", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "606", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "607", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "608", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "609", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "610", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 7
  [
    { id: "701", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "702", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "703", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "704", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "705", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "706", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "707", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "708", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "709", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "710", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ],
  // Sprat 8
  [
    { id: "801", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "802", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "803", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "804", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] },
    { id: "805", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "806", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "807", status: "occupied", online: false, cleanliness: "dirty", icons: ["offline"] },
    { id: "808", status: "vacant", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "809", status: "occupied", online: true, cleanliness: "clean", icons: ["wifi"] },
    { id: "810", status: "vacant", online: true, cleanliness: "to be cleaned", icons: ["wifi"] }
  ]
];

// Mock podaci za detalje soba (za roomtypeone stranicu)
export const mockRoomDetails = {
  "101": {
    online: true,
    status: "occupied",
    cleanliness: "clean",
    floor: "1",
    bacnetInstance: "101",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "22.5",
      "Room Set Point": "23.0",
      "Door": "CLOSED",
      "Window2": "CLOSED",
      "Presence": "ON",
      "DND": "OFF",
      "MUR": "OFF",
      "Fan1": "OFF"
    }
  },
  "102": {
    online: true,
    status: "vacant",
    cleanliness: "clean",
    floor: "1",
    bacnetInstance: "102",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "21.0",
      "Room Set Point": "22.0",
      "Door": "CLOSED",
      "Window2": "CLOSED",
      "Presence": "OFF",
      "DND": "OFF",
      "MUR": "OFF",
      "Fan1": "OFF"
    }
  },
  "103": {
    online: false,
    status: "occupied",
    cleanliness: "dirty",
    floor: "1",
    bacnetInstance: "103",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "OFFLINE",
      "Room Set Point": "OFFLINE",
      "Door": "OFFLINE",
      "Window2": "OFFLINE",
      "Presence": "OFFLINE",
      "DND": "OFFLINE",
      "MUR": "OFFLINE",
      "Fan1": "OFFLINE"
    }
  },
  "201": {
    online: true,
    status: "occupied",
    cleanliness: "clean",
    floor: "2",
    bacnetInstance: "201",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "24.0",
      "Room Set Point": "24.0",
      "Door": "OPEN",
      "Window2": "CLOSED",
      "Presence": "ON",
      "DND": "ON",
      "MUR": "OFF",
      "Fan1": "ON"
    }
  },
  "202": {
    online: true,
    status: "vacant",
    cleanliness: "clean",
    floor: "2",
    bacnetInstance: "202",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "20.5",
      "Room Set Point": "21.0",
      "Door": "CLOSED",
      "Window2": "OPEN",
      "Presence": "OFF",
      "DND": "OFF",
      "MUR": "ON",
      "Fan1": "OFF"
    }
  },
  "301": {
    online: true,
    status: "occupied",
    cleanliness: "clean",
    floor: "3",
    bacnetInstance: "301",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "23.5",
      "Room Set Point": "23.0",
      "Door": "CLOSED",
      "Window2": "CLOSED",
      "Presence": "ON",
      "DND": "OFF",
      "MUR": "OFF",
      "Fan1": "OFF"
    }
  },
  "401": {
    online: true,
    status: "occupied",
    cleanliness: "clean",
    floor: "4",
    bacnetInstance: "401",
    bacnetNetwork: "1",
    statuses: {
      "Room Temperature": "22.0",
      "Room Set Point": "22.5",
      "Door": "CLOSED",
      "Window2": "CLOSED",
      "Presence": "ON",
      "DND": "OFF",
      "MUR": "OFF",
      "Fan1": "ON"
    }
  }
};

// Mock podaci za rezervacije
export const mockReservations = [
  {
    id: 1,
    guestName: "John Smith",
    roomNumber: "101",
    checkIn: "22-08-2025",
    checkOut: "25-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0123",
    email: "john.smith@email.com"
  },
  {
    id: 2,
    guestName: "Maria Garcia",
    roomNumber: "102",
    checkIn: "23-08-2025",
    checkOut: "26-08-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0124",
    email: "maria.garcia@email.com"
  },
  {
    id: 3,
    guestName: "David Johnson",
    roomNumber: "103",
    checkIn: "24-08-2025",
    checkOut: "27-08-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0125",
    email: "david.johnson@email.com"
  },
  {
    id: 4,
    guestName: "Sarah Wilson",
    roomNumber: "201",
    checkIn: "25-08-2025",
    checkOut: "28-08-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Confirmed",
    phone: "+1 555-0126",
    email: "sarah.wilson@email.com"
  },
  {
    id: 5,
    guestName: "Michael Brown",
    roomNumber: "202",
    checkIn: "26-08-2025",
    checkOut: "29-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0127",
    email: "michael.brown@email.com"
  },
  {
    id: 6,
    guestName: "Lisa Davis",
    roomNumber: "203",
    checkIn: "27-08-2025",
    checkOut: "30-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0128",
    email: "lisa.davis@email.com"
  },
  {
    id: 7,
    guestName: "Robert Miller",
    roomNumber: "301",
    checkIn: "28-08-2025",
    checkOut: "31-08-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0129",
    email: "robert.miller@email.com"
  },
  {
    id: 8,
    guestName: "Jennifer Taylor",
    roomNumber: "302",
    checkIn: "29-08-2025",
    checkOut: "01-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0130",
    email: "jennifer.taylor@email.com"
  },
  {
    id: 9,
    guestName: "Alex Thompson",
    roomNumber: "303",
    checkIn: "30-08-2025",
    checkOut: "02-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0131",
    email: "alex.thompson@email.com"
  },
  {
    id: 10,
    guestName: "Emma Wilson",
    roomNumber: "401",
    checkIn: "31-08-2025",
    checkOut: "03-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Pending",
    phone: "+1 555-0132",
    email: "emma.wilson@email.com"
  },
  {
    id: 11,
    guestName: "James Anderson",
    roomNumber: "402",
    checkIn: "01-09-2025",
    checkOut: "04-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0133",
    email: "james.anderson@email.com"
  },
  {
    id: 12,
    guestName: "Sophie Martinez",
    roomNumber: "403",
    checkIn: "02-09-2025",
    checkOut: "05-09-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Confirmed",
    phone: "+1 555-0134",
    email: "sophie.martinez@email.com"
  },
  {
    id: 13,
    guestName: "William Davis",
    roomNumber: "501",
    checkIn: "03-09-2025",
    checkOut: "06-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0135",
    email: "william.davis@email.com"
  },
  {
    id: 26,
    guestName: "Sarah Johnson",
    roomNumber: "107",
    checkIn: "18-08-2025",
    checkOut: "20-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0145",
    email: "sarah.johnson@email.com"
  },
  {
    id: 27,
    guestName: "David Wilson",
    roomNumber: "107",
    checkIn: "20-08-2025",
    checkOut: "25-08-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0146",
    email: "david.wilson@email.com"
  },
  {
    id: 14,
    guestName: "Olivia Johnson",
    roomNumber: "502",
    checkIn: "04-09-2025",
    checkOut: "07-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0136",
    email: "olivia.johnson@email.com"
  },
  {
    id: 15,
    guestName: "Daniel Brown",
    roomNumber: "503",
    checkIn: "05-09-2025",
    checkOut: "08-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0137",
    email: "daniel.brown@email.com"
  },
  {
    id: 16,
    guestName: "Nicole Clark",
    roomNumber: "306",
    checkIn: "09-09-2025",
    checkOut: "12-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0138",
    email: "nicole.clark@email.com"
  },
  {
    id: 17,
    guestName: "Kevin Lewis",
    roomNumber: "307",
    checkIn: "10-09-2025",
    checkOut: "13-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0139",
    email: "kevin.lewis@email.com"
  },
  {
    id: 18,
    guestName: "Rachel Hall",
    roomNumber: "308",
    checkIn: "11-09-2025",
    checkOut: "14-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0140",
    email: "rachel.hall@email.com"
  },
  {
    id: 19,
    guestName: "Steven Young",
    roomNumber: "309",
    checkIn: "12-09-2025",
    checkOut: "15-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0141",
    email: "steven.young@email.com"
  },
  {
    id: 20,
    guestName: "Michelle King",
    roomNumber: "310",
    checkIn: "13-09-2025",
    checkOut: "16-09-2025",
    keyStatus: "Invalidated",
    reservationStatus: "Cancelled",
    phone: "+1 555-0142",
    email: "michelle.king@email.com"
  },
  {
    id: 21,
    guestName: "Thomas Wright",
    roomNumber: "401",
    checkIn: "14-09-2025",
    checkOut: "17-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0143",
    email: "thomas.wright@email.com"
  },
  {
    id: 22,
    guestName: "Amanda Lopez",
    roomNumber: "402",
    checkIn: "15-09-2025",
    checkOut: "18-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0144",
    email: "amanda.lopez@email.com"
  },
  {
    id: 23,
    guestName: "Ryan Hill",
    roomNumber: "403",
    checkIn: "16-09-2025",
    checkOut: "19-09-2025",
    keyStatus: "Lost",
    reservationStatus: "Confirmed",
    phone: "+1 555-0145",
    email: "ryan.hill@email.com"
  },
  {
    id: 24,
    guestName: "Stephanie Scott",
    roomNumber: "404",
    checkIn: "17-09-2025",
    checkOut: "20-09-2025",
    keyStatus: "Active",
    reservationStatus: "Pending",
    phone: "+1 555-0146",
    email: "stephanie.scott@email.com"
  },
  {
    id: 25,
    guestName: "Jason Green",
    roomNumber: "405",
    checkIn: "18-09-2025",
    checkOut: "21-09-2025",
    keyStatus: "Active",
    reservationStatus: "Confirmed",
    phone: "+1 555-0147",
    email: "jason.green@email.com"
  }
];

// Mock podaci za osoblje (staff)
export const mockStaffData = [
  {
    id: 1,
    name: "Garnier",
    lastname: "Yves",
    function: "Maid",
    email: "yves.garnier@hotel.com",
    phone: "06 12 34 56 78"
  },
  {
    id: 2,
    name: "Yves",
    lastname: "Garnier", 
    function: "Maid",
    email: "yves.garnier2@hotel.com",
    phone: "06 98 76 54 32"
  },
  {
    id: 3,
    name: "John",
    lastname: "Smith",
    function: "Administrator",
    email: "john.smith@hotel.com",
    phone: "06 11 22 33 44"
  },
  {
    id: 4,
    name: "Maria",
    lastname: "Garcia",
    function: "Receptionist",
    email: "maria.garcia@hotel.com",
    phone: "06 55 66 77 88"
  },
  {
    id: 5,
    name: "David",
    lastname: "Johnson",
    function: "Maintenance",
    email: "david.johnson@hotel.com",
    phone: "06 99 88 77 66"
  },
  {
    id: 6,
    name: "Sarah",
    lastname: "Wilson",
    function: "Housekeeper",
    email: "sarah.wilson@hotel.com",
    phone: "06 44 33 22 11"
  },
  {
    id: 7,
    name: "Michael",
    lastname: "Brown",
    function: "Security",
    email: "michael.brown@hotel.com",
    phone: "06 77 66 55 44"
  },
  {
    id: 8,
    name: "Lisa",
    lastname: "Davis",
    function: "Concierge",
    email: "lisa.davis@hotel.com",
    phone: "06 33 44 55 66"
  },
  {
    id: 9,
    name: "Robert",
    lastname: "Miller",
    function: "Manager",
    email: "robert.miller@hotel.com",
    phone: "06 88 99 00 11"
  },
  {
    id: 10,
    name: "Jennifer",
    lastname: "Taylor",
    function: "Receptionist",
    email: "jennifer.taylor@hotel.com",
    phone: "06 22 33 44 55"
  }
];
