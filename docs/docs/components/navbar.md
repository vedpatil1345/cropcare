---
sidebar_position: 9
---

# Navbar

The `Navbar` component displays the navigation bar for the services section of the application.

## Usage

```jsx
import Navbar from '@/components/Navbar';

const ServicesLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};
```

## Functionality

*   **Conditional Rendering:** The navigation bar is not rendered on the community page.
*   **Authentication:** Displays a `UserButton` for authenticated users.
*   **Mobile Menu:** Provides a mobile-friendly navigation menu.
