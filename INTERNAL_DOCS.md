# Internal Production Documentation

Welcome to the internal production documentation for the CropCare project. This document is intended to help new team members understand the project's architecture, codebase, and conventions.

## 1. Project Overview

CropCare is a comprehensive web application designed to assist farmers by providing them with a suite of tools and information to improve their farming practices. Built with Next.js and leveraging modern technologies, CropCare aims to be a one-stop solution for farmers to get personalized advice, connect with a community, and stay updated with the latest information.

The project is a full-stack application with a Next.js frontend and a backend powered by Next.js API routes. It uses Supabase for database storage and Clerk for user authentication. The AI-powered features are implemented using Google's Generative AI.

## 2. Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (v15)
*   **Language**: JavaScript (ES6+)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/) components
*   **Authentication**: [Clerk](https://clerk.dev/)
*   **Database**: [Supabase](https://supabase.io/)
*   **AI**: [Google Generative AI](https://ai.google.com/discover/generativeai)
*   **Deployment**: [Vercel](https://vercel.com/)

## 3. Project Structure

The project follows a standard Next.js App Router structure.

```
cropcare/
├── .gitignore
├── API.md
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── LICENSE
├── middleware.js
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── public/
│   ├── ... (static assets like images and svgs)
└── src/
    ├── app/
    │   ├── (pages)/
    │   │   ├── about/
    │   │   ├── schemes/
    │   │   └── services/
    │   │       ├── calender/
    │   │       ├── chat/
    │   │       ├── community/
    │   │       ├── market/
    │   │       ├── schemes/
    │   │       └── weather/
    │   ├── api/
    │   │   ├── cal/
    │   │   ├── community/
    │   │   ├── farming-advice/
    │   │   ├── geocode/
    │   │   ├── response/
    │   │   ├── schemes/
    │   │   └── weather/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    ├── assests/
    │   └── posts.json
    ├── components/
    │   ├── pages/
    │   ├── CategoryList.jsx
    │   ├── CommentSection.jsx
    │   ├── CommunityFeed.jsx
    │   ├── CreatePostForm.jsx
    │   ├── FilterTabs.jsx
    │   ├── Footer.jsx
    │   ├── HomeNav.jsx
    │   ├── location.jsx
    │   ├── Navbar.jsx
    │   ├── PostCard.jsx
    │   ├── PostDetail.jsx
    │   └── Sidebar.jsx
    ├── hooks/
    │   └── use-mobile.js
    └── lib/
        ├── database-utils.js
        ├── supabase.js
        └── utils.js
```

### Key Directories

*   `src/app`: The main application directory, following the Next.js App Router structure.
    *   `src/app/(pages)`: Contains the main pages of the application.
    *   `src/app/api`: Contains the backend API routes.
*   `src/components`: Contains reusable React components.
    *   `src/components/pages`: Contains components that are specific to a single page.
*   `src/hooks`: Contains custom React hooks.
*   `src/lib`: Contains utility functions and library initializations.
*   `public`: Contains static assets like images and fonts.


## 4. Frontend

The frontend of the CropCare application is built with Next.js and React. It uses the App Router for routing and Tailwind CSS for styling.

### 4.1. Routing

The application uses the Next.js App Router for routing. The file system is used to define the routes. For example, `src/app/about/page.js` maps to the `/about` route.

### 4.2. Root Layout (`src/app/layout.js`)

The root layout is the main layout for the entire application. It is defined in `src/app/layout.js`.

**Responsibilities:**

*   Sets up the HTML structure of the application.
*   Includes the global CSS file (`src/app/globals.css`).
*   Configures the fonts for the application using `next/font`.
*   Wraps the entire application with the `ClerkProvider` to provide authentication context.
*   Renders the main navigation bar (`HomeNav`) and the footer (`Footer`) for all pages.

### 4.3. Home Page (`src/app/page.js`)

The home page is the entry point of the application. It is defined in `src/app/page.js`.

**Content:**

*   Renders the `Hero` component, which is the main hero section of the home page.

---

### 4.4. Hero Component (`src/components/pages/Hero.jsx`)

The `Hero` component is the main component rendered on the home page.

**Functionality:**

*   Displays the main heading and a brief description of the application.
*   Includes a "Get Started" button that:
    *   Navigates to the `/services` page if the user is authenticated.
    *   Opens the Clerk sign-in modal if the user is not authenticated.
*   Displays a hero image and a features section with more details about the application.

---
### 4.5. About Page (`src/app/about/page.js`)

The about page provides information about the CropCare project.

**Content:**

*   A brief introduction to CropCare and its mission.
*   A "Why CropCare?" section that highlights the key benefits of the application.
*   An image related to agricultural support.
*   Credits to the developers of the project.

---
### 4.6. Services Layout (`src/app/services/layout.js`)

This layout is applied to all pages under the `/services` route.

**Functionality:**

*   **Authentication Guard**: It checks if a user is authenticated using the `useUser` hook from Clerk.
    *   If the user is **not authenticated**, it displays a message prompting them to sign in and renders the Clerk `SignIn` component.
    *   If the user is **authenticated**, it renders the `Navbar` component and the content of the specific service page.
*   **Navigation**: It displays a `Navbar` component for authenticated users, providing navigation to the different services.

### 4.7. Services Page (`src/app/services/page.js`)

This is the main page for the `/services` route.

**Content:**

*   It renders the `Services` component, which likely displays a list or grid of the available services.

---
### 4.8. Services Component (`src/components/pages/Services.jsx`)

This component is the main content of the `/services` page. It displays a grid of the available services.

**Functionality:**

*   Displays a list of services, each with a title, description, and an icon.
*   Each service card links to the corresponding service page.

**Services Offered:**

*   **AI Farming Assistant**: Links to `/services/chat`.
*   **Weather Forecasts**: Links to `/services/weather`.
*   **Crop Calendar**: Links to `/services/calender`.
*   **Market Insights**: Links to `/services/market`.
*   **Government Schemes**: Links to `/schemes`.
*   **Community Engagement**: Links to `/services/community`.

---
### 4.9. Chat Page (`src/app/services/chat/page.js`)

This page is the entry point for the AI Farming Assistant service.

**Functionality:**

*   It retrieves the current user's email address using the `useUser` hook from Clerk.
*   It renders the `Chat` component, passing the user's email as the `userId` prop.

### 4.10. Chat Component (`src/components/pages/Chat.jsx`)

This component is the main container for the chat functionality. It manages the chat sessions and the overall layout of the chat interface.

**Key Responsibilities:**

*   **Session Management**:
    *   Loads all chat sessions for the logged-in user from the Supabase `chat_sessions` table.
    *   Handles the creation of new chat sessions.
    *   Handles the deletion of existing chat sessions.
    *   Manages the currently active chat session.
*   **UI Layout**:
    *   Renders a sidebar that displays the user's chat history, grouped by date.
    *   Provides a "New Chat" button to start a new conversation.
    *   Renders the `ChatInterface` component for the active chat session.
    *   Includes a responsive design with a collapsible sidebar for mobile devices.

### 4.11. ChatInterface Component (`src/components/pages/ChatInterface.jsx`)

This component provides the user interface for a single chat session. It handles the rendering of messages, the input form, and the interaction with the backend.

**Key Features:**

*   **Message Display**: Renders the conversation history for the selected chat session, including both user messages and bot responses.
*   **Message Input**: Provides a text input field and an image upload button for users to send messages.
*   **Image Upload**: Allows users to upload an image of a plant for analysis. It includes validation for file type and size.
*   **Language Selection**: Includes a dropdown menu to allow users to select their preferred language for the conversation.
*   **API Communication**:
    *   Sends user messages (text and images) to the `/api/response` endpoint to get a response from the AI.
    *   Saves both user and bot messages to the Supabase `chat_messages` table.
*   **Real-time Feedback**:
    *   Immediately displays the user's message in the chat history.
    *   Shows a loading indicator while waiting for the bot's response.
*   **Error Handling**: Displays user-friendly error messages for issues like network errors, failed message sending, etc.
*   **Markdown Support**: Renders the bot's responses as Markdown, allowing for formatted text, lists, and links.

---
### 4.12. Weather Page (`src/app/services/weather/page.js`)

This page is the entry point for the Weather Forecasts service.

**Functionality:**

*   It renders the `Weather` component, which provides the weather forecast and farming advice.

### 4.13. Weather Component (`src/components/pages/Weather.jsx`)

This component is the core of the weather service. It provides a comprehensive weather dashboard with farming insights.

**Key Features:**

*   **Weather Data**:
    *   Fetches and displays current weather conditions (temperature, humidity, wind speed, etc.).
    *   Fetches and displays a 7-day weather forecast.
*   **Farming Advice**:
    *   Sends the weather data to the `/api/farming-advice` endpoint to get AI-powered farming recommendations.
    *   Displays the recommendations and any weather alerts.
*   **Location Services**:
    *   Allows users to search for a location to get the weather forecast.
    *   Uses a default location on initial load.
*   **Internationalization (i18n)**:
    *   Supports multiple Indian languages for the entire UI.
    *   Includes a language selector for users to switch languages.
*   **User Interface**:
    *   A clean and intuitive dashboard to visualize weather data.
    *   Expandable sections for the weekly forecast and farming insights.
*   **Error Handling**: Provides feedback to the user in case of errors while fetching data.

---
### 4.14. Calendar Page (`src/app/services/calender/page.js`)

This page is the entry point for the Crop Calendar service.

**Functionality:**

*   It renders the `Calender` component, which provides the crop calendar functionality.

### 4.15. Calender Component (`src/components/pages/Calender.jsx`)

This component provides a visual crop calendar to help farmers plan their planting and harvesting schedules.

**Key Features:**

*   **Regional Recommendations**:
    *   Allows users to enter their location in India to receive a customized list of recommended vegetables.
    *   Fetches this data from the `/api/cal` endpoint.
*   **Interactive Calendar**:
    *   Displays a table of vegetables with a 12-month calendar view.
    *   Uses icons to indicate the optimal planting (🌱) and harvesting (🧺) times for each vegetable.
    *   Highlights the current month for easy reference.
*   **User-Friendly Interface**:
    *   Includes a search bar for location input.
    *   Provides a legend to explain the calendar icons.
    *   Shows a default set of vegetables before a location is specified.
*   **Error Handling**: Displays an error message if the crop recommendations cannot be fetched.

---
### 4.16. Market Insights Page (`src/app/services/market/page.js`)

This page is the entry point for the Market Insights service.

**Functionality:**

*   It renders the `MarketInsights` component, which provides information about crop prices.

### 4.17. MarketInsights Component (`src/components/pages/MarketInsights.jsx`)

This component displays market price information for various crops in different Indian regions.

**Key Features:**

*   **Crop Prices**:
    *   Displays a table of crop prices for a selected location.
    *   Currently uses a hardcoded data object (`cropPriceData`) for demonstration purposes.
*   **Location Search**:
    *   Includes a search bar that allows users to search for a location and view the corresponding crop prices.
    *   Loads the data for "Delhi" by default.
*   **User Interface**:
    *   A clear and simple interface to view crop prices.
    *   Includes a button to sign up for price alerts.
*   **Loading State**: Shows a loading indicator while fetching the data.

---
### 4.18. Schemes Page (`src/app/services/schemes/page.js`)

This page displays a list of government agricultural schemes.

**Functionality:**

*   **Fetches Schemes**: It fetches a list of schemes from the `/api/schemes` endpoint on component mount.
*   **Displays Schemes**: It renders the list of schemes, showing the title, description, and a link to the scheme details for each.

---

## 5. Backend

The backend of the CropCare application is built with Next.js API routes. The API routes are located in the `src/app/api` directory.

### 5.1. API Endpoints

This section provides a detailed description of each API endpoint.

#### 5.1.1. `POST /api/cal`

**File:** `src/app/api/cal/route.js`

**Description:**

This endpoint provides crop recommendations for a specific location. It uses Google's Generative AI to generate the recommendations based on a predefined list of crops for different regions in India.

**Request Body:**

*   `location` (string, required): The name of the location for which to get crop recommendations.

**Response (200 OK):**

An array of `Crop` objects.

**Error Responses:**

*   **400 Bad Request**: If the `location` is not provided in the request body.
*   **500 Internal Server Error**: If there is an error generating the recommendations.

#### 5.1.2. `GET /api/community/posts`

**File:** `src/app/api/community/posts/route.js`

**Description:**

This endpoint retrieves a list of community posts from the `src/assests/posts.json` file. It supports filtering by category and post type, sorting by "recent" or "popular", and pagination.

**Query Parameters:**

*   `category` (string, optional): Filters posts by category.
*   `postType` (string, optional): Filters posts by type.
*   `sortBy` (string, optional): Sorts posts by "recent" or "popular".
*   `page` (number, optional): The page number for pagination.
*   `limit` (number, optional): The number of posts per page.

**Response (200 OK):**

A JSON object containing the posts and pagination information.

**Error Responses:**

*   **500 Internal Server Error**: If there is an error reading the `posts.json` file.

#### 5.1.3. `POST /api/community/posts`

**File:** `src/app/api/community/posts/route.js`

**Description:**

This endpoint creates a new community post and saves it to the `src/assests/posts.json` file.

**Request Body:**

A `Post` object without the `id`, `authorReputation`, `upvotes`, `downvotes`, `comments`, `createdAt`, `updatedAt`, and `edited` fields.

**Response (201 Created):**

The newly created `Post` object.

**Error Responses:**

*   **400 Bad Request**: If any of the required fields are missing in the request body.
*   **500 Internal Server Error**: If there is an error writing to the `posts.json` file.

#### 5.1.4. `POST /api/farming-advice`

**File:** `src/app/api/farming-advice/route.js`

**Description:**

This endpoint provides farming advice based on weather data for a specific location and in a specific language. It uses Google's Generative AI to generate the advice.

**Request Body:**

*   `weatherData` (object, required): The weather data for the location.
*   `language` (string, required): The language in which to generate the advice.
*   `location` (string, required): The name of the location.

**Response (200 OK):**

A JSON object containing a summary, recommendations, and alerts.

**Error Responses:**

*   **400 Bad Request**: If `weatherData` or `location` is not provided.
*   **500 Internal Server Error**: If there is an error generating the advice.

#### 5.1.5. `GET /api/geocode`

**File:** `src/app/api/geocode/route.js`

**Description:**

This endpoint geocodes a location using the Open-Meteo Geocoding API.

**Query Parameters:**

*   `q` (string, required): The location name to geocode.

**Response (200 OK):**

An array of location objects.

**Error Responses:**

*   **400 Bad Request**: If the `q` query parameter is not provided.
*   **500 Internal Server Error**: If there is an error fetching the geocoding data.

#### 5.1.6. `POST /api/response`

**File:** `src/app/api/response/route.js`

**Description:**

This is the main endpoint for the AI chatbot. It takes a user's prompt (text and/or image) and returns a response from the AI. It also manages the chat history in the Supabase database.

**Request Body:**

*   `prompt` (string, optional): The user's text message.
*   `image` (string, optional): A base64 encoded image.
*   `chatSessionId` (string, required): The ID of the chat session.
*   `clerkUserId` (string, required): The ID of the logged-in user.
*   `language` (string, optional): The language of the conversation.
*   `location` (string, optional): The user's location.

**Response (200 OK):**

A JSON object containing the chatbot's response.

**Error Responses:**

*   **400 Bad Request**: If required parameters are missing.
*   **500 Internal Server Error**: If there is an error processing the request.

#### 5.1.7. `GET /api/schemes`

**File:** `src/app/api/schemes/route.js`

**Description:**

This endpoint scrapes the "myscheme.gov.in" website for agricultural schemes and saves them to the `schemes_notifications` table in the Supabase database.

**Response (200 OK):**

A JSON object indicating the success of the operation and the scraped schemes.

**Error Responses:**

*   **500 Internal Server Error**: If there is an error scraping the website or saving the data.

#### 5.1.8. `GET /api/weather`

**File:** `src/app/api/weather/route.js`

**Description:**

This endpoint retrieves weather information for a specific location using the Open-Meteo API.

**Query Parameters:**

*   `lat` (number, required): The latitude of the location.
*   `lon` (number, required): The longitude of the location.

**Response (200 OK):**

A `Weather` object containing the current weather and a 7-day forecast.

**Error Responses:**

*   **400 Bad Request**: If `lat` or `lon` are not provided.
*   **500 Internal Server Error**: If there is an error fetching the weather data.