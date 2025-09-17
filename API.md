# CropCare API Documentation

This document provides a detailed overview of the CropCare API endpoints.

## Table of Contents

- [/api/cal](#apical)
- [/api/community/posts](#apicommunityposts)
- [/api/farming-advice](#apifarming-advice)
- [/api/geocode](#apigeocode)
- [/api/response](#apiresponse)
- [/api/schemes](#apischemes)
- [/api/weather](#apiweather)

---

## /api/cal

Provides crop recommendations based on a given location in India.

- **Method:** `POST`
- **Endpoint:** `/api/cal`
- **Request Body:**
  ```json
  {
    "location": "some-location-in-india"
  }
  ```
- **Description:** This endpoint uses the Google Generative AI (Gemini) to generate a list of 8-12 vegetables and crops suitable for the specified location. It takes into account a comprehensive internal database of regional crops, climate patterns, soil types, and traditional farming practices to provide tailored recommendations.
- **Success Response (200 OK):**
  A JSON object containing a list of vegetable recommendations.
  ```json
  {
    "vegetables": [
      {
        "name": "Tomato (Tamatar)",
        "icon": "🍅",
        "plantMonths": ["Jun", "Jul", "Aug"],
        "harvestMonths": ["Sep", "Oct", "Nov"],
        "note": "Requires well-drained soil and consistent watering. Stake plants for better yield."
      },
      // ... other vegetables
    ]
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If the `location` field is missing in the request body.
  - `500 Internal Server Error`: If the AI model fails to generate recommendations or if there is another server-side error.

---

## /api/community/posts

Handles the creation and retrieval of community forum posts. Posts are stored in a JSON file.

### GET /api/community/posts

Fetches a paginated and filterable list of community posts.

- **Method:** `GET`
- **Query Parameters:**
  - `category` (string): Filters posts by a specific category (e.g., "Pest Control").
  - `postType` (string): Filters posts by type (e.g., "experience", "question").
  - `sortBy` (string): Sorts the posts. Options are `popular` (by upvotes) or `recent` (default).
  - `page` (number): The page number for pagination (default: 1).
  - `limit` (number): The number of posts per page (default: 10).
- **Success Response (200 OK):**
  A JSON object containing the posts and pagination details.
  ```json
  {
    "posts": [
      {
        "id": 1,
        "title": "Organic pest control methods that actually work",
        "author": "FarmerJohn",
        "category": "Pest Control",
        "postType": "experience",
        "upvotes": 45,
        "comments": 12,
        "createdAt": "2024-03-15T10:30:00Z"
        // ... other fields
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 50,
      "hasMore": true
    }
  }
  ```
- **Error Response:**
  - `500 Internal Server Error`: If the server fails to read the posts data file.

### POST /api/community/posts

Creates a new community post.

- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "title": "Best time to plant corn in midwest?",
    "content": "I'm planning to plant corn this season...",
    "category": "Seeds & Planting",
    "tags": "corn,planting,midwest",
    "postType": "question",
    "authorId": "user_456",
    "author": "NewFarmer2024"
  }
  ```
- **Description:** Creates a new post and saves it to the JSON data file.
- **Success Response (201 Created):**
  The newly created post object.
- **Error Responses:**
  - `400 Bad Request`: If required fields (`title`, `content`, `category`, `postType`, `authorId`, `author`) are missing.
  - `500 Internal Server Error`: If the server fails to create the post or write to the data file.

---

## /api/farming-advice

Generates farming advice based on weather data for a specific location and in a specified language.

- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "weatherData": { ... },
    "language": "हिंदी",
    "languageCode": "hi",
    "location": "Pune, India"
  }
  ```
- **Description:** This endpoint uses Google's Generative AI (Gemini) to create contextual farming advice. It takes current and forecasted weather data, a location, and a desired language as input. The AI generates a summary, actionable recommendations, and potential alerts.
- **Success Response (200 OK):**
  A JSON object with advice content in the requested language.
  ```json
  {
    "summary": "मौसम पूर्वानुमान के आधार पर, अपनी कृषि गतिविधियों की योजना बनाएं।",
    "recommendations": [
      {
        "day": "आज",
        "advice": "फसलों और मिट्टी की नमी की नियमित निगरानी करें।",
        "priority": "medium"
      }
    ],
    "alerts": []
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If `weatherData` or `location` are missing.
  - `500 Internal Server Error`: If the AI model fails to generate advice.
- **CORS:** This endpoint supports `OPTIONS` requests for CORS pre-flight checks.

---

## /api/geocode

Fetches geographic coordinates (latitude and longitude) for a given location name.

- **Method:** `GET`
- **Query Parameters:**
  - `q` (string, required): The location name to search for (e.g., "Mumbai").
- **Description:** Uses the free Open-Meteo Geocoding API to find locations matching the query. The response is transformed to be compatible with the format used elsewhere in the application.
- **Success Response (200 OK):**
  An array of location objects.
  ```json
  [
    {
      "name": "Mumbai",
      "lat": 19.0759837,
      "lon": 72.8776559,
      "country": "IN",
      "state": "Maharashtra"
    }
  ]
  ```
- **Error Responses:**
  - `400 Bad Request`: If the `q` query parameter is missing.
  - `500 Internal Server Error`: If the geocoding API call fails.
- **CORS:** This endpoint supports `OPTIONS` requests for CORS pre-flight checks.

---

## /api/response

The core of the AI-powered chat assistant. It processes user prompts, manages chat history, and generates AI responses.

- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "prompt": "What is this disease on my tomato plant?",
    "image": "data:image/jpeg;base64,...",
    "chatSessionId": "some-unique-session-id",
    "clerkUserId": "user_...",
    "language": "English",
    "location": "Nashik, India"
  }
  ```
- **Description:** This is a comprehensive endpoint that orchestrates the chat functionality. It validates user input, manages the chat session, persists conversation history to a Supabase database, and uses Google's Gemini AI (including multimodal vision capabilities) to generate helpful, context-aware responses.
- **Success Response (200 OK):**
  A JSON object containing the AI's response.
  ```json
  {
    "response": "This appears to be early blight, a common fungal disease in tomatoes. Here are the steps to treat it...",
    "chatSessionId": "some-unique-session-id",
    "success": true
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If `chatSessionId` or `clerkUserId` are missing, or if no `prompt` or `image` is provided.
  - `500 Internal Server Error`: For failures in session management, database operations, or AI response generation.

---

## /api/schemes

Scrapes a government website for agricultural schemes and saves them to the database.

- **Method:** `GET`
- **Description:** This endpoint automatically fetches the latest agricultural schemes from the `myscheme.gov.in` website. It uses `axios` and `cheerio` for web scraping and then upserts the data into the `schemes_notifications` table in a Supabase database, avoiding duplicate entries.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "schemes": [
      {
        "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "description": "PMFBY is the government sponsored crop insurance scheme that integrates multiple stakeholders on a single platform.",
        "link": "https://www.myscheme.gov.in/schemes/pmfby"
      }
      // ... other schemes
    ]
  }
  ```
- **Error Response:**
  - `500 Internal Server Error`: If the scraping or database operation fails.

---

## /api/weather

Fetches current and 7-day weather forecast data for a specific geographic location.

- **Method:** `GET`
- **Query Parameters:**
  - `lat` (string, required): The latitude.
  - `lon` (string, required): The longitude.
- **Description:** Uses the free Open-Meteo API to get detailed weather data. The response is then transformed into a consistent format used by the application's frontend, including converting units and mapping weather codes to readable descriptions.
- **Success Response (200 OK):**
  A JSON object with `current` and `daily` weather data.
  ```json
  {
    "current": {
      "temp": 28,
      "humidity": 75,
      "wind_speed": 15,
      "weather": [{ "main": "Clouds", "description": "partly cloudy" }]
      // ... other fields
    },
    "daily": [
      {
        "temp": { "min": 24, "max": 32 },
        "weather": [{ "main": "Rain", "description": "moderate rain" }]
        // ... other fields
      }
    ]
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: If `lat` or `lon` query parameters are missing.
  - `500 Internal Server Error`: If the weather API call fails.
- **CORS:** This endpoint supports `OPTIONS` requests for CORS pre-flight checks.
