import { NextResponse } from 'next/server';
import { getConfig, getFloors, getAllRooms, getRoomTypes, getParameters, getApiConfig } from '@/lib/config';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Ako je specificiran tip, vrati samo taj deo konfiguracije
    switch (type) {
      case 'floors':
        return NextResponse.json({
          success: true,
          floors: getFloors()
        });

      case 'rooms':
        return NextResponse.json({
          success: true,
          rooms: getAllRooms()
        });

      case 'roomTypes':
        return NextResponse.json({
          success: true,
          roomTypes: getRoomTypes()
        });

      case 'parameters':
        return NextResponse.json({
          success: true,
          parameters: getParameters()
        });

      case 'api':
        return NextResponse.json({
          success: true,
          api: getApiConfig()
        });

      default:
        // Vrati celu konfiguraciju
        return NextResponse.json({
          success: true,
          config: getConfig()
        });
    }

  } catch (error) {
    console.error('Config API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
