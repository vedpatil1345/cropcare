'use client'
import { useState, useEffect } from 'react';

const MarketInsights = () => {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [cropPrices, setCropPrices] = useState(null);
  
  // Sample crop price data for different Indian regions
  // In a real application, this would come from the API
  const cropPriceData = {
    'delhi': {
      'wheat': '₹2,100/quintal',
      'rice': '₹3,600/quintal',
      'maize': '₹1,850/quintal',
      'sugarcane': '₹350/quintal'
    },
    'mumbai': {
      'wheat': '₹2,250/quintal',
      'rice': '₹3,750/quintal',
      'maize': '₹1,900/quintal',
      'sugarcane': '₹370/quintal'
    },
    'chennai': {
      'wheat': '₹2,180/quintal',
      'rice': '₹3,800/quintal',
      'maize': '₹1,830/quintal',
      'sugarcane': '₹340/quintal'
    },
    'kolkata': {
      'wheat': '₹2,150/quintal',
      'rice': '₹3,650/quintal',
      'maize': '₹1,870/quintal',
      'sugarcane': '₹355/quintal'
    },
    'pune': {
      'wheat': '₹2,200/quintal',
      'rice': '₹3,700/quintal',
      'maize': '₹1,880/quintal',
      'sugarcane': '₹360/quintal'
    }
  };
  
  // Function to fetch data from the agromonitoring API
  const fetchAgriData = async (locationName) => {
    setLoading(true);
    
    try {
      // In a real app, you would use the location to create a polygon or fetch data for that area
      // For this example, we're just simulating an API call and using our sample data
      
      // API endpoint (not actually used in this example)
      const apiUrl = 'http://api.agromonitoring.com/agro/1.0/polygons?appid=test';
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Normalize location name for our sample data
      const normalizedLocation = locationName.toLowerCase();
      
      // Get data for the location or default to Delhi if not found
      const locationData = cropPriceData[normalizedLocation] || cropPriceData['delhi'];
      
      setCropPrices(locationData);
      setLocation(locationName);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Use Delhi data as fallback
      setCropPrices(cropPriceData['delhi']);
      setLocation('Delhi');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchAgriData(searchQuery);
    }
  };
  
  // Initial data load for Delhi
  useEffect(() => {
    fetchAgriData('Delhi');
  }, []);
  
  return (
    <section className="bg-green-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-green-800 mb-4">बाज़ार जानकारी (Market Insights)</h2>
        <p className="text-gray-700 mb-6">
          अपने क्षेत्र की फसल कीमतों और बाज़ार रुझानों से अपडेट रहें।
          <br />
          <span className="text-sm">Stay updated with current crop prices and market trends in your region.</span>
        </p>
        
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="अपना शहर या क्षेत्र खोजें (Search your city or region)"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
              खोजें (Search)
            </button>
          </form>
        </div>
        
        {/* Market Data */}
        <div className="bg-white rounded-lg shadow-md p-4">
          {loading ? (
            <div className="text-center py-8">
              <p>लोड हो रहा है... (Loading...)</p>
            </div>
          ) : cropPrices ? (
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">
                {location} में फसल कीमतें (Crop Prices in {location})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="p-2 border">फसल (Crop)</th>
                      <th className="p-2 border">औसत कीमत (Average Price)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(cropPrices).map(([crop, price]) => (
                      <tr key={crop} className="border-b hover:bg-gray-50">
                        <td className="p-2 border capitalize">{crop}</td>
                        <td className="p-2 border">{price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>* कीमतें पिछले सप्ताह के औसत के आधार पर हैं और स्थानीय मंडियों में भिन्न हो सकती हैं।</p>
                <p className="text-xs">* Prices are based on last week's averages and may vary in local markets.</p>
              </div>
            </div>
          ) : (
            <p className="text-center py-4">कोई डेटा उपलब्ध नहीं है (No data available)</p>
          )}
          
          <div className="mt-6 text-center">
            <button className="bg-green-700 hover:bg-green-800 text-white py-2 px-6 rounded-md font-medium transition">
              मूल्य अलर्ट प्राप्त करें (Get Price Alerts)
            </button>
            <p className="mt-2 text-sm text-gray-500">
              कीमतों में बदलाव की दैनिक अपडेट प्राप्त करें
              <br />
              <span className="text-xs">Get daily updates on price changes</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketInsights;