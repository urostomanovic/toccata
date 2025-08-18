import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== TEST API ROUTE CALLED ===');
  return NextResponse.json({ 
    message: 'Test API route radi!', 
    timestamp: new Date().toISOString() 
  });
}

export async function POST(request) {
  console.log('=== TEST API ROUTE POST CALLED ===');
  try {
    const body = await request.json();
    console.log('Test API received:', body);
    
    return NextResponse.json({ 
      message: 'Test API POST radi!', 
      received: body,
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
