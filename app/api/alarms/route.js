import https from 'https';
import { HotelConfigService } from '@/lib/config';

export async function POST(request) {
  try {
    const config = HotelConfigService.getInstance();
    const apiConfig = config.getApiConfig();
    
    console.log('🔔 Fetching alarms from TOCCATA API...');
    
    // Za sada koristimo mock podatke jer nemamo direktan alarm endpoint
    // Kasnije ćemo implementirati poziv na TOCCATA API kada Ivan doda alarm endpoint
    
    const mockAlarms = generateMockAlarms();
    
    console.log(`✅ Successfully fetched ${mockAlarms.length} alarms`);
    
    return Response.json({
      success: true,
      alarms: mockAlarms,
      message: 'Alarms fetched successfully'
    });
    
  } catch (error) {
    console.error('❌ Error fetching alarms:', error);
    return Response.json({
      success: false,
      error: error.message,
      alarms: []
    }, { status: 500 });
  }
}

// Mock funkcija za generisanje alarm-a (privremeno)
function generateMockAlarms() {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Poslednja nedelja
  
  const alarmTypes = [
    { type: "Door", description: "Door 1 -> 0", value: "Closed", priority: "Info" },
    { type: "Door", description: "Door 0 -> 1", value: "Open", priority: "Warning" },
    { type: "Window", description: "Window 1 -> 0", value: "Closed", priority: "Info" },
    { type: "Window", description: "Window 0 -> 1", value: "Open", priority: "Warning" },
    { type: "DND", description: "DND 0 -> 1", value: "Active", priority: "Info" },
    { type: "DND", description: "DND 1 -> 0", value: "Inactive", priority: "Info" },
    { type: "MUR", description: "MUR 0 -> 1", value: "Requested", priority: "Info" },
    { type: "MUR", description: "MUR 1 -> 0", value: "Completed", priority: "Info" },
    { type: "Temperature", description: "High temperature detected", value: "36°C", priority: "Critical" },
    { type: "Power", description: "Power consumption high", value: "2.5kW", priority: "Warning" },
  ];

  const rooms = [101, 103, 105, 107, 109, 201, 203, 205, 207, 209, 301, 303, 305, 307, 309, 401, 403, 405, 407, 409];
  
  const mockAlarms = [];
  
  for (let i = 0; i < 100; i++) { // Više podataka za nedelju
    const randomTime = new Date(oneWeekAgo.getTime() + Math.random() * (now.getTime() - oneWeekAgo.getTime()));
    const randomAlarm = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    
    mockAlarms.push({
      id: i + 1,
      date: randomTime.toISOString().split('T')[0],
      time: randomTime.toTimeString().split(' ')[0],
      room: randomRoom,
      type: randomAlarm.type,
      description: randomAlarm.description,
      value: randomAlarm.value,
      priority: randomAlarm.priority,
      status: Math.random() > 0.6 ? "Active" : (Math.random() > 0.5 ? "Acknowledged" : "Resolved")
    });
  }
  
  // Sortiraj po datumu i vremenu (najnoviji prvi)
  return mockAlarms.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
}

// TODO: Implementirati real TOCCATA API poziv kada Ivan doda alarm endpoint
// async function fetchAlarmsFromToccata(apiConfig) {
//   return new Promise((resolve, reject) => {
//     const postData = JSON.stringify({
//       username: apiConfig.username,
//       password: apiConfig.password
//     });
//
//     const options = {
//       hostname: apiConfig.host,
//       port: apiConfig.port,
//       path: '/toccata/api/v1/alarm/getAll', // TODO: Ivan treba da doda ovaj endpoint
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': Buffer.byteLength(postData)
//       },
//       rejectUnauthorized: false
//     };
//
//     const req = https.request(options, (res) => {
//       let data = '';
//       res.on('data', (chunk) => data += chunk);
//       res.on('end', () => {
//         try {
//           const alarms = JSON.parse(data);
//           resolve(alarms);
//         } catch (error) {
//           reject(new Error('Invalid JSON response'));
//         }
//       });
//     });
//
//     req.on('error', (error) => reject(error));
//     req.write(postData);
//     req.end();
//   });
// }
