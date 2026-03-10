# Pagination

A lightweight, framework-agnostic JavaScript library for generating pagination items with powerful customization options.

## Features

- 🎯 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- ⚙️ **Highly Configurable** - Customize every aspect of your pagination
- 📦 **Lightweight** - Small bundle size with zero dependencies
- 🔄 **Flexible Output** - Detailed pagination items with multiple types

## Installation

```bash
npm install @lucasmogari/pagination
```

Or with your preferred package manager:

```bash
yarn add @lucasmogari/pagination
pnpm add @lucasmogari/pagination
```

## Quick Start

```javascript
import pagination from '@lucasmogari/pagination';

const items = pagination(
  1,      // current page
  100,    // total items
  (item) => item,
  {
    itemsPerPage: 10,
    maxPageItems: 7,
    numbers: true,
    arrows: true,
    first: true,
    last: true,
  }
);
```

## Usage with React

```javascript
import { useState } from 'react';
import pagination from '@lucasmogari/pagination';

export function Pagination({ totalItems }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const items = pagination(currentPage, totalItems, (item) => item, {
    itemsPerPage: 10,
    maxPageItems: 7,
    numbers: true,
    arrows: true,
    first: true,
    last: true,
  });

  return (
    <nav>
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => item.page && setCurrentPage(item.page)}
          disabled={!item.page}
          className={item.current ? 'active' : ''}
        >
          {item.type === 'gap' ? '...' : item.page || 
            (item.type === 'previous' ? '←' : '→')}
        </button>
      ))}
    </nav>
  );
}
```

## API

### `pagination(page, totalItems, callback, options)`

Returns an array of pagination items based on the provided options.

**Parameters:**
- `page` (number) - Current page number (1-indexed)
- `totalItems` (number) - Total number of items to paginate
- `callback` (function) - Callback function that receives each pagination item
- `options` (object) - Configuration options

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `itemsPerPage` | number | 1 | Items displayed per page |
| `maxPageItems` | number | 1 | Maximum page items to display |
| `numbers` | boolean | false | Show page number items |
| `arrows` | boolean | false | Show previous/next arrows |
| `first` | boolean | false | Show first page button |
| `last` | boolean | false | Show last page button |
| `gapValues` | boolean | false | Include page numbers in gap items |

**Item Types:**
```typescript
type PageItem =
  | { type: 'page'; page: number; current?: boolean }
  | { type: 'previous'; page?: number }
  | { type: 'next'; page?: number }
  | { type: 'gap'; pages?: number[] }
  | { type: 'first'; page: number; current?: boolean }
  | { type: 'last'; page: number; current?: boolean };
```

## License

MIT © [Lucas Mogari](https://github.com/lucasmogari)
