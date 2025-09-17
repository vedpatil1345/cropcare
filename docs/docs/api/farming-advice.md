---
sidebar_position: 3
---

# /api/farming-advice

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
