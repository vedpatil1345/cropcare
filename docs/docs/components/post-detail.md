---
sidebar_position: 11
---

# PostDetail

The `PostDetail` component displays the full details of a single post.

## Usage

```jsx
import PostDetail from '@/components/PostDetail';

const PostPage = ({ postId }) => {
  return <PostDetail postId={postId} />;
};
```

## Props

*   `postId` (string): The ID of the post to display.

## State

*   `post`: The post object.
*   `loading`: A boolean that indicates whether the post is being loaded.

## Functionality

*   **Data Fetching:** Fetches the post data from a mock API.
*   **Voting:** Allows users to upvote and downvote the post.
*   **Actions:** Provides buttons for sharing and bookmarking the post.
