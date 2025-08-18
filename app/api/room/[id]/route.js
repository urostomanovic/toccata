import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request, { params }) {
  try {
    const roomId = params.id;
    console.log('=== ROOM API START ===');
    console.log('Fetching data for room:', roomId);
    
    // Fetch all rooms from TOCCATA API
    const response = await new Promise((resolve, reject) => {
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
          resolve({
            status: res.statusCode,
            data: data
          });
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.write(postData);
      req.end();
    });

    if (response.status !== 200) {
      throw new Error(`TOCCATA API error: ${response.status}`);
    }

    const allRooms = JSON.parse(response.data);
    
    // Find the specific room
    console.log('All rooms count:', allRooms.length);
    console.log('Looking for room:', roomId);
    console.log('Available rooms:', allRooms.map(r => r.roomName).slice(0, 10)); // Show first 10
    
    const room = allRooms.find(r => r.roomName === roomId);
    console.log('Found room:', room);
    
    if (!room) {
      console.log('Room not found!');
      return NextResponse.json({
        success: false,
        error: `Soba ${roomId} nije pronađena`
      }, { status: 404 });
    }
    
    // Transform room data to our format
    const transformedRoom = {
      id: room.roomName,
      floor: room.floorName,
      status: room.availability === 'ASSIGNED' ? 'occupied' : 'vacant',
      online: room.online,
      cleanliness: room.cleanliness,
      bacnetInstance: room.bacnetInstanceNumber,
      bacnetNetwork: room.bacnetNetworkNumber,
      // Mock statuses for now - these will come from different API endpoints
      statuses: {
        temperature: room.online ? '22.5°C' : 'N/A',
        humidity: room.online ? '45%' : 'N/A',
        light: room.online ? 'ON' : 'OFF',
        ac: room.online ? 'COOL' : 'OFF',
        door: room.online ? 'CLOSED' : 'N/A',
        window: room.online ? 'CLOSED' : 'N/A',
        tv: room.online ? 'OFF' : 'N/A',
        wifi: room.online ? 'CONNECTED' : 'OFFLINE'
      }
    };
    
    console.log('Transformed room:', transformedRoom);
    console.log('=== ROOM API END SUCCESS ===');
    
    return NextResponse.json({
      success: true,
      room: transformedRoom
    });

  } catch (error) {
    console.error('Room API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
