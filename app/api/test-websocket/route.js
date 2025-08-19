import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    const testResults = await testWebSocketEndpoints();
    
    return NextResponse.json({
      success: true,
      connectionStatus: testResults.connectionStatus,
      serverInfo: testResults.serverInfo,
      testResults: testResults.details
    });

  } catch (error) {
    console.error('WebSocket Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Funkcija za testiranje WebSocket endpoint-a
async function testWebSocketEndpoints() {
  const testEndpoints = [
    {
      name: 'HTTPS WebSocket',
      url: 'wss://77.105.34.206:9000',
      description: 'WebSocket preko HTTPS'
    },
    {
      name: 'HTTP WebSocket', 
      url: 'ws://77.105.34.206:9000',
      description: 'WebSocket preko HTTP'
    },
    {
      name: 'TOCCATA WebSocket',
      url: 'wss://77.105.34.206:9000/toccata/ws',
      description: 'TOCCATA WebSocket endpoint'
    },
    {
      name: 'TOCCATA HTTP WebSocket',
      url: 'ws://77.105.34.206:9000/toccata/ws',
      description: 'TOCCATA WebSocket preko HTTP'
    }
  ];

  const results = {
    connectionStatus: 'UNKNOWN',
    serverInfo: {
      host: '77.105.34.206',
      port: 9000,
      supportsWebSocket: false
    },
    details: {}
  };

  // Testiraj svaki endpoint
  for (const endpoint of testEndpoints) {
    try {
      const testResult = await testSingleWebSocketEndpoint(endpoint);
      results.details[endpoint.name] = testResult;
      
      if (testResult.success) {
        results.connectionStatus = 'SUCCESS';
        results.serverInfo.supportsWebSocket = true;
        break; // Ako jedan radi, ne moramo testirati ostale
      }
      
    } catch (error) {
      results.details[endpoint.name] = {
        success: false,
        error: error.message,
        description: endpoint.description
      };
    }
  }

  // Ako nijedan WebSocket ne radi, testiraj HTTP upgrade
  if (results.connectionStatus === 'UNKNOWN') {
    const upgradeTest = await testHttpUpgrade();
    results.details['HTTP Upgrade Test'] = upgradeTest;
    
    if (upgradeTest.success) {
      results.connectionStatus = 'UPGRADE_SUPPORTED';
      results.serverInfo.supportsWebSocket = true;
    } else {
      results.connectionStatus = 'NOT_SUPPORTED';
    }
  }

  return results;
}

// Funkcija za testiranje pojedinačnog WebSocket endpoint-a
async function testSingleWebSocketEndpoint(endpoint) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        success: false,
        error: 'Connection timeout',
        description: endpoint.description
      });
    }, 5000); // 5 sekundi timeout

    try {
      // Pokušaj da otvoriš WebSocket konekciju
      const ws = new WebSocket(endpoint.url);
      
      ws.onopen = () => {
        clearTimeout(timeout);
        
        // Pošalji test poruku
        ws.send(JSON.stringify({
          type: 'test',
          message: 'Hello TOCCATA Server!',
          timestamp: new Date().toISOString()
        }));
        
        // Zatvori konekciju nakon testa
        setTimeout(() => {
          ws.close();
        }, 1000);
        
        resolve({
          success: true,
          message: 'WebSocket konekcija uspešna',
          description: endpoint.description
        });
      };
      
      ws.onmessage = (event) => {
        // Tihi log za debugging ako je potreban
      };
      
      ws.onerror = (error) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          error: 'WebSocket connection failed',
          description: endpoint.description
        });
      };
      
      ws.onclose = (event) => {
        clearTimeout(timeout);
      };
      
    } catch (error) {
      clearTimeout(timeout);
      resolve({
        success: false,
        error: error.message,
        description: endpoint.description
      });
    }
  });
}

// Funkcija za testiranje HTTP upgrade za WebSocket
async function testHttpUpgrade() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      username: 'admin',
      password: 'toccataadmin'
    });
    
    const options = {
      hostname: '77.105.34.206',
      port: 9000,
      path: '/toccata/api/v1/room/getAll',
      method: 'GET',
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
        'Sec-WebSocket-Version': '13'
      },
      rejectUnauthorized: false
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 101) {
        resolve({
          success: true,
          message: 'Server podržava WebSocket upgrade',
          statusCode: res.statusCode,
          headers: res.headers
        });
      } else {
        resolve({
          success: false,
          error: `Server ne podržava WebSocket upgrade (status: ${res.statusCode})`,
          statusCode: res.statusCode,
          headers: res.headers
        });
      }
    });
    
    req.on('error', (err) => {
      resolve({
        success: false,
        error: err.message
      });
    });
    
    req.end();
  });
}
