---
sidebar_position: 5
---

# FilterTabs

The `FilterTabs` component displays a set of tabs for filtering posts in the community feed.

## Usage

```jsx
import FilterTabs from '@/components/FilterTabs';

const CommunityFeed = () => {
  const [filter, setFilter] = useState('trending');

  return <FilterTabs activeFilter={filter} onFilterChange={setFilter} />;
};
```

## Props

*   `activeFilter` (string): The currently active filter.
*   `onFilterChange` (function): A function to call when a new filter is selected.
