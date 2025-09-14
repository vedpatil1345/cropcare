
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q) {
      return Response.json(
        { message: 'Location query is required' },
        { status: 400 }
      );
    }
    
    // Use Open-Meteo's free geocoding API - no API key needed!
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Open-Meteo Geocoding API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform Open-Meteo response to match OpenWeather format for compatibility
    const transformedData = [];
    
    if (data.results && data.results.length > 0) {
      data.results.forEach(location => {
        transformedData.push({
          name: location.name,
          lat: location.latitude,
          lon: location.longitude,
          country: location.country,
          state: location.admin1 || location.admin2 || undefined, // Use admin1 (state/province) or admin2 as fallback
          local_names: {
            en: location.name
          }
        });
      });
    }
    
    return Response.json(transformedData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.error('Error searching for location:', error);
    return Response.json(
      { 
        message: 'Error searching for location', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}