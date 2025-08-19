import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    // Dohvati sve vrednosti parametara iz TOCCATA sistema
    const values = await getAllParameterValues();
    
    return NextResponse.json({
      success: true,
      values: values,
      count: values.length
    });

  } catch (error) {
    console.error('Parameter Values API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Funkcija za dohvatanje svih vrednosti parametara
async function getAllParameterValues() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin'
    });
    

    
    const options = {
      hostname: '77.105.34.206',
      port: 9000,
      path: '/toccata/api/v1/parameter/getAllValues',
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
          const response = JSON.parse(data);
          
          // Filtriraj vrednosti koje imaju smislenu vrednost
          const filteredValues = response.filter(item => 
            item.value !== undefined && item.value !== null && item.value !== ''
          );
          
          resolve(filteredValues);
        } catch (e) {
          console.error('❌ Parse error:', e.message);
          reject(new Error('Failed to parse parameter values response'));
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('❌ Request error:', err.message);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}
