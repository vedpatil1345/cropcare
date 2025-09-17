---
sidebar_position: 1
---

# CategoryList

The `CategoryList` component displays a list of categories for the community forum. It allows users to search and sort the categories.

## Usage

```jsx
import CategoryList from '@/components/CategoryList';

const CommunityPage = () => {
  return <CategoryList />;
};
```

## Props

This component does not accept any props.

## State

*   `categories`: An array of category objects, each containing `id`, `name`, `description`, `icon`, `posts`, `members`, `color`, `iconBg`, and `recent` topics.
*   `sortBy`: A string that determines the sorting order of the categories. It can be `'posts'`, `'members'`, or `'name'`.
*   `searchTerm`: A string that holds the user's search input.

## Functionality

*   **Search:** Users can search for categories by name or description.
*   **Sorting:** Users can sort categories by the number of posts, number of members, or alphabetically by name.
*   **Routing:** Clicking on a category navigates the user to the corresponding category page.
