import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request, { params }) {
  console.log('=== TEST PARAMETERS API START ===');
  
  try {
    const roomId = params.id;
    console.log('Testing parameters for room:', roomId);
    
         // Lista različitih parametara koje možemo testirati (prava imena iz TOCCATA sistema)
     const testParameters = [
       'Room Temperature',
       'Room Set Point',
       'Door',
       'Window',
       'Window2',
       'Presence',
       'DND',
       'MUR',
       'Fan1',
       'AC OFF TIME',
       'Balcony Light On',
       'Balcony Light Off',
       'Balcony on hour',
       'Balcony off hour',
       'Balcony on min',
       'Balcony off min',
       'Room PIR Timer',
       'WATER TEMP',
       'TEMP CORRECTION FCU',
       'Empty room Set Point',
       'SP GUEST LIMITS',
       'SP GUEST DEFAULT',
       'SP Force 1',
       'Salto Operation ID',
       'Modbus '
     ];
    
    const testResults = {};
    const availableParameters = [];
    
    // Testiraj svaki parametar
    for (const param of testParameters) {
      try {
        const result = await testParameter(roomId, param);
        testResults[param] = result;
        
        if (result.success && result.value !== 'N/A') {
          availableParameters.push({
            name: param,
            value: result.value,
            response: result.response
          });
        }
      } catch (error) {
        testResults[param] = {
          success: false,
          error: error.message,
          value: 'N/A'
        };
      }
    }
    
    console.log('=== TEST PARAMETERS API END SUCCESS ===');
    
    return NextResponse.json({
      success: true,
      roomId: roomId,
      availableParameters: availableParameters,
      testResults: testResults,
      totalTested: testParameters.length,
      availableCount: availableParameters.length
    });

  } catch (error) {
    console.error('Test Parameters API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Funkcija za testiranje pojedinačnog parametra
async function testParameter(roomId, parameterName) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin',
      parameterName: parameterName,
      roomName: roomId
    });
    
    console.log(`🧪 Testing parameter: ${parameterName}`);
    
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
        try {
          const response = JSON.parse(data);
          
          if (response.value !== undefined && response.value !== null) {
            resolve({
              success: true,
              value: response.value,
              response: response
            });
          } else {
            resolve({
              success: false,
              value: 'N/A',
              response: response
            });
          }
        } catch (e) {
          resolve({
            success: false,
            value: 'N/A',
            error: 'Parse error',
            rawResponse: data
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        value: 'N/A',
        error: err.message
      });
    });
    
    req.write(postData);
    req.end();
  });
}
