---
sidebar_position: 10
---

# PostCard

The `PostCard` component displays a single post in the community feed.

## Usage

```jsx
import PostCard from '@/components/PostCard';

const CommunityFeed = ({ posts }) => {
  return posts.map(post => <PostCard key={post.id} post={post} />);
};
```

## Props

*   `post` (object): The post object to display.

## Functionality

*   **Voting:** Displays the net votes for the post.
*   **Time Ago:** Displays the time since the post was created.
*   **Routing:** Clicking on the post navigates the user to the post detail page.
