"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function ApiTestPage() {
  const [credentials, setCredentials] = useState({
    username: "admin",
    password: "toccataadmin"
  });
  const [apiUrl, setApiUrl] = useState("https://77.105.34.206:9000/toccata");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Funkcija za pozivanje API-ja
  const callApi = async (endpoint, requestBody = {}) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
                   const response = await fetch(`${apiUrl}${endpoint}`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          ...requestBody
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Test funkcije
  const testGetAllParameters = () => callApi('/api/v1/parameter/getAll');
  const testGetAllRooms = () => callApi('/api/v1/room/getAll');
  const testGetParameterValues = () => callApi('/api/v1/parameter/getAllValues');
  
  // Test sa praznim JSON-om (kako je Ivan predložio)
  const testWithEmptyJson = async (endpoint) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
                   const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    const testRoomsWithEmptyJson = () => testWithEmptyJson('/api/v1/room/getAll');

  // Test server dostupnosti
  const testServerAvailability = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Test i HTTP i HTTPS
    const testUrls = [
      'https://77.105.34.206:9000/toccata/api/v1/room/getAll',
      'http://77.105.34.206:9000/toccata/api/v1/room/getAll'
    ];

    for (let i = 0; i < testUrls.length; i++) {
      try {
        console.log(`Testiranje ${i === 0 ? 'HTTPS' : 'HTTP'}: ${testUrls[i]}`);
        
        const response = await fetch(testUrls[i], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          }),
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults({ 
          message: `Server je dostupan i radi! (${i === 0 ? 'HTTPS' : 'HTTP'})`, 
          status: response.status,
          statusText: response.statusText,
          workingUrl: testUrls[i],
          data: data
        });
        return; // Uspeli smo
      } catch (err) {
        console.error(`${i === 0 ? 'HTTPS' : 'HTTP'} failed:`, err);
        if (i === testUrls.length - 1) {
          setError(`Oba protokola neuspešna. Poslednja greška: ${err.message}`);
        }
      }
    }
    
    setLoading(false);
  };

  // Test GET metode
  const testGetMethod = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${apiUrl}/api/v1/room/getAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults({ message: "GET metoda uspešna!", data: data });
    } catch (err) {
      console.error('GET Error:', err);
      setError(`GET metoda neuspešna: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test proxy servera (Next.js API route)
  const testProxy = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Testiranje proxy servera...');
      
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResults({ 
          message: "Proxy server uspešan! 🎉", 
          data: data.data,
          status: data.status,
          statusText: data.statusText
        });
      } else {
        setError(`Proxy greška: ${data.error} - ${data.details}`);
      }
    } catch (err) {
      console.error('Proxy Error:', err);
      setError(`Proxy test neuspešan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test Next.js API route
  const testNextApi = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Testiranje Next.js API route...');
      
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: 'data',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults({ 
        message: "Next.js API route radi! 🎉", 
        data: data
      });
    } catch (err) {
      console.error('Next.js API Error:', err);
      setError(`Next.js API test neuspešan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test konekcije
  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    // Test različitih URL-ova (samo HTTPS)
    const testUrls = [
      `${apiUrl}/api/v1/room/getAll`,
      `https://77.105.34.206:9000/toccata/api/v1/room/getAll`,
      `https://77.105.34.206:9000/api/v1/room/getAll`
    ];

    for (let i = 0; i < testUrls.length; i++) {
      try {
        console.log(`Testiranje URL ${i + 1}: ${testUrls[i]}`);
        
        const response = await fetch(testUrls[i], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          }),
          // Ignoriši SSL greške za development
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResults({ 
          message: `Konekcija uspešna sa URL ${i + 1}!`, 
          workingUrl: testUrls[i],
          data: data 
        });
        return; // Uspeli smo, izlazimo
      } catch (err) {
        console.error(`URL ${i + 1} failed:`, err);
        if (i === testUrls.length - 1) {
          // Ovo je poslednji URL, prijavljujemo grešku
          setError(`Svi URL-ovi neuspešni. Poslednja greška: ${err.message}`);
        }
      }
    }
    
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="p-6">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">TOCCATA API Test</h1>
          
          {/* Konfiguracija */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">API Konfiguracija</h2>
                         <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
               <p className="text-sm text-blue-800">
                 <strong>Napomena:</strong> Server ima problem sa SSL/CORS. Dodali smo proxy server koji zaobilazi CORS problem.
                 Testiraj "Proxy Test" dugme - to bi trebalo da radi!
               </p>
             </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://localhost:9000/toccata"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Test dugmad */}
          <div className="bg-white p-4 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold mb-4">API Testovi</h2>
            
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-4">
              <button
                onClick={testGetAllParameters}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'Svi Parametri'}
              </button>
              
              <button
                onClick={testGetAllRooms}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'Sve Sobe'}
              </button>
              
              <button
                onClick={testGetParameterValues}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'Vrednosti Parametara'}
              </button>

              <button
                onClick={testRoomsWithEmptyJson}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'Sobe (Prazan JSON)'}
              </button>

              <button
                onClick={testConnection}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'Test Konekcije'}
              </button>

              <button
                onClick={testGetMethod}
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {loading ? 'Učitavanje...' : 'GET Test'}
              </button>

                             <button
                 onClick={testServerAvailability}
                 disabled={loading}
                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
               >
                 {loading ? 'Učitavanje...' : 'Server Test'}
               </button>

               <button
                 onClick={testProxy}
                 disabled={loading}
                 className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
               >
                 {loading ? 'Učitavanje...' : 'Proxy Test'}
               </button>

               <button
                 onClick={testNextApi}
                 disabled={loading}
                 className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
               >
                 {loading ? 'Učitavanje...' : 'Next.js Test'}
               </button>
            </div>
          </div>

          {/* Rezultati */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Greška</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {results && (
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Rezultati</h2>
              <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
