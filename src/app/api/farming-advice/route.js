import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { weatherData, language, languageCode, location } = body;

    if (!weatherData || !location) {
      return Response.json(
        { message: 'Weather data and location are required' },
        { status: 400 }
      );
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

    // FIXED PROMPT - Only content should be in the specified language, NOT the JSON structure
    const prompt = `
      As an agricultural expert, provide farming advice based on the following weather forecast for ${location}.
      
      Current conditions: ${currentWeather.temp}°C, ${currentWeather.humidity}% humidity, ${currentWeather.windSpeed} km/h wind, ${currentWeather.description}.
      
      7-day forecast:
      ${forecast.map(day => `${day.date}: ${day.tempMin}-${day.tempMax}°C, ${day.humidity}% humidity, ${day.precipitation}% precipitation chance, ${day.description}`).join('\n')}
      
      IMPORTANT: Provide your response in the following EXACT JSON format. The JSON structure (field names like "summary", "recommendations", etc.) must remain in English, but the CONTENT of these fields should be written in ${language} language:
      
      {
        "summary": "A brief overview in ${language} of the weather impact on farming (1-2 sentences)",
        "recommendations": [
          {
            "day": "Day name in ${language} (e.g., 'आज', 'कल', etc. for Hindi)",
            "advice": "Specific farming advice for this day in ${language}",
            "priority": "high/medium/low"
          }
        ],
        "alerts": [
          {
            "title": "Alert title in ${language} (if any serious weather concerns)",
            "description": "Detailed description in ${language} of the alert and recommended actions"
          }
        ]
      }
      
      Requirements:
      - Write ALL content (summary, advice, day names, alerts) in ${language} language
      - Keep JSON field names (summary, recommendations, day, advice, priority, alerts, title, description) in English
      - Provide 3-5 recommendations for the upcoming days
      - Only include alerts if there are genuine concerns (extreme temperatures, heavy rainfall, drought conditions, etc.)
      - Consider seasonal crops and general farming practices
      - Prioritize recommendations based on urgency and weather conditions
      - Ensure the response is ONLY valid JSON with no additional text before or after
      - Use appropriate day names for the specified language (Today = आज for Hindi, আজ for Bengali, etc.)
    `;

    console.log(`Generating farming advice in ${language} for ${location}`);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log(`Raw AI response for ${language}:`, text);
    
    // Parse the JSON response with additional error handling
    try {
      // First, try to clean up any potential issues with the response
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find the first '{' and last '}'
      const startIdx = cleanedText.indexOf('{');
      const endIdx = cleanedText.lastIndexOf('}');
      
      if (startIdx >= 0 && endIdx >= 0 && endIdx > startIdx) {
        cleanedText = cleanedText.substring(startIdx, endIdx + 1);
      }
      
      // Try to parse the cleaned JSON
      const farmingAdvice = JSON.parse(cleanedText);
      
      console.log(`Parsed advice for ${language}:`, farmingAdvice);
      
      // Validate and provide fallbacks in the requested language
      if (!farmingAdvice.summary) {
        const summaryFallbacks = {
          'English': "Based on the forecast, plan your farming activities accordingly.",
          'हिंदी': "पूर्वानुमान के आधार पर, अपनी कृषि गतिविधियों की योजना बनाएं।",
          'বাংলা': "পূর্বাভাসের ভিত্তিতে, আপনার কৃষি কার্যক্রম পরিকল্পনা করুন।",
          'తెలుగు': "వాతావరణ అంచనా ఆధారంగా, మీ వ్యవసాయ కార్యకలాపాలను ప్రణాళిక చేసుకోండి।",
          'मराठी': "हवामान अंदाजाच्या आधारे, आपल्या शेती क्रियाकलापांची योजना करा।",
          'தமிழ்': "வானிலை முன்னறிவிப்பின் அடிப்படையில், உங்கள் விவசாய நடவடிக்கைகளைத் திட்டமிடுங்கள்।",
          'ગુજરાતી': "હવામાન આગાહીના આધારે, તમારી કૃષિ પ્રવૃત્તિઓનું આયોજન કરો।",
          'ಕನ್ನಡ': "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯ ಆಧಾರದ ಮೇಲೆ, ನಿಮ್ಮ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಯೋಜಿಸಿ।",
          'മലയാളം': "കാലാവസ്ഥാ പ്രവചനത്തിന്റെ അടിസ്ഥാനത്തിൽ, നിങ്ങളുടെ കൃഷി പ്രവർത്തനങ്ങൾ ആസൂത്രണം ചെയ്യുക।",
          'ਪੰਜਾਬੀ': "ਮੌਸਮੀ ਪੂਰਵਾਨੁਮਾਨ ਦੇ ਆਧਾਰ 'ਤੇ, ਆਪਣੀਆਂ ਖੇਤੀ ਗਤੀਵਿਧੀਆਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।",
          'ଓଡ଼ିଆ': "ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଆଧାରରେ, ଆପଣଙ୍କ କୃଷି କାର୍ଯ୍ୟକଳାପର ଯୋଜନା କରନ୍ତୁ।",
          'অসমীয়া': "বতৰৰ পূৰ্বানুমানৰ ভিত্তিত, আপোনাৰ কৃষি কাৰ্য্যকলাপৰ পৰিকল্পনা কৰক।"
        };
        farmingAdvice.summary = summaryFallbacks[language] || summaryFallbacks['English'];
      }
      
      if (!farmingAdvice.recommendations || !Array.isArray(farmingAdvice.recommendations) || farmingAdvice.recommendations.length === 0) {
        const todayTranslations = {
          'English': 'Today',
          'हिंदी': 'आज',
          'বাংলা': 'আজ',
          'తెలుగు': 'ఈరోజు',
          'मराठी': 'आज',
          'தமிழ்': 'இன்று',
          'ગુજરાતી': 'આજ',
          'ಕನ್ನಡ': 'ಇಂದು',
          'മലയാളം': 'ഇന്ന്',
          'ਪੰਜਾਬੀ': 'ਅੱਜ',
          'ଓଡ଼ିଆ': 'ଆଜି',
          'অসমীয়া': 'আজি'
        };
        
        const tomorrowTranslations = {
          'English': 'Tomorrow',
          'हिंदी': 'कल',
          'বাংলা': 'কাল',
          'తెలుగు': 'రేపు',
          'मराठी': 'उद्या',
          'தமிழ்': 'நாளை',
          'ગુજરાતી': 'કાલે',
          'ಕನ್ನಡ': 'ನಾಳೆ',
          'മലയാളം': 'നാളെ',
          'ਪੰਜਾਬੀ': 'ਕੱਲ੍ਹ',
          'ଓଡ଼ିଆ': 'କାଲି',
          'অসমীয়া': 'কাইলৈ'
        };
        
        const adviceFallbacks = {
          'English': ["Monitor your crops and adjust watering based on current conditions.", "Continue standard farming operations based on your crop calendar."],
          'हिंदी': ["वर्तमान परिस्थितियों के आधार पर अपनी फसलों की निगरानी करें और सिंचाई को समायोजित करें।", "अपने फसल कैलेंडर के आधार पर मानक कृषि कार्य जारी रखें।"],
          'বাংলা': ["বর্তমান অবস্থার ভিত্তিতে আপনার ফসল পর্যবেক্ষণ করুন এবং সেচ সামঞ্জস্য করুন।", "আপনার ফসল ক্যালেন্ডারের ভিত্তিতে মানক কৃষি কার্যক্রম চালিয়ে যান।"],
          'తెలుగు': ["ప్రస్తుత పరిస్థితుల ఆధారంగా మీ పంటలను పర్యవేక్షించండి మరియు నీటిపారుదలను సర్దుబాటు చేయండి।", "మీ పంట క్యాలెండర్ ఆధారంగా ప్రామాణిక వ్యవసాయ కార్యకలాపాలను కొనసాగించండి।"],
          'मराठी': ["सद्य परिस्थितीनुसार आपल्या पिकांचे निरीक्षण करा आणि पाणी पुरवठा समायोजित करा।", "आपल्या पीक कॅलेंडरनुसार मानक शेती क्रियाकलाप सुरू ठेवा।"]
        };
        
        const todayText = todayTranslations[language] || 'Today';
        const tomorrowText = tomorrowTranslations[language] || 'Tomorrow';
        const adviceTexts = adviceFallbacks[language] || adviceFallbacks['English'];
        
        farmingAdvice.recommendations = [
          {
            day: todayText,
            advice: adviceTexts[0],
            priority: "medium"
          },
          {
            day: tomorrowText,
            advice: adviceTexts[1],
            priority: "medium"
          }
        ];
      }
      
      if (!farmingAdvice.alerts || !Array.isArray(farmingAdvice.alerts)) {
        farmingAdvice.alerts = [];
      }
      
      return Response.json(farmingAdvice, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response from Gemini:', text);
      
      // Language-specific fallback advice
      const fallbackData = {
        'English': {
          summary: "Based on the forecast, moderate temperatures and typical conditions are expected. Monitor your crops regularly and follow standard seasonal practices.",
          recommendations: [
            { day: "Today", advice: "Regular monitoring of crops and soil moisture is recommended.", priority: "medium" },
            { day: "Tomorrow", advice: "Continue standard farming operations based on your crop calendar.", priority: "medium" }
          ]
        },
        'हिंदी': {
          summary: "पूर्वानुमान के आधार पर, मध्यम तापमान और सामान्य स्थितियां अपेक्षित हैं। अपनी फसलों की नियमित निगरानी करें।",
          recommendations: [
            { day: "आज", advice: "फसलों और मिट्टी की नमी की नियमित निगरानी की सिफारिश की जाती है।", priority: "medium" },
            { day: "कल", advice: "अपने फसल कैलेंडर के आधार पर मानक कृषि कार्य जारी रखें।", priority: "medium" }
          ]
        }
      };
      
      const fallback = fallbackData[language] || fallbackData['English'];
      return Response.json({
        summary: fallback.summary,
        recommendations: fallback.recommendations,
        alerts: []
      }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  } catch (error) {
    console.error('Error generating farming advice:', error);
    return Response.json(
      { 
        message: 'Failed to generate farming advice',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}