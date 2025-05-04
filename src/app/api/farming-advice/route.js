// pages/api/farming-advice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function POST(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { weatherData, location } = req.body;

    if (!weatherData || !location) {
      return res.status(400).json({ message: 'Weather data and location are required' });
    }

    // Extract relevant weather information
    const currentWeather = {
      temp: weatherData.current.temp,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.wind_speed,
      condition: weatherData.current.weather[0].main,
      description: weatherData.current.weather[0].description
    };

    // Extract 7-day forecast
    const forecast = weatherData.daily.map(day => ({
      date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      tempMax: day.temp.max,
      tempMin: day.temp.min,
      humidity: day.humidity,
      windSpeed: day.wind_speed,
      precipitation: day.pop * 100,
      condition: day.weather[0].main,
      description: day.weather[0].description
    }));

    // Generate farming advice using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      As an agricultural expert, provide farming advice based on the following weather forecast for ${location}:
      
      Current conditions: ${currentWeather.temp}°C, ${currentWeather.humidity}% humidity, ${currentWeather.windSpeed} km/h wind, ${currentWeather.description}.
      
      7-day forecast:
      ${forecast.map(day => `${day.date}: ${day.tempMin}-${day.tempMax}°C, ${day.humidity}% humidity, ${day.precipitation}% precipitation chance, ${day.description}`).join('\n')}
      
      Provide a response in the following JSON format:
      {
        "summary": "A brief overview of the weather impact on farming (1-2 sentences)",
        "recommendations": [
          {
            "day": "Day name (e.g., 'Today', 'Tomorrow', 'Wednesday')",
            "advice": "Specific farming advice for this day",
            "priority": "high/medium/low"
          }
        ],
        "alerts": [
          {
            "title": "Alert title (if any serious weather concerns)",
            "description": "Detailed description of the alert and recommended actions"
          }
        ]
      }
      
      Notes:
      - Provide 3-5 recommendations for the upcoming days
      - Only include alerts if there are genuine concerns (extreme temperatures, heavy rainfall, drought conditions, etc.)
      - Consider seasonal crops and general farming practices
      - Prioritize recommendations based on urgency and weather conditions
      - Make sure the response is ONLY valid JSON with no additional text
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse the JSON response with additional error handling
    try {
      // First, try to clean up any potential issues with the response
      // This helps deal with cases where the AI might add extra text before or after JSON
      let cleanedText = text.trim();
      
      // Find the first '{' and last '}'
      const startIdx = cleanedText.indexOf('{');
      const endIdx = cleanedText.lastIndexOf('}');
      
      if (startIdx >= 0 && endIdx >= 0 && endIdx > startIdx) {
        cleanedText = cleanedText.substring(startIdx, endIdx + 1);
      }
      
      // Try to parse the cleaned JSON
      const farmingAdvice = JSON.parse(cleanedText);
      
      // Validate that we have the expected structure
      if (!farmingAdvice.summary) {
        farmingAdvice.summary = "Based on the forecast, plan your farming activities accordingly.";
      }
      
      if (!farmingAdvice.recommendations || !Array.isArray(farmingAdvice.recommendations) || farmingAdvice.recommendations.length === 0) {
        farmingAdvice.recommendations = [
          {
            day: "Today",
            advice: "Monitor your crops and adjust watering based on current conditions.",
            priority: "medium"
          },
          {
            day: "Tomorrow",
            advice: "Continue standard farming operations based on your crop calendar.",
            priority: "medium"
          }
        ];
      }
      
      if (!farmingAdvice.alerts || !Array.isArray(farmingAdvice.alerts)) {
        farmingAdvice.alerts = [];
      }
      
      return res.status(200).json(farmingAdvice);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response from Gemini:', text);
      
      // Fallback advice if parsing fails
      return res.status(200).json({
        summary: "Based on the forecast, moderate temperatures and typical conditions are expected. Monitor your crops regularly and follow standard seasonal practices.",
        recommendations: [
          {
            day: "Today",
            advice: "Regular monitoring of crops and soil moisture is recommended.",
            priority: "medium"
          },
          {
            day: "Tomorrow",
            advice: "Continue standard farming operations based on your crop calendar.",
            priority: "medium"
          },
          {
            day: `${new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'long' })}`,
            advice: "Check weather updates and plan field activities accordingly.",
            priority: "medium"
          }
        ],
        alerts: []
      });
    }
  } catch (error) {
    console.error('Error generating farming advice:', error);
    return res.status(500).json({ 
      message: 'Failed to generate farming advice',
      error: error.message
    });
  }
}