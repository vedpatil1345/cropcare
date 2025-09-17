---
sidebar_position: 4
---

# /api/geocode

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
