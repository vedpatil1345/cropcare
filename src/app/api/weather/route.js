
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    
    if (!lat || !lon) {
      return Response.json(
        { message: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Open-Meteo API endpoints - no API key required!
    const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,wind_speed_10m_mean,precipitation_probability_mean&timezone=auto&forecast_days=7`;

    // Fetch both current and forecast data
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data from Open-Meteo');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Transform Open-Meteo data to match your frontend format
    const transformedData = {
      current: {
        temp: Math.round(currentData.current.temperature_2m),
        humidity: Math.round(currentData.current.relative_humidity_2m),
        wind_speed: Math.round(currentData.current.wind_speed_10m * 3.6), // Convert m/s to km/h
        weather: [{
          main: getWeatherCondition(currentData.current.weather_code),
          description: getWeatherDescription(currentData.current.weather_code)
        }],
        dt: Math.floor(new Date(currentData.current.time).getTime() / 1000)
      },
      daily: forecastData.daily.time.map((date, index) => ({
        dt: Math.floor(new Date(date).getTime() / 1000),
        temp: {
          min: Math.round(forecastData.daily.temperature_2m_min[index]),
          max: Math.round(forecastData.daily.temperature_2m_max[index])
        },
        weather: [{
          main: getWeatherCondition(forecastData.daily.weather_code[index]),
          description: getWeatherDescription(forecastData.daily.weather_code[index])
        }],
        humidity: Math.round(forecastData.daily.relative_humidity_2m_mean[index]),
        wind_speed: Math.round(forecastData.daily.wind_speed_10m_mean[index] * 3.6), // Convert m/s to km/h
        pop: forecastData.daily.precipitation_probability_mean[index] / 100 // Convert percentage to decimal
      }))
    };

    return Response.json(transformedData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return Response.json(
      { 
        message: 'Error fetching weather data', 
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

// Helper function to convert WMO weather codes to OpenWeather-like conditions
function getWeatherCondition(weatherCode) {
  if (weatherCode === 0) return 'Clear';
  if (weatherCode >= 1 && weatherCode <= 3) return 'Clouds';
  if (weatherCode >= 45 && weatherCode <= 48) return 'Fog';
  if (weatherCode >= 51 && weatherCode <= 67) return 'Rain';
  if (weatherCode >= 71 && weatherCode <= 77) return 'Snow';
  if (weatherCode >= 80 && weatherCode <= 82) return 'Rain';
  if (weatherCode >= 85 && weatherCode <= 86) return 'Snow';
  if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';
  return 'Clouds'; // Default
}

// Helper function to convert WMO weather codes to descriptions
function getWeatherDescription(weatherCode) {
  const descriptions = {
    0: 'clear sky',
    1: 'mainly clear',
    2: 'partly cloudy',
    3: 'overcast',
    45: 'fog',
    48: 'depositing rime fog',
    51: 'light drizzle',
    53: 'moderate drizzle',
    55: 'dense drizzle',
    56: 'light freezing drizzle',
    57: 'dense freezing drizzle',
    61: 'slight rain',
    63: 'moderate rain',
    65: 'heavy rain',
    66: 'light freezing rain',
    67: 'heavy freezing rain',
    71: 'slight snow fall',
    73: 'moderate snow fall',
    75: 'heavy snow fall',
    77: 'snow grains',
    80: 'slight rain showers',
    81: 'moderate rain showers',
    82: 'violent rain showers',
    85: 'slight snow showers',
    86: 'heavy snow showers',
    95: 'thunderstorm',
    96: 'thunderstorm with slight hail',
    99: 'thunderstorm with heavy hail'
  };
  
  return descriptions[weatherCode] || 'unknown';
}