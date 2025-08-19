import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request, { params }) {
  const startTime = Date.now();
  
  try {
    const roomId = params.id;
    
         // Lista parametara koje želimo da dohvatimo za sobu (prava imena iz TOCCATA sistema)
     const parameters = [
       'Room Temperature',
       'Room Set Point',
       'Door',
       'Window2',
       'Presence',
       'DND',
       'MUR',
       'Fan1'
     ];
    
    // Dohvati osnovne informacije o sobi (jednom pozivom)
    const roomInfo = await getRoomInfo(roomId);
    
    // Dohvati vrednosti parametara (paralelno)
    const parameterValues = await Promise.all(
      parameters.map(param => getParameterValue(roomId, param))
    );
    
    // Kombinuj podatke
    const statuses = {};
    parameters.forEach((param, index) => {
      statuses[param] = parameterValues[index] || 'N/A';
    });
    
    const transformedRoom = {
      id: roomId,
      floor: roomInfo.floorName || 'N/A',
      status: roomInfo.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
      online: roomInfo.online || false,
      cleanliness: roomInfo.cleanliness || 'N/A',
      bacnetInstance: roomInfo.bacnetInstanceNumber || 'N/A',
      bacnetNetwork: roomInfo.bacnetNetworkNumber || 'N/A',
      statuses: statuses
    };
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      room: transformedRoom,
      apiCalls: parameters.length + 1, // +1 za room info
      responseTime: `${responseTime}ms`
    });

  } catch (error) {
    console.error('Efficient Room API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Funkcija za dohvatanje osnovnih informacija o sobi
async function getRoomInfo(roomId) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin'
    });
    
    const options = {
      hostname: '77.105.34.206',
      port: 9000,
      path: '/toccata/api/v1/room/getAll',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const rooms = JSON.parse(data);
          const room = rooms.find(r => r.roomName === roomId);
          resolve(room || {});
        } catch (e) {
          reject(new Error('Failed to parse room info'));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// Funkcija za dohvatanje vrednosti parametra
async function getParameterValue(roomId, parameterName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin',
      parameterName: parameterName,
      roomName: roomId
    });
    
    console.log(`🔍 Fetching parameter ${parameterName} for room ${roomId}`);
    console.log(`📤 Request body:`, postData);
    
    const options = {
      hostname: '77.105.34.206',
      port: 9000,
      path: '/toccata/api/v1/parameter/getValue',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      rejectUnauthorized: false
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`📥 Response for ${parameterName}: Status ${res.statusCode}`);
        console.log(`📥 Response data:`, data);
        
        try {
          const response = JSON.parse(data);
          console.log(`✅ Parsed response for ${parameterName}:`, response);
          
          // Transformuj vrednost u čitljiv format
          const value = transformParameterValue(parameterName, response.value);
          console.log(`🎯 Final value for ${parameterName}:`, value);
          resolve(value);
        } catch (e) {
          console.log(`❌ Parameter ${parameterName} not available for room ${roomId}`);
          console.log(`❌ Parse error:`, e.message);
          resolve('N/A');
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Error fetching parameter ${parameterName}:`, err.message);
      resolve('N/A');
    });
    
    req.write(postData);
    req.end();
  });
}

   // Funkcija za transformaciju vrednosti parametara
  function transformParameterValue(parameterName, value) {
    if (!value) return 'N/A';
    
    switch (parameterName) {
      case 'Room Temperature':
        // Temperatura se čuva kao 274 = 27.4°C
        const tempCelsius = (parseFloat(value) / 10).toFixed(1);
        return `${tempCelsius}°C`;
      case 'Room Set Point':
        // Set point se čuva kao 230 = 23.0°C
        const setPointCelsius = (parseFloat(value) / 10).toFixed(1);
        return `${setPointCelsius}°C`;
      case 'Door':
        return value === '1' || value === 'true' ? 'OPEN' : 'CLOSED';
      case 'Window2':
        return value === '1' || value === 'true' ? 'OPEN' : 'CLOSED';
      case 'Presence':
        return value === '1' || value === 'true' ? 'PRESENT' : 'ABSENT';
      case 'DND':
        return value === '1' || value === 'true' ? 'ON' : 'OFF';
      case 'MUR':
        return value === '1' || value === 'true' ? 'REQUESTED' : 'OK';
      case 'Fan1':
        return value === '1' || value === 'true' ? 'ON' : 'OFF';
      default:
        return value;
    }
  }
