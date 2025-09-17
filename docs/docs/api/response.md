---
sidebar_position: 5
---

# /api/response

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
