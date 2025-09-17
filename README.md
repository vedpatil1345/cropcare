# CropCare

CropCare is a comprehensive web application designed to assist farmers by providing them with a suite of tools and information to improve their farming practices. Built with Next.js and leveraging modern technologies, CropCare aims to be a one-stop solution for farmers to get personalized advice, connect with a community, and stay updated with the latest information.

## About The Project

This project is a web platform for farmers that provides the following features:
*   **Personalized Farming Advice**: Get AI-powered farming advice tailored to your location and weather conditions.
*   **Community Forum**: Connect with other farmers, ask questions, and share your knowledge and experiences.
*   **Market Insights**: Stay informed about the latest market prices and trends for various crops.
*   **Weather Forecasts**: Get real-time weather updates and forecasts for your location.
*   **Government Schemes**: Discover and learn about various government schemes and subsidies for farmers.
*   **Crop Calendar**: A personalized calendar to help you manage your crop cycles effectively.
*   **AI Chatbot**: An intelligent chatbot to answer all your farming-related questions.

## Features

*   **Authentication**: Secure user authentication and management powered by Clerk, ensuring that user data is safe and private.
*   **Community Forum**: A feature-rich forum where users can:
    *   Create, read, update, and delete posts.
    *   Browse posts by categories like "Pest Control", "Seeds & Planting", etc.
    *   Upvote and downvote posts to highlight valuable content.
    *   Comment on posts to engage in discussions.
*   **Market Insights**: Provides up-to-date information on crop prices and market trends, helping farmers make informed decisions about selling their produce.
*   **Weather Information**: Integrated with the Open-Meteo API, it provides accurate and real-time weather forecasts, including temperature, humidity, wind speed, and precipitation probability.
*   **Government Schemes**: Automatically scrapes and displays the latest agricultural schemes from the Indian government's official portal, ensuring farmers have access to beneficial programs.
*   **AI-Powered Farming Advice**: Utilizes Google's Generative AI to provide farming advice based on weather data, location, and language. The advice is tailored to the specific needs of the farmer.
*   **Personalized Crop Calendar**: Get recommendations for crops to grow based on your location, along with a calendar for planting and harvesting.
*   **Intelligent Chatbot**: A conversational AI, powered by Google's Generative AI and Supabase for chat history, that can answer a wide range of farming-related questions, analyze plant images for diseases, and provide solutions.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/cropcare.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables by creating a `.env.local` file in the root of your project and adding the following:
    ```env
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key

    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key
    ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode using Turbopack.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `.next` folder.

### `npm run start`

Starts the application in production mode.

### `npm run lint`

Runs the linter to check for code quality issues.

## Technologies Used

*   **[Next.js](https://nextjs.org/)**: The React framework for building full-stack web applications.
*   **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
*   **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
*   **[Supabase](https://supabase.io/)**: Used as a backend for storing chat history and government schemes.
*   **[Clerk](https://clerk.dev/)**: For user authentication and management.
*   **[Google Generative AI](https://ai.google.com/discover/generativeai)**: Powers the AI chatbot and farming advice features.
*   **[Shadcn/ui](https://ui.shadcn.com/)**: A collection of re-usable UI components.
*   **[Open-Meteo](https://open-meteo.com/)**: Provides weather and geocoding APIs.

## API Documentation

The API documentation has been moved to a separate file. Please see [API.md](API.md) for details.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
