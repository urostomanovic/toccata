import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    // Dohvati sve parametre iz TOCCATA sistema
    const parameters = await getAllParameters();
    
    return NextResponse.json({
      success: true,
      parameters: parameters,
      count: parameters.length
    });

  } catch (error) {
    console.error('System Parameters API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Funkcija za dohvatanje svih parametara
async function getAllParameters() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin'
    });
    

    
    const options = {
      hostname: '77.105.34.206',
      port: 9000,
      path: '/toccata/api/v1/parameter/getAll',
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
           
           // Filtriraj parametre koji imaju tag (opis)
           const filteredParameters = response.filter(param => 
             param.tag && param.tag.trim() !== ''
           );
           
           // Ako nema parametara sa tag-ovima, vrati sve parametre
           if (filteredParameters.length === 0) {
             resolve(response);
           } else {
             // Sortiraj po tag-u za lakše čitanje
             const sortedParameters = filteredParameters.sort((a, b) => 
               (a.tag || '').localeCompare(b.tag || '')
             );
             resolve(sortedParameters);
           }
        } catch (e) {
          console.error('❌ Parse error:', e.message);
          reject(new Error('Failed to parse parameters response'));
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
