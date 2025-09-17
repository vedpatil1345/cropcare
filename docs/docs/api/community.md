---
sidebar_position: 2
---

# /api/community/posts

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
