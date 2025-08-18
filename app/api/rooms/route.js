import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    // Fetch rooms from TOCCATA API
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

    const rooms = JSON.parse(response.data);
    
    return NextResponse.json({
      success: true,
      rooms: rooms
    });

  } catch (error) {
    console.error('Rooms API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
