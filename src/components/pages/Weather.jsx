'use client'
import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, ChevronDown, ChevronUp, AlertTriangle, MapPin, Loader, Search } from 'lucide-react';

// Default data for initial load and fallback
const defaultWeatherData = {
  current: {
    temp: 24,
    humidity: 65,
    wind_speed: 12,
    weather: [{ main: 'Clouds', description: 'scattered clouds' }],
    dt: new Date().getTime() / 1000
  },
  daily: Array(7).fill(null).map((_, i) => ({
    dt: new Date().getTime() / 1000 + 86400 * i,
    temp: { min: 18, max: 26 },
    weather: [{ main: 'Clouds', description: 'scattered clouds' }],
    humidity: 65,
    wind_speed: 10,
    pop: 0.1
  }))
};

const defaultFarmingAdvice = {
  summary: "Loading agricultural insights based on weather forecast...",
  recommendations: [],
  alerts: []
};

// Weather icon mapping
const getWeatherIcon = (condition) => {
  switch (condition) {
    case 'Clear':
      return <Sun size={24} className="text-yellow-500" />;
    case 'Clouds':
      return <Cloud size={24} className="text-gray-500" />;
    case 'Rain':
    case 'Drizzle':
      return <CloudRain size={24} className="text-blue-500" />;
    case 'Thunderstorm':
      return <CloudRain size={24} className="text-purple-500" />;
    case 'Snow':
      return <Cloud size={24} className="text-blue-200" />;
    default:
      return <Cloud size={24} className="text-gray-500" />;
  }
};

// Format timestamp to day name
const formatDay = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Priority badge component
const PriorityBadge = ({ priority }) => {
  const getColor = () => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getColor()}`}>
      {priority}
    </span>
  );
};

export default function Weather() {
  const [expandedSection, setExpandedSection] = useState('all');
  const [weatherData, setWeatherData] = useState(defaultWeatherData);
  const [farmingAdvice, setFarmingAdvice] = useState(defaultFarmingAdvice);
  const [location, setLocation] = useState({ lat: 40.7128, lon: -74.0060, name: 'New York' }); // Default location
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Location search state
  const [locationInput, setLocationInput] = useState('');
  
  // Load default weather data on mount
  useEffect(() => {
    if (location) {
      loadWeatherData(location.lat, location.lon);
    }
  }, []);
  
  // Fetch weather data using our API endpoint
  const loadWeatherData = async (lat, lon) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call our API endpoint
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`,{method: 'GET'});
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch weather data' }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the JSON with better error handling
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing weather response:', parseError);
        console.log('Raw response:', text);
        throw new Error('Failed to parse weather data. Please try again.');
      }
      
      // Verify the data structure
      if (!data || !data.current || !data.daily) {
        throw new Error('Invalid weather data format');
      }
      
      setWeatherData(data);
      
      // Generate farming advice based on weather data
      await fetchFarmingAdvice(data);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(`Failed to fetch weather data: ${err.message}`);
      setWeatherData(defaultWeatherData);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch farming advice from API
  const fetchFarmingAdvice = async (weatherData) => {
    try {
      const response = await fetch('/api/farming-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weatherData,
          location: location.name
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate farming advice' }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      // Parse the JSON with better error handling
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing farming advice response:', parseError);
        console.log('Raw response:', text);
        throw new Error('Failed to parse farming advice data');
      }
      
      setFarmingAdvice(data);
    } catch (err) {
      console.error('Error fetching farming advice:', err);
      setError(`Failed to generate farming recommendations: ${err.message}`);
      // Use default farming advice instead of showing nothing
      setFarmingAdvice(defaultFarmingAdvice);
    }
  };
  
  // Search for location using geocoding API
  const searchLocation = async (e) => {
    e.preventDefault();
    
    if (!locationInput.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(locationInput)}`, { method: 'GET' });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to search for location' }));
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      const results = await response.json();
      
      if (!results || results.length === 0) {
        setError('No locations found matching your search. Please try a different query.');
        setIsLoading(false);
        return;
      }
      
      // Use the first result
      const firstResult = results[0];
      
      // Update location
      const newLocation = {
        lat: firstResult.lat,
        lon: firstResult.lon,
        name: firstResult.name + (firstResult.state ? `, ${firstResult.state}` : '') + (firstResult.country ? `, ${firstResult.country}` : '')
      };
      
      setLocation(newLocation);
      
      // Load weather data for the new location
      await loadWeatherData(newLocation.lat, newLocation.lon);
      
    } catch (err) {
      console.error('Error searching for location:', err);
      setError(`Failed to search for location: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection('all');
    } else {
      setExpandedSection(section);
    }
  };
  
  const styles = {
    primary: "#6faa61",
    primaryHover: "#0d6a4a",
    secondary: "#20B297",
  };

  return (
    <div className="max-w-4xl mx-auto p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <Loader size={48} className="animate-spin mx-auto mb-4" style={{ color: styles.primary }} />
            <p className="text-lg font-medium">Loading weather forecast...</p>
          </div>
        </div>
      )}
      
      <header className="mb-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-4" style={{ color: styles.primary }}>Farm Weather Assistant</h1>
          
          {/* Location Search Form */}
          <form onSubmit={searchLocation} className="w-full mb-4">
            <div className="flex">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter city name (e.g., Paris, Tokyo, Cairo)"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-r-md text-white flex items-center justify-center"
                style={{ backgroundColor: styles.primary }}
                disabled={isLoading || !locationInput.trim()}
              >
                <Search size={20} />
              </button>
            </div>
          </form>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <AlertTriangle size={24} className="text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Current Location Display */}
          <div className="flex items-center text-gray-600 mt-2">
            <MapPin size={18} className="mr-1" />
            <p className="font-medium">{location.name}</p>
          </div>
        </div>
      </header>
      
      {/* Current Weather */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderTop: `4px solid ${styles.primary}` }}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-1">Current Conditions</h2>
            <p className="text-gray-500">Today, {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex items-center">
            {getWeatherIcon(weatherData.current.weather[0].main)}
            <span className="text-4xl font-bold ml-2">{Math.round(weatherData.current.temp)}°C</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Droplets size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weatherData.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center">
            <Wind size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-medium">{weatherData.current.wind_speed} km/h</p>
            </div>
          </div>
          <div className="flex items-center">
            <CloudRain size={20} className="text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="font-medium">{weatherData.current.weather[0].description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Forecast */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">7-Day Forecast</h2>
          <button 
            onClick={() => toggleSection('forecast')}
            className="flex items-center text-sm font-medium"
            style={{ color: styles.primary }}
          >
            {expandedSection !== 'forecast' ? 'Show details' : 'Hide details'}
            {expandedSection !== 'forecast' ? <ChevronDown size={16} className="ml-1" /> : <ChevronUp size={16} className="ml-1" />}
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {weatherData.daily.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium">{formatDay(day.dt)}</p>
              <div className="my-2">
                {getWeatherIcon(day.weather[0].main)}
              </div>
              <div className="flex justify-center items-center space-x-1 text-sm">
                <span className="text-red-500 font-medium">{Math.round(day.temp.max)}°</span>
                <span className="text-gray-400">/</span>
                <span className="text-blue-500 font-medium">{Math.round(day.temp.min)}°</span>
              </div>
              {expandedSection === 'forecast' && (
                <div className="mt-2 text-xs">
                  <p className="text-gray-500">{day.weather[0].description}</p>
                  <p className="mt-1">
                    <span className="inline-flex items-center text-blue-500">
                      <Droplets size={12} className="mr-1" />{day.humidity}%
                    </span>
                  </p>
                  <p className="mt-1">
                    <span className="inline-flex items-center text-blue-500">
                      <CloudRain size={12} className="mr-1" />{Math.round(day.pop * 100)}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Farm Advice Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6" style={{ borderLeft: `4px solid ${styles.secondary}` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Farming Insights</h2>
          <button 
            onClick={() => toggleSection('insights')}
            className="flex items-center text-sm font-medium"
            style={{ color: styles.primary }}
          >
            {expandedSection !== 'insights' ? 'Show details' : 'Hide details'}
            {expandedSection !== 'insights' ? <ChevronDown size={16} className="ml-1" /> : <ChevronUp size={16} className="ml-1" />}
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <p className="italic text-gray-700">{farmingAdvice.summary}</p>
        </div>
        
        {(expandedSection === 'insights' || expandedSection === 'all') && (
          <>
            <h3 className="font-medium mb-3 text-gray-700">Recommended Actions:</h3>
            {farmingAdvice.recommendations && farmingAdvice.recommendations.length > 0 ? (
              <div className="space-y-4">
                {farmingAdvice.recommendations.map((item, index) => (
                  <div key={index} className="flex items-start p-3 border-l-4 bg-gray-50 rounded-r-md" style={{ borderColor: styles.primary }}>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{item.day}</h4>
                        <PriorityBadge priority={item.priority} />
                      </div>
                      <p className="text-gray-700 text-sm">{item.advice}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No recommendations available at the moment.</p>
            )}
          </>
        )}
      </div>
      
      {/* Alerts Section */}
      {farmingAdvice.alerts && farmingAdvice.alerts.length > 0 && (
        <div className="bg-red-50 rounded-lg shadow-md p-6 mb-6 border border-red-200">
          <div className="flex items-center mb-4">
            <AlertTriangle size={24} className="text-red-500 mr-2" />
            <h2 className="text-xl font-semibold text-red-700">Weather Alerts</h2>
          </div>
          
          <div className="space-y-4">
            {farmingAdvice.alerts.map((alert, index) => (
              <div key={index} className="p-4 bg-white rounded-md shadow-sm">
                <h3 className="font-medium text-red-600 mb-1">{alert.title}</h3>
                <p className="text-gray-700">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Weather data provided by OpenWeather API</p>
        <p>Farming insights powered by Gemini AI</p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}