# Design Document

## Overview

The marketplace catalog system is built as a Next.js application using the App Router with TypeScript. The architecture emphasizes server-side rendering for SEO optimization, URL-based state management for deep linking, and a component-based design for maintainability. The system uses a modern tech stack with Prisma/SQLite for data persistence, Tailwind CSS for styling, and implements comprehensive validation and security measures.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    A[Client Browser] --> B[Next.js App Router]
    B --> C[Catalog Pages /catalog]
    B --> D[Detail Pages /catalog/[id]]
    B --> E[Search Redirect /search]
    
    C --> F[Server Components]
    D --> F
    F --> G[Data Layer]
    G --> H[Prisma ORM]
    H --> I[SQLite Database]
    
    F --> J[Validation Layer]
    F --> K[Search Service]
    F --> L[Filter Service]
    
    subgraph "Client-Side"
        M[Filter Components]
        N[Search Components]
        O[Pagination Components]
    end
    
    A --> M
    A --> N
    A --> O
```

### Technology Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with server actions
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod for schema validation
- **State Management**: URL-based state with Next.js searchParams
- **Testing**: Jest with React Testing Library
- **Deployment**: Vercel (recommended) or similar platform

### Rendering Strategy

- **Catalog Pages (/catalog)**: Server-Side Rendering (SSR) for dynamic filtering and SEO
- **Detail Pages (/catalog/[id])**: Static Site Generation (SSG) with Incremental Static Regeneration (ISR)
- **Search Redirect (/search)**: Server-side redirect to maintain SEO

## Components and Interfaces

### Core Components

#### 1. Catalog Page Component
```typescript
interface CatalogPageProps {
  searchParams: {
    q?: string;
    category?: string;
    min?: string;
    max?: string;
    location?: string;
    page?: string;
  };
}

// Server Component for SSR
export default async function CatalogPage({ searchParams }: CatalogPageProps)
```

#### 2. Filter Components
```typescript
interface FilterState {
  query: string;
  category: string;
  priceRange: { min: number; max: number };
  location: string;
}

interface FilterSidebarProps {
  currentFilters: FilterState;
  categories: Category[];
  locations: Location[];
  priceRange: { min: number; max: number };
}
```

#### 3. Product Components
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  createdAt: Date;
}

interface ProductCardProps {
  product: Product;
  prefetchOnHover?: boolean;
}

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
}
```

#### 4. Search and Filter Services
```typescript
interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
}

interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: {
    categories: { name: string; count: number }[];
    locations: { name: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}
```

### Component Hierarchy

```
app/
├── catalog/
│   ├── page.tsx (SSR Catalog Page)
│   └── [id]/
│       └── page.tsx (SSG Detail Page)
├── search/
│   └── page.tsx (Redirect to catalog)
└── components/
    ├── catalog/
    │   ├── ProductGrid.tsx
    │   ├── ProductCard.tsx
    │   ├── FilterSidebar.tsx
    │   ├── FilterPills.tsx
    │   ├── SearchBar.tsx
    │   └── Pagination.tsx
    ├── product/
    │   ├── ProductDetail.tsx
    │   ├── ProductGallery.tsx
    │   └── ProductInfo.tsx
    └── ui/
        ├── LoadingSpinner.tsx
        ├── EmptyState.tsx
        └── ErrorBoundary.tsx
```

## Data Models

### Database Schema

```prisma
model Product {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  category    String
  location    String
  images      String[] // JSON array of image URLs
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([location])
  @@index([price])
  @@index([createdAt])
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
}

model Location {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
}
```

### Validation Schemas

```typescript
import { z } from 'zod';

export const SearchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
  location: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
}).refine((data) => {
  if (data.min !== undefined && data.max !== undefined) {
    return data.min <= data.max;
  }
  return true;
}, {
  message: "Minimum price must be less than or equal to maximum price",
});

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().min(0),
  category: z.string().min(1),
  location: z.string().min(1),
  images: z.array(z.string().url()),
  slug: z.string().min(1),
});
```

## Error Handling

### Client-Side Error Handling

1. **Form Validation Errors**: Real-time validation feedback using Zod schemas
2. **Network Errors**: Retry mechanisms with exponential backoff
3. **Loading States**: Skeleton components and loading spinners
4. **Empty States**: Meaningful messages when no results are found

### Server-Side Error Handling

1. **Input Validation**: All query parameters validated using Zod schemas
2. **Database Errors**: Graceful handling with fallback responses
3. **Rate Limiting**: Implement rate limiting middleware for search endpoints
4. **Error Logging**: Structured logging for debugging and monitoring

### Error Boundary Implementation

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CatalogErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  // Error boundary implementation for graceful error handling
}
```

## Testing Strategy

### Unit Testing
- **Components**: Test rendering, props handling, and user interactions
- **Services**: Test search logic, filtering, and data transformation
- **Validation**: Test schema validation and error cases
- **Utilities**: Test helper functions and data formatting

### Integration Testing
- **API Routes**: Test search endpoints with various parameter combinations
- **Database Operations**: Test CRUD operations and query performance
- **Filter Logic**: Test complex filter combinations and edge cases

### End-to-End Testing
- **User Flows**: Test complete search and filter workflows
- **SEO**: Validate meta tags, structured data, and URL generation
- **Accessibility**: Test keyboard navigation and screen reader compatibility
- **Performance**: Test page load times and Core Web Vitals

### Testing Tools
- **Jest**: Unit and integration testing framework
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing (optional)
- **Lighthouse CI**: Automated performance and SEO auditing

## Security Considerations

### Input Validation
- All query parameters validated server-side using Zod schemas
- SQL injection prevention through Prisma ORM parameterized queries
- XSS prevention through proper data sanitization

### Data Protection
- No PII exposure in client-side bundles
- Secure handling of user search queries
- Rate limiting on search endpoints to prevent abuse

### Environment Security
- Environment variables for sensitive configuration
- Secure database connection strings
- HTTPS enforcement in production

## Performance Optimizations

### Server-Side Optimizations
- Database indexing on frequently queried fields
- Query optimization for complex filter combinations
- Response caching for static data (categories, locations)
- Connection pooling for database operations

### Client-Side Optimizations
- Image optimization using Next.js Image component
- Lazy loading for product images and components
- Prefetching for product detail pages on hover
- Debounced search input to reduce API calls

### Caching Strategy
- Static data caching (categories, locations) with ISR
- Search result caching with appropriate TTL
- CDN caching for static assets and images
- Browser caching headers for optimal performance

## SEO Implementation

### Meta Data Generation
```typescript
export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const filters = SearchParamsSchema.parse(searchParams);
  
  return {
    title: generateSEOTitle(filters),
    description: generateSEODescription(filters),
    canonical: generateCanonicalURL(filters),
    openGraph: {
      title: generateSEOTitle(filters),
      description: generateSEODescription(filters),
      type: 'website',
    },
  };
}
```

### URL Structure
- Clean, semantic URLs: `/catalog?category=electronics&min=100&max=500`
- Canonical URLs to prevent duplicate content issues
- Proper URL encoding for special characters
- Breadcrumb navigation for better UX and SEO

### Structured Data
- Product schema markup for individual items
- BreadcrumbList schema for navigation
- SearchAction schema for search functionality