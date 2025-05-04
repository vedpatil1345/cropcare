// pages/api/weather.js
export default async function GET(req, res) {
  // Set CORS headers to allow requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check for GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Make sure API key exists
    if (!API_KEY) {
      console.error('Missing OpenWeather API key');
      return res.status(500).json({ message: 'Server configuration error - missing API key' });
    }

    // Using the free tier weather API endpoint instead of One Call 3.0
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenWeather API error response:', errorText);
      throw new Error(`OpenWeather API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ message: 'Error fetching weather data', error: error.message });
  }
}