// route.js - Place this file in your API directory (e.g., app/api/crops/route.js)
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelName = "gemini-2.0-flash";

// Regional crop database for major regions in India
// This helps guide the AI with factual information about region-specific crops
const regionalCropDatabase = {
  "anand": ["tobacco", "rice", "banana", "wheat", "cotton", "pulses", "vegetables"],
  "gujarat": ["cotton", "groundnut", "wheat", "bajra", "tobacco", "mustard", "cumin", "vegetables"],
  "punjab": ["wheat", "rice", "cotton", "maize", "sugarcane", "barley", "vegetables"],
  "kerala": ["coconut", "rubber", "banana", "rice", "pepper", "cardamom", "tapioca", "vegetables"],
  "maharashtra": ["jowar", "bajra", "rice", "wheat", "pulses", "sugarcane", "turmeric", "vegetables"],
  // Add more regions as needed
};

// Find closest matching region for any input location
function findMatchingRegion(location) {
  const locationLower = location.toLowerCase();
  
  // Direct match
  if (regionalCropDatabase[locationLower]) {
    return locationLower;
  }
  
  // Check if location contains any of our known regions
  for (const region in regionalCropDatabase) {
    if (locationLower.includes(region)) {
      return region;
    }
  }
  
  // Default to just returning the location if no match
  return null;
}

// System instruction for crop recommendations
const getSystemInstruction = () => [
  {
    role: 'user',
    parts: [{ 
      text: "You are CropAdvisor, a specialized agricultural AI assistant focusing on region-specific vegetable and crop recommendations across different parts of India. Your expertise includes understanding different agricultural zones, climate patterns, soil types, and traditional farming practices throughout India. When asked about crops suitable for any specific region in India, you provide precise, accurate information tailored to that location's unique growing conditions. You format your output as clean, valid JSON arrays when requested. Your responses are practical, scientifically accurate, and incorporate both modern agricultural science and traditional farming knowledge."
    }]
  },
  {
    role: 'model',
    parts: [{ 
      text: "I understand my role as CropAdvisor. I'll provide location-specific crop recommendations formatted as clean JSON arrays when requested, considering each region's unique climate, soil conditions, and traditional farming practices. My responses will be scientifically accurate while respecting traditional agricultural knowledge."
    }]
  }
];

async function generateVegetableRecommendations(location) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: modelName });
    
    // Start with the system instruction
    const chatHistory = getSystemInstruction();
    
    // Find matching region to enhance accuracy
    const matchingRegion = findMatchingRegion(location);
    let regionSpecificGuidance = "";
    
    if (matchingRegion && regionalCropDatabase[matchingRegion]) {
      regionSpecificGuidance = `Important: The region of ${location} is known for growing these major crops: ${regionalCropDatabase[matchingRegion].join(", ")}. 
      Make sure your vegetable recommendations acknowledge and complement these existing agricultural patterns. Include some of these crops if they can be grown in home gardens or small plots.`;
    }
    
    // Create the prompt for vegetables based on location
    const prompt = `Given the location "${location}" in India, provide me with a JSON array of 8-12 vegetables and crops best suited for growing in this specific region. 
    For each vegetable/crop include:
    1. "name": The common name of the vegetable/crop plus local name in parentheses if applicable
    2. "icon": An appropriate emoji representing the vegetable/crop
    3. "plantMonths": Array of months when this should be planted in ${location} (use 3-letter abbreviations like "Jan", "Feb")
    4. "harvestMonths": Array of months when this can typically be harvested in ${location}
    5. "note": A short region-specific growing tip specifically for ${location}'s climate and soil conditions

    ${regionSpecificGuidance}

    Consider local climate patterns, soil types, rainfall distribution, traditional farming practices, and market demand in ${location}.
    Be specific to the traditional agricultural practices of this region.
    Include items that are ACTUALLY grown in ${location} based on factual information, not just generally suitable crops.
    For example, if ${location} is known for tobacco, rice, or banana cultivation, include these in your recommendations.
    Format your response as valid, parseable JSON array only, with no additional text or explanation.`;
    
    // Add the user message to chat history
    chatHistory.push({
      role: 'user',
      parts: [{ text: prompt }]
    });
    
    // Configure generation parameters for more consistent JSON output
    const generationConfig = {
      temperature: 0.2, // Slightly higher temperature for more regional specificity
      topK: 20,
      topP: 0.85,
      maxOutputTokens: 2048,
    };
    
    // Generate content
    const result = await model.generateContent({
      contents: chatHistory,
      generationConfig,
    });
    
    const response = result.response;
    
    // Extract text from response
    let responseText;
    if (response && response.text && typeof response.text === 'function') {
      responseText = response.text();
    } else if (response?.candidates?.[0]?.content?.parts) {
      responseText = response.candidates[0].content.parts.map(part => part.text).join('');
    } else {
      throw new Error("Empty or unexpected response from Gemini");
    }
    
    // Try to extract and validate JSON
    const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      // Parse to validate
      const vegetables = JSON.parse(jsonMatch[0]);
      return vegetables;
    } else {
      // Try parsing the whole response as JSON
      try {
        const vegetables = JSON.parse(responseText);
        if (Array.isArray(vegetables)) {
          return vegetables;
        }
      } catch (e) {
        // Not valid JSON
      }
    }
    
    throw new Error("Could not extract valid JSON vegetable data");
    
  } catch (error) {
    console.error("Error generating vegetable recommendations:", error.message);
    throw error;
  }
}

export async function POST(request) {
  try {
    const { location } = await request.json();
    
    if (!location || typeof location !== 'string') {
      return NextResponse.json(
        { error: 'Location is required' },
        { status: 400 }
      );
    }
    
    // Generate vegetable recommendations
    const vegetables = await generateVegetableRecommendations(location);
    
    return NextResponse.json({ vegetables });
    
  } catch (error) {
    console.error('Crop recommendation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate vegetable recommendations', details: error.message },
      { status: 500 }
    );
  }
}