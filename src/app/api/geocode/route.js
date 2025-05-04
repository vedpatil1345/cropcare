// pages/api/geocode.js
export default async function GET(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Location query is required' });
    }
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`OpenWeather Geocoding API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error searching for location:', error);
    res.status(500).json({ message: 'Error searching for location', error: error.message });
  }
}