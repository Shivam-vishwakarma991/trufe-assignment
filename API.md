# API Documentation

## Overview

The Marketplace Catalog application uses Next.js App Router with server-side rendering (SSR) and static site generation (SSG). All data fetching happens on the server through Prisma ORM, with no traditional REST API endpoints exposed. This document describes the available routes, data models, and service interfaces.

## Routes

### Catalog Routes

#### GET /catalog

Main catalog page with faceted search and filtering capabilities.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `q` | string | No | - | Search query for keyword matching |
| `category` | string | No | - | Filter by category slug |
| `location` | string | No | - | Filter by location slug |
| `min` | number | No | 0 | Minimum price filter |
| `max` | number | No | - | Maximum price filter |
| `page` | number | No | 1 | Page number for pagination |
| `limit` | number | No | 20 | Items per page (max: 100) |

**Validation Rules:**
- `q`: Max 200 characters, trimmed
- `category`: Max 100 characters, trimmed
- `location`: Max 100 characters, trimmed
- `min`: 0 ≤ min ≤ 1,000,000
- `max`: 0 ≤ max ≤ 1,000,000, must be ≥ min
- `page`: 1 ≤ page ≤ 1,000
- `limit`: 1 ≤ limit ≤ 100

**Example Requests:**

```bash
# Basic catalog view
GET /catalog

# Search with keyword
GET /catalog?q=laptop

# Filter by category
GET /catalog?category=electronics

# Filter by price range
GET /catalog?min=100&max=500

# Combined filters
GET /catalog?q=laptop&category=electronics&min=500&max=1500&location=new-york

# Pagination
GET /catalog?page=2&limit=20
```

**Response:**

Server-rendered HTML page with:
- Product grid displaying matching items
- Filter sidebar with available options
- Active filter pills
- Pagination controls
- SEO metadata (title, description, canonical URL)

#### GET /catalog/[id]

Product detail page for a specific item.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID (CUID format) |

**Example Requests:**

```bash
# View product details
GET /catalog/clh1234567890abcdefghij
```

**Response:**

Server-rendered HTML page with:
- Product image gallery
- Product information (title, description, price, category, location)
- SEO metadata with structured data
- Breadcrumb navigation

**Error Handling:**
- Returns 404 page if product not found
- Displays custom not-found component

#### GET /search

Search redirect route that forwards to /catalog with query parameters.

**Query Parameters:**

Same as `/catalog` route.

**Behavior:**

Performs a 307 (Temporary Redirect) to `/catalog` with the same query parameters.

**Example:**

```bash
# Request
GET /search?q=laptop&category=electronics

# Redirects to
GET /catalog?q=laptop&category=electronics
```

## Data Models

### Product

Represents a marketplace item/product.

**Schema:**

```typescript
interface Product {
  id: string;              // CUID identifier
  title: string;           // 1-200 characters
  description: string;     // 1-2000 characters
  price: number;           // 0-1,000,000
  category: string;        // Category name
  location: string;        // Location name
  images: string;          // JSON string array of URLs
  slug: string;            // URL-friendly identifier (lowercase, hyphens)
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

**Database Indexes:**
- `category` - For category filtering
- `location` - For location filtering
- `price` - For price range queries
- `createdAt` - For sorting by date

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Required, 1-2000 characters
- `price`: Required, non-negative, max 1,000,000
- `category`: Required, 1-100 characters
- `location`: Required, 1-100 characters
- `images`: JSON array of 1-10 valid URLs
- `slug`: Required, lowercase letters, numbers, hyphens only

### Category

Represents a product category.

**Schema:**

```typescript
interface Category {
  id: string;    // CUID identifier
  name: string;  // Display name (1-100 characters)
  slug: string;  // URL-friendly identifier (unique)
}
```

**Validation Rules:**
- `name`: Required, unique, 1-100 characters
- `slug`: Required, unique, lowercase letters, numbers, hyphens only

### Location

Represents a geographic location.

**Schema:**

```typescript
interface Location {
  id: string;    // CUID identifier
  name: string;  // Display name (1-100 characters)
  slug: string;  // URL-friendly identifier (unique)
}
```

**Validation Rules:**
- `name`: Required, unique, 1-100 characters
- `slug`: Required, unique, lowercase letters, numbers, hyphens only

### SearchParams

Query parameters for catalog search and filtering.

**Schema:**

```typescript
interface SearchParams {
  q?: string;         // Search query
  category?: string;  // Category filter
  min?: number;       // Minimum price
  max?: number;       // Maximum price
  location?: string;  // Location filter
  page?: number;      // Page number (default: 1)
  limit?: number;     // Items per page (default: 20)
}
```

### SearchResult

Result object returned by search service.

**Schema:**

```typescript
interface SearchResult {
  products: Product[];     // Array of matching products
  totalCount: number;      // Total number of matches
  facets: {
    categories: Array<{
      name: string;        // Category name
      count: number;       // Number of products in category
    }>;
    locations: Array<{
      name: string;        // Location name
      count: number;       // Number of products in location
    }>;
    priceRange: {
      min: number;         // Minimum price in results
      max: number;         // Maximum price in results
    };
  };
}
```

### FilterState

Current state of applied filters.

**Schema:**

```typescript
interface FilterState {
  query: string;           // Search query (default: "")
  category: string;        // Selected category (default: "")
  priceRange: {
    min: number;           // Minimum price (default: 0)
    max: number;           // Maximum price (default: 0)
  };
  location: string;        // Selected location (default: "")
}
```

## Services

### Search Service

Located at: `src/services/searchService.ts`

#### searchProducts()

Performs keyword search across product titles and descriptions.

**Signature:**

```typescript
async function searchProducts(
  query: string,
  options?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    page?: number;
    limit?: number;
  }
): Promise<SearchResult>
```

**Parameters:**
- `query`: Search keyword(s)
- `options`: Optional filtering and pagination parameters

**Returns:**
- `SearchResult` object with products, count, and facets

**Behavior:**
- Searches product titles and descriptions (case-insensitive)
- Applies category, price, and location filters if provided
- Returns paginated results
- Includes facet counts for available filters

### Filter Service

Located at: `src/services/filterService.ts`

#### filterProducts()

Filters products based on multiple criteria.

**Signature:**

```typescript
async function filterProducts(
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  },
  options?: {
    page?: number;
    limit?: number;
  }
): Promise<SearchResult>
```

**Parameters:**
- `filters`: Filter criteria object
- `options`: Pagination parameters

**Returns:**
- `SearchResult` object with filtered products

**Behavior:**
- Applies all provided filters using AND logic
- Returns paginated results
- Includes facet counts for remaining filter options

#### getCategories()

Retrieves all available categories.

**Signature:**

```typescript
async function getCategories(): Promise<Category[]>
```

**Returns:**
- Array of all categories

#### getLocations()

Retrieves all available locations.

**Signature:**

```typescript
async function getLocations(): Promise<Location[]>
```

**Returns:**
- Array of all locations

#### getPriceRange()

Gets the minimum and maximum prices across all products.

**Signature:**

```typescript
async function getPriceRange(): Promise<{ min: number; max: number }>
```

**Returns:**
- Object with min and max price values

### Pagination Service

Located at: `src/services/paginationService.ts`

#### calculatePagination()

Calculates pagination metadata.

**Signature:**

```typescript
function calculatePagination(
  totalCount: number,
  currentPage: number,
  pageSize: number
): {
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}
```

**Parameters:**
- `totalCount`: Total number of items
- `currentPage`: Current page number (1-indexed)
- `pageSize`: Items per page

**Returns:**
- Pagination metadata object

## Validation

### Input Validation

All user inputs are validated using Zod schemas before processing.

**Validation Functions:**

```typescript
// Validate search parameters
function validateSearchParams(params: unknown): SearchParams

// Validate product data
function validateProduct(data: unknown): Product

// Validate product input (for creation/updates)
function validateProductInput(data: unknown): ProductInput
```

**Error Handling:**

Validation errors throw `ValidationError` with details:

```typescript
interface ValidationError {
  message: string;
  code: 'VALIDATION_ERROR';
  details: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}
```

### Sanitization

All string inputs are sanitized to prevent XSS and injection attacks.

**Sanitization Functions:**

```typescript
// Sanitize general string input
function sanitizeString(input: string, maxLength?: number): string

// Sanitize search query
function sanitizeSearchQuery(query: string): string

// Sanitize numeric input
function sanitizeNumber(input: unknown, min?: number, max?: number): number

// Sanitize entire object recursively
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown>
```

## Error Handling

### Error Types

**ValidationError**
- Code: `VALIDATION_ERROR`
- Thrown when input validation fails
- Includes field-level error details

**SearchError**
- Code: `SEARCH_ERROR`
- Thrown when search operation fails

**DatabaseError**
- Code: `DATABASE_ERROR`
- Thrown when database operation fails

### Error Responses

Errors are handled gracefully with fallback UI:

- **Validation Errors**: Display inline error messages
- **Search Errors**: Show error state component
- **Database Errors**: Display generic error message
- **404 Errors**: Show custom not-found page

## URL Structure

### Catalog URLs

Clean, SEO-friendly URLs with query parameters:

```
/catalog                                    # All products
/catalog?q=laptop                          # Search
/catalog?category=electronics              # Category filter
/catalog?min=100&max=500                   # Price range
/catalog?location=new-york                 # Location filter
/catalog?q=laptop&category=electronics     # Combined filters
/catalog?page=2                            # Pagination
```

### Product URLs

```
/catalog/[product-id]                      # Product detail page
```

### Canonical URLs

Canonical URLs exclude pagination parameters to prevent duplicate content:

```html
<!-- Page 1 -->
<link rel="canonical" href="https://example.com/catalog?category=electronics" />

<!-- Page 2 (same canonical) -->
<link rel="canonical" href="https://example.com/catalog?category=electronics" />
```

## SEO Metadata

### Catalog Pages

**Dynamic Title Generation:**
```
[Query] in [Category] - [Location] | Marketplace
```

**Dynamic Description:**
```
Browse [count] products [in category] [in location] [price range]
```

**Example:**
```html
<title>Laptops in Electronics - New York | Marketplace</title>
<meta name="description" content="Browse 42 products in Electronics in New York from $500 to $1500" />
```

### Product Pages

**Title Format:**
```
[Product Title] - [Category] | Marketplace
```

**Description:**
```
[Product Description (truncated to 160 chars)]
```

**Structured Data:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Title",
  "description": "Product Description",
  "offers": {
    "@type": "Offer",
    "price": "999.99",
    "priceCurrency": "USD"
  }
}
```

## Performance Considerations

### Caching

- **Static Data**: Categories and locations cached with ISR
- **Database Queries**: Optimized with proper indexes
- **Images**: Optimized using Next.js Image component

### Query Optimization

- Indexed fields: category, location, price, createdAt
- Pagination limits: Max 100 items per page
- Facet counting: Efficient aggregation queries

### Rate Limiting

Recommended rate limits (not implemented by default):
- Search queries: 100 requests per minute per IP
- Product detail views: 200 requests per minute per IP

## Security

### Input Validation

- All inputs validated server-side with Zod
- SQL injection prevented by Prisma ORM
- XSS prevented by React and sanitization

### Data Protection

- No PII stored or exposed
- Search queries sanitized
- Environment variables for sensitive config

### Headers

Security headers configured in `next.config.js`:
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

## Examples

### Complete Search Flow

```typescript
// 1. User enters search query
const searchParams = { q: 'laptop', category: 'electronics', min: 500, max: 1500 };

// 2. Validate parameters
const validated = validateSearchParams(searchParams);

// 3. Execute search
const results = await searchProducts(validated.q, {
  category: validated.category,
  minPrice: validated.min,
  maxPrice: validated.max,
  page: validated.page,
  limit: validated.limit,
});

// 4. Render results
// - Display products in grid
// - Show active filters
// - Render pagination
// - Update URL with parameters
```

### Filter Application

```typescript
// 1. User selects category filter
const newFilters = { ...currentFilters, category: 'electronics' };

// 2. Build new URL
const url = buildCatalogUrl(baseUrl, newFilters);

// 3. Navigate to new URL
router.push(url);

// 4. Server re-renders with new filters
```

### Product Detail View

```typescript
// 1. User clicks product
// Navigates to /catalog/[id]

// 2. Server fetches product
const product = await prisma.product.findUnique({
  where: { id: params.id }
});

// 3. Generate metadata
const metadata = {
  title: `${product.title} - ${product.category}`,
  description: product.description.slice(0, 160),
};

// 4. Render product detail page
```

## Testing

### Unit Tests

Test individual service functions:

```typescript
describe('searchProducts', () => {
  it('should return products matching query', async () => {
    const results = await searchProducts('laptop');
    expect(results.products).toBeDefined();
    expect(results.totalCount).toBeGreaterThan(0);
  });
});
```

### Integration Tests

Test complete flows:

```typescript
describe('Catalog Page', () => {
  it('should render filtered results', async () => {
    const searchParams = { category: 'electronics' };
    const page = await CatalogPage({ searchParams });
    // Assert page renders correctly
  });
});
```

## Troubleshooting

### Common Issues

**Issue: Search returns no results**
- Check if database is seeded
- Verify search query is not empty
- Check filter combinations are valid

**Issue: Validation errors**
- Ensure parameters are within valid ranges
- Check min ≤ max for price range
- Verify string lengths are within limits

**Issue: Slow queries**
- Check database indexes are created
- Verify pagination is being used
- Consider adding more specific filters

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [Project README](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)
