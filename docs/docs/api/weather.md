---
sidebar_position: 7
---

# /api/weather

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
