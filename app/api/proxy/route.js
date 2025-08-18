import { NextResponse } from 'next/server';
import https from 'https';

export async function POST(request) {
  console.log('=== PROXY START ===');
  try {
    const body = await request.json();
    console.log('Proxy received request:', body);
    
    // TOCCATA API endpoint
    const apiUrl = 'https://77.105.34.206:9000/toccata/api/v1/room/getAll';
    console.log('Calling TOCCATA API:', apiUrl);
    
    const requestBody = {
      username: body.username || 'admin',
      password: body.password || 'toccataadmin',
      ...body
    };
    console.log('Request body:', requestBody);
    
    // Forward the request to TOCCATA API using https module with SSL ignore
    const response = await new Promise((resolve, reject) => {
      const postData = JSON.stringify(requestBody);
      
      const options = {
        hostname: '77.105.34.206',
        port: 9000,
        path: '/toccata/api/v1/room/getAll',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        // Ignoriši SSL sertifikat
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
            statusText: res.statusMessage,
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

    console.log('TOCCATA response status:', response.status);
    console.log('TOCCATA response statusText:', response.statusText);
    console.log('TOCCATA response data:', response.data);

    if (response.status !== 200) {
      throw new Error(`TOCCATA server error: ${response.status} ${response.statusText} - ${response.data}`);
    }

    let data;
    try {
      data = JSON.parse(response.data);
      console.log('TOCCATA success response:', data);
    } catch (e) {
      console.log('TOCCATA response is not JSON:', response.data);
      data = { rawResponse: response.data };
    }
    
    return NextResponse.json({
      success: true,
      data: data,
      status: response.status,
      statusText: response.statusText
    });

  } catch (error) {
    console.error('Proxy error:', error);
    console.log('=== PROXY END WITH ERROR ===');
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Greška na TOCCATA serveru - proxy je uspešno povezan'
    }, { status: 500 });
  }
  console.log('=== PROXY END SUCCESS ===');
}
