---
sidebar_position: 1
---

# /api/cal

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
