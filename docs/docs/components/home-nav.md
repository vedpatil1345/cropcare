---
sidebar_position: 7
---

# HomeNav

The `HomeNav` component displays the main navigation bar for the homepage.

## Usage

```jsx
import HomeNav from '@/components/HomeNav';

const AppLayout = ({ children }) => {
  return (
    <div>
      <HomeNav />
      {children}
    </div>
  );
};
```

## Functionality

*   **Conditional Rendering:** The navigation bar is only rendered on pages that are not under the `/services` route.
*   **Authentication:** Displays "Login" and "Signup" buttons for unauthenticated users, and a `UserButton` for authenticated users.
*   **Mobile Menu:** Provides a mobile-friendly navigation menu.
