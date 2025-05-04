
// export default IndiaVegetableGrowingChart;
'use client';
import React, { useState, useEffect } from 'react';

const IndiaVegetableGrowingChart = () => {
  const [location, setLocation] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vegetables, setVegetables] = useState([]);
  const [error, setError] = useState('');
  const [currentSeason, setCurrentSeason] = useState('');

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Season colors and names
  const seasonInfo = {
    "Dec": { season: "Winter", color: "bg-blue-100" },
    "Jan": { season: "Winter", color: "bg-blue-100" },
    "Feb": { season: "Winter", color: "bg-blue-100" },
    "Mar": { season: "Spring", color: "bg-green-100" },
    "Apr": { season: "Spring", color: "bg-green-100" },
    "May": { season: "Spring", color: "bg-green-100" },
    "Jun": { season: "Summer", color: "bg-yellow-100" },
    "Jul": { season: "Summer", color: "bg-yellow-100" },
    "Aug": { season: "Summer", color: "bg-yellow-100" },
    "Sep": { season: "Autumn", color: "bg-orange-100" },
    "Oct": { season: "Autumn", color: "bg-orange-100" },
    "Nov": { season: "Autumn", color: "bg-orange-100" },
  };

  // Get current month and season on load
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'short' });
    setCurrentSeason(seasonInfo[currentMonth]?.season || '');
  }, []);

  // Get season color class
  const getSeasonColor = (month) => {
    return seasonInfo[month].color;
  };
  
  // Get season name
  const getSeasonName = (month) => {
    return seasonInfo[month].season;
  };

  // Fetch regional vegetables
  const fetchRegionalVegetables = async () => {
    if (!location) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the crops API route
      const response = await fetch('/api/cal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.vegetables || !Array.isArray(data.vegetables)) {
        throw new Error('Invalid data format');
      }
      
      // Set the vegetables data
      setVegetables(data.vegetables);
    } catch (err) {
      console.error('Error fetching vegetables:', err);
      setError('Failed to get regional crop information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample default vegetables to show before location is selected
  const defaultVegetables = [
    {
      name: "Tomatoes (Tamatar)",
      icon: "🍅",
      plantMonths: ["Feb", "Mar", "Apr", "Aug", "Sep"],
      harvestMonths: ["Jun", "Jul", "Aug", "Sep", "Nov", "Dec"],
      note: "Search for your location to get region-specific recommendations."
    },
    {
      name: "Brinjal (Baingan)",
      icon: "🍆",
      plantMonths: ["Jan", "Feb", "Jun", "Jul", "Oct", "Nov"],
      harvestMonths: ["Mar", "Apr", "Aug", "Sep", "Dec"],
      note: "Search for your location to get region-specific recommendations."
    },
    {
      name: "Okra (Bhindi)",
      icon: "🌿",
      plantMonths: ["Feb", "Mar", "Jun", "Jul"],
      harvestMonths: ["Apr", "May", "Aug", "Sep"],
      note: "Search for your location to get region-specific recommendations."
    }
  ];

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
    }
  };

  // Fetch recommendations when location changes
  useEffect(() => {
    if (location) {
      fetchRegionalVegetables();
    }
  }, [location]);

  // Determine which vegetables to display
  const displayVegetables = vegetables.length > 0 ? vegetables : defaultVegetables;

  // Get current month to highlight
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });

  return (
    <div className="max-w-8xl mx-auto ">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-lg border border-green-200">
        {/* Header section with title and current season */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            Crop Calendar
            </h1>
            <h2 className="text-xl text-gray-600">Regional Crop Guide</h2>
          </div>
          
          {currentSeason && (
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md">
              <div className="h-3 w-3 rounded-full animate-pulse bg-green-500"></div>
              <span className="font-medium">Current Season: {currentSeason}</span>
            </div>
          )}
        </div>
        
        {/* Search input */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full p-4 pl-12 pr-20 text-base text-gray-900 border-0 rounded-full shadow-md focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Enter your location in India (e.g., Punjab, Kerala, Anand)" 
                required 
              />
              <button 
                type="submit" 
                className="absolute right-2.5 bottom-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-full font-medium hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Finding...' : 'Find Crops'}
              </button>
            </div>
          </form>
        </div>

        {/* Location-specific header */}
        {location && (
          <div className="mb-6 text-center">
            <div className="inline-block bg-white/90 px-5 py-3 rounded-full shadow-md border border-green-200">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌾</span>
                <span className="font-bold text-lg text-green-800">
                  {location} Growing Guide
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center mb-6 p-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Fetching crop recommendations for {location}...</p>
          </div>
        )}
        
        {/* Month navigation scroller */}
        {/* <div className="mb-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max py-2">
            {months.map((month) => (
              <div 
                key={month} 
                className={`p-2 rounded-lg flex-shrink-0 w-24 text-center ${
                  month === currentMonth 
                    ? 'bg-green-600 text-white shadow-md' 
                    : `${getSeasonColor(month)} text-gray-800`
                }`}
              >
                <div className="font-semibold">{month}</div>
                <div className="text-xs">{getSeasonName(month)}</div>
              </div>
            ))}
          </div>
        </div> */}
        
        {/* Vegetable growing table */}
        <div className="overflow-x-auto rounded-xl shadow-md mb-6">
          <table className="min-w-full border-collapse bg-white">
            <thead>
              <tr>
                <th className="p-4 bg-gradient-to-r from-green-700 to-green-600 text-white text-left rounded-tl-lg sticky left-0 z-20 min-w-44">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌱</span>
                    <span>Crop/Vegetable</span>
                  </div>
                </th>
                {months.map((month, index) => (
                  <th 
                    key={month} 
                    className={`p-3 text-center w-20 ${
                      month === currentMonth 
                        ? 'bg-green-500 text-white' 
                        : `${getSeasonColor(month)} border-b-2 border-green-300`
                    } ${index === months.length - 1 ? 'rounded-tr-lg' : ''}`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{month}</span>
                      <span className="text-xs">{getSeasonName(month)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayVegetables.map((veg, index) => (
                <tr key={index} className={`transition-all hover:bg-green-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-4 border-b border-green-100 sticky left-0 z-10 bg-inherit">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{veg.icon}</span>
                      <div>
                        <div className="font-medium">{veg.name}</div>
                        {veg.note && (
                          <div className="text-xs text-gray-600 mt-1 max-w-xs">
                            {veg.note}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  {months.map((month) => {
                    const isPlanting = veg.plantMonths.includes(month);
                    const isHarvesting = veg.harvestMonths.includes(month);
                    const isCurrentMonth = month === currentMonth;
                    
                    return (
                      <td 
                        key={month} 
                        className={`p-3 border-b border-green-100 text-center ${
                          isCurrentMonth ? 'bg-green-50' : getSeasonColor(month).replace('bg-', 'bg-opacity-30 bg-')
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {isPlanting && (
                            <div className={`rounded-full p-2 ${
                              isCurrentMonth ? 'bg shadow-lg' : 'bg-'
                            }`}>
                              <span className="text-white text-sm">🌱</span>
                            </div>
                          )}
                          {isHarvesting && (
                            <div className={`rounded-full p-2 ${
                              isCurrentMonth ? 'bg shadow-lg' : ''
                            }`}>
                              <span className="text-white text-sm">🧺</span>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full shadow-sm">
            <div className=" p-2 rounded-full">
              <span className="text-white text-sm">🌱</span>
            </div>
            <span className="font-medium">Planting Time</span>
          </div>
          <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full shadow-sm">
            <div className=" p-2 rounded-full">
              <span className="text-white text-sm">🧺</span>
            </div>
            <span className="font-medium">Harvesting Time</span>
          </div>
          <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full shadow-sm">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="font-medium">Current Month</span>
          </div>
        </div>
        
        {/* Tip box */}
        <div className="flex justify-center">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-gray-700 max-w-3xl">
            <div className="flex items-start">
              <span className="text-amber-600 text-xl mr-3 mt-0.5">💡</span>
              <p>
                {location ? 
                  `These crops are specifically recommended for ${location} based on local climate, soil conditions, and traditional farming practices. Growing times may vary slightly based on local weather patterns and microclimates.` :
                  `Enter your location to get personalized crop recommendations for your region's climate and soil type. These recommendations will help you plan your garden or farm for optimal harvests throughout the year.`
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Based on traditional farming knowledge and agricultural data for India's diverse regions</p>
        </div>
      </div>
    </div>
  );
};

export default IndiaVegetableGrowingChart;