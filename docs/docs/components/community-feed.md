---
sidebar_position: 3
---

# CommunityFeed

The `CommunityFeed` component displays a feed of posts in the community forum.

## Usage

```jsx
import CommunityFeed from '@/components/CommunityFeed';

const CommunityPage = () => {
  return <CommunityFeed />;
};
```

## State

*   `allPosts`: An array of all post objects.
*   `visiblePosts`: An array of the posts currently visible in the feed.
*   `filter`: A string that determines the filter applied to the posts (e.g., `'trending'`, `'new'`).
*   `loading`: A boolean that indicates whether the posts are being loaded.
*   `showingAll`: A boolean that indicates whether all posts are being shown.

## Functionality

*   **Post Loading:** Loads posts from a JSON file and from local storage.
*   **Filtering:** Filters the posts based on the selected filter.
*   **Pagination:** Shows a limited number of posts initially and provides a "Show More" button to load more.
