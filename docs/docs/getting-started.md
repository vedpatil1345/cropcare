---
sidebar_position: 2
---

# Getting Started

This guide will walk you through setting up your local development environment and running the CropCare application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (version 18.x or later)
*   [npm](https://www.npmjs.com/) (or [yarn](https://yarnpkg.com/))

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd cropcare
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

## Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file in the root of the project and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

Replace `your-supabase-url`, `your-supabase-anon-key`, `your-clerk-publishable-key`, and `your-clerk-secret-key` with your actual Supabase and Clerk credentials.

## Running the Application

Once you have installed the dependencies and configured the environment variables, you can run the application with the following command:

```bash
npm run dev
# or
yarn dev
```

This will start the development server at `http://localhost:3000`. You can now access the application in your web browser.

## Building for Production

To create a production build, run the following command:

```bash
npm run build
# or
yarn build
```

This will generate an optimized production build in the `.next` directory.
