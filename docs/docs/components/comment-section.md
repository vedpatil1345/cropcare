---
sidebar_position: 2
---

# CommentSection

The `CommentSection` component displays a list of comments for a post. It allows users to upvote and downvote comments.

## Usage

```jsx
import CommentSection from '@/components/CommentSection';

const PostPage = ({ postId }) => {
  return <CommentSection postId={postId} />;
};
```

## Props

*   `postId` (string): The ID of the post to display comments for.

## State

*   `comments`: An array of comment objects, each containing `id`, `content`, `author`, `upvotes`, `downvotes`, `createdAt`, and `replies`.

## Functionality

*   **Voting:** Users can upvote and downvote comments.
*   **Replies:** The component can display nested replies to comments.
