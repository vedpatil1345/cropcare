---
sidebar_position: 4
---

# CreatePostForm

The `CreatePostForm` component provides a form for users to create new posts in the community forum.

## Usage

```jsx
import CreatePostForm from '@/components/CreatePostForm';

const CreatePostPage = () => {
  return <CreatePostForm />;
};
```

## State

*   `formData`: An object that holds the form data, including `title`, `content`, `category`, `tags`, and `postType`.
*   `loading`: A boolean that indicates whether the form is being submitted.

## Functionality

*   **Form Submission:** Creates a new post object and saves it to local storage.
*   **Routing:** Redirects the user to the community page after the post is created.
