---
sidebar_position: 6
---

# /api/schemes

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
