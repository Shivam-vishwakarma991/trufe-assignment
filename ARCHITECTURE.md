# Architecture Documentation

## Overview

The Marketplace Catalog is a modern web application built with Next.js 14+ using the App Router architecture. It implements a server-first approach with server-side rendering (SSR) for dynamic content and static site generation (SSG) for product detail pages, optimized for SEO and performance.

## Architecture Principles

### 1. Server-First Architecture

**Decision:** Use Next.js App Router with React Server Components as the default rendering strategy.

**Rationale:**
- Better SEO through server-side rendering
- Reduced client-side JavaScript bundle size
- Improved initial page load performance
- Direct database access without API layer overhead
- Simplified data fetching with async/await in components

**Trade-offs:**
- More complex state management for interactive features
- Requires careful consideration of client vs server boundaries
- Learning curve for developers familiar with traditional SPAs

### 2. URL-Based State Management

**Decision:** Store all filter and search state in URL query parameters.

**Rationale:**
- Deep linking support - users can share exact search results
- Browser back/forward navigation works naturally
- No need for complex client-side state management
- SEO-friendly - search engines can index filtered views
- Bookmarkable search results

**Trade-offs:**
- URL can become long with many filters
- Requires careful URL encoding/decoding
- State changes trigger full page navigation (mitigated by Next.js optimizations)

### 3. Database-First Design

**Decision:** Use Prisma ORM with SQLite for development and support for PostgreSQL/MySQL in production.

**Rationale:**
- Type-safe database queries with TypeScript
- Automatic migration generation
- Excellent developer experience with Prisma Studio
- SQLite for zero-config local development
- Easy migration to production databases

**Trade-offs:**
- SQLite limitations for production (single-writer, no full-text search)
- Prisma adds abstraction layer over raw SQL
- Schema changes require migration management

## Technology Stack

### Frontend

#### Next.js 14+ (App Router)

**Why Next.js:**
- Industry-standard React framework
- Built-in SSR and SSG support
- Excellent performance optimizations
- File-based routing
- Image optimization out of the box
- Strong TypeScript support

**Why App Router:**
- Modern React features (Server Components, Suspense)
- Improved data fetching patterns
- Better code organization with colocation
- Streaming and progressive rendering
- Simplified layouts and templates

#### TypeScript

**Why TypeScript:**
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring
- Catches errors at compile time

**Configuration:**
- Strict mode enabled for maximum type safety
- Path aliases for cleaner imports
- Shared types across client and server

#### Tailwind CSS

**Why Tailwind:**
- Utility-first approach speeds up development
- Consistent design system
- Small production bundle (unused styles purged)
- No CSS naming conflicts
- Responsive design made easy

**Configuration:**
- Custom color palette
- Responsive breakpoints
- Dark mode support (future enhancement)

### Backend

#### Prisma ORM

**Why Prisma:**
- Type-safe database client
- Intuitive schema definition
- Automatic migrations
- Excellent TypeScript integration
- Cross-database compatibility

**Schema Design:**
```prisma
model Product {
  id          String   @id @default(cuid())
  title       String
  description String
  price       Float
  category    String
  location    String
  images      String
  slug        String   @unique
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([location])
  @@index([price])
  @@index([createdAt])
}
```

**Indexing Strategy:**
- Indexed fields: category, location, price, createdAt
- Unique constraint on slug for SEO-friendly URLs
- Composite indexes considered for common query patterns

#### SQLite (Development) / PostgreSQL (Production)

**Why SQLite for Development:**
- Zero configuration
- File-based - easy to reset and seed
- Fast for development workloads
- No separate database server needed

**Why PostgreSQL for Production:**
- Better concurrency support
- Full-text search capabilities
- JSON column support
- Proven scalability
- Wide hosting support

#### Zod Validation

**Why Zod:**
- Runtime type validation
- TypeScript-first design
- Composable schemas
- Excellent error messages
- Integration with form libraries

**Validation Strategy:**
- All user inputs validated server-side
- Shared schemas between client and server
- Custom error messages for better UX
- Type inference from schemas

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Catalog  │  │  Product   │  │   Search   │            │
│  │    Page    │  │   Detail   │  │  Redirect  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Server Components (RSC)                │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Catalog  │  │ Product  │  │  Search  │         │    │
│  │  │   Page   │  │   Page   │  │   Page   │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Client Components                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │  Filter  │  │  Search  │  │   Pills  │         │    │
│  │  │ Sidebar  │  │   Bar    │  │          │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Search    │  │    Filter    │  │  Pagination  │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Validation Layer                          │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Zod Schemas                          │      │
│  │  • SearchParams  • Product  • Category           │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Prisma ORM                           │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Database                               │
│  ┌──────────────────────────────────────────────────┐      │
│  │   SQLite (Dev) / PostgreSQL (Prod)               │      │
│  │   • Products  • Categories  • Locations          │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Server Components (Default)

**Used for:**
- Page layouts
- Data fetching
- SEO metadata generation
- Initial page rendering

**Benefits:**
- Zero JavaScript sent to client
- Direct database access
- Automatic code splitting
- Better performance

**Examples:**
- `app/catalog/page.tsx` - Catalog page
- `app/catalog/[id]/page.tsx` - Product detail page
- `app/layout.tsx` - Root layout

#### Client Components

**Used for:**
- Interactive UI elements
- Form inputs
- State management
- Browser APIs

**Marked with:** `'use client'` directive

**Examples:**
- `FilterSidebar.tsx` - Interactive filters
- `SearchBar.tsx` - Search input
- `MobileFilterButton.tsx` - Mobile drawer toggle

### Data Flow

#### Catalog Page Flow

```
1. User navigates to /catalog?category=electronics
                    ↓
2. Next.js App Router matches route
                    ↓
3. Server Component receives searchParams
                    ↓
4. Validate searchParams with Zod
                    ↓
5. Call searchService.searchProducts()
                    ↓
6. Prisma queries database with filters
                    ↓
7. Return SearchResult with products and facets
                    ↓
8. Generate SEO metadata
                    ↓
9. Render HTML with Server Components
                    ↓
10. Hydrate Client Components on browser
                    ↓
11. User interacts with filters
                    ↓
12. Update URL and trigger re-render
```

#### Product Detail Flow

```
1. User clicks product or navigates to /catalog/[id]
                    ↓
2. Next.js matches dynamic route
                    ↓
3. Server Component receives params.id
                    ↓
4. Query product from database
                    ↓
5. If not found, return 404
                    ↓
6. Generate metadata with product info
                    ↓
7. Render product detail page (SSG/ISR)
                    ↓
8. Client receives fully rendered HTML
```

## Design Patterns

### 1. Service Layer Pattern

**Implementation:**
- Separate business logic from UI components
- Services handle data fetching and transformation
- Reusable across different pages

**Structure:**
```
src/services/
├── searchService.ts    # Search functionality
├── filterService.ts    # Filtering logic
├── paginationService.ts # Pagination calculations
└── index.ts            # Exports
```

**Benefits:**
- Testable business logic
- Separation of concerns
- Easier to maintain and refactor

### 2. Validation Layer Pattern

**Implementation:**
- Centralized validation schemas
- Shared between client and server
- Type inference from schemas

**Structure:**
```
src/lib/validations.ts
├── Schemas (Zod)
├── Type exports
├── Validation functions
└── Sanitization utilities
```

**Benefits:**
- Single source of truth for validation
- Type safety throughout application
- Consistent error handling

### 3. Component Composition

**Implementation:**
- Small, focused components
- Composition over inheritance
- Props for configuration

**Example:**
```typescript
<FilterContainer>
  <FilterSidebar />
  <ProductGrid>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </ProductGrid>
</FilterContainer>
```

**Benefits:**
- Reusable components
- Easier testing
- Better maintainability

### 4. URL as State

**Implementation:**
- All filter state in URL parameters
- Navigation updates URL
- Server reads URL on each request

**Benefits:**
- Shareable URLs
- Browser history works naturally
- SEO-friendly
- No complex state management

## Performance Optimizations

### 1. Rendering Strategy

**Catalog Pages:** Server-Side Rendering (SSR)
- Fresh data on every request
- SEO-optimized
- Fast initial load

**Product Pages:** Static Site Generation (SSG) with ISR
- Pre-rendered at build time
- Cached at CDN
- Revalidated periodically

### 2. Database Optimization

**Indexes:**
- Category, location, price, createdAt indexed
- Unique index on slug
- Composite indexes for common queries

**Query Optimization:**
- Pagination to limit result sets
- Select only needed fields
- Efficient facet counting

### 3. Image Optimization

**Next.js Image Component:**
- Automatic format selection (WebP, AVIF)
- Responsive images
- Lazy loading
- Blur placeholder

### 4. Code Splitting

**Automatic:**
- Route-based splitting by Next.js
- Component-level splitting
- Dynamic imports for heavy components

### 5. Caching Strategy

**Static Assets:**
- Cached at CDN
- Long cache headers

**Dynamic Data:**
- ISR for product pages
- Stale-while-revalidate pattern

**Database:**
- Connection pooling
- Query result caching (future)

## Security Architecture

### 1. Input Validation

**Server-Side:**
- All inputs validated with Zod
- Sanitization before processing
- Type checking at runtime

**Client-Side:**
- Form validation for UX
- Not relied upon for security

### 2. SQL Injection Prevention

**Prisma ORM:**
- Parameterized queries
- No raw SQL (except where necessary)
- Type-safe query builder

### 3. XSS Prevention

**React:**
- Automatic escaping of rendered content
- Dangerous HTML explicitly marked
- Content Security Policy headers

### 4. Environment Security

**Environment Variables:**
- Secrets in environment variables
- Never committed to repository
- Different values per environment

**Headers:**
- HSTS enabled
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 5. Rate Limiting

**Recommended (not implemented):**
- API rate limiting per IP
- Search query throttling
- DDoS protection at CDN level

## Scalability Considerations

### Current Architecture

**Suitable for:**
- Small to medium traffic (< 10k daily users)
- Single-region deployment
- Moderate database size (< 1M products)

### Scaling Strategies

#### Horizontal Scaling

**Application:**
- Stateless server components
- Deploy multiple instances
- Load balancer distribution

**Database:**
- Read replicas for queries
- Write to primary database
- Connection pooling

#### Vertical Scaling

**Application:**
- Increase server resources
- More memory for caching
- Faster CPU for rendering

**Database:**
- Larger database instance
- More storage
- Better I/O performance

#### Caching Layer

**Redis (future):**
- Cache search results
- Session storage
- Rate limiting counters

**CDN:**
- Static asset caching
- Edge caching for pages
- Geographic distribution

### Database Migration Path

**Current:** SQLite (development)

**Small Scale:** PostgreSQL on managed service
- Heroku Postgres
- AWS RDS
- DigitalOcean Managed Database

**Medium Scale:** PostgreSQL with read replicas
- Primary for writes
- Replicas for reads
- Connection pooling

**Large Scale:** Distributed database
- Sharding by category or location
- Separate search index (Elasticsearch)
- Caching layer (Redis)

## Testing Strategy

### Unit Tests

**Focus:**
- Service layer functions
- Validation logic
- Utility functions

**Tools:**
- Jest
- TypeScript

### Integration Tests

**Focus:**
- Database operations
- Service integration
- API endpoints (if added)

**Tools:**
- Jest
- Prisma test database

### Component Tests

**Focus:**
- UI component rendering
- User interactions
- Props handling

**Tools:**
- Jest
- React Testing Library

### End-to-End Tests

**Focus:**
- Complete user flows
- Search and filter workflows
- Product detail navigation

**Tools:**
- Playwright (recommended)
- Cypress (alternative)

## Deployment Architecture

### Development

```
Developer Machine
├── SQLite database (file:./dev.db)
├── Next.js dev server (port 3000)
└── Prisma Studio (port 5555)
```

### Production (Vercel)

```
GitHub Repository
        ↓
GitHub Actions (CI/CD)
        ↓
Vercel Platform
├── Edge Network (CDN)
├── Serverless Functions (API routes)
├── Static Assets (images, CSS, JS)
└── Database Connection
        ↓
PostgreSQL Database
├── Primary (writes)
└── Replicas (reads)
```

### CI/CD Pipeline

```
1. Push to GitHub
        ↓
2. GitHub Actions triggered
        ↓
3. Run tests and linting
        ↓
4. Build Next.js application
        ↓
5. Deploy to Vercel
        ↓
6. Run database migrations
        ↓
7. Verify deployment
        ↓
8. Update production
```

## Monitoring and Observability

### Recommended Tools

**Application Monitoring:**
- Vercel Analytics (built-in)
- Sentry (error tracking)
- LogRocket (session replay)

**Database Monitoring:**
- Prisma Pulse (future)
- Database provider tools
- Query performance tracking

**Performance Monitoring:**
- Lighthouse CI
- Web Vitals tracking
- Real User Monitoring (RUM)

### Key Metrics

**Performance:**
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

**Business:**
- Search queries per day
- Filter usage patterns
- Product view rates
- Conversion funnel

## Future Enhancements

### Short Term

1. **Full-Text Search**
   - PostgreSQL full-text search
   - Better keyword matching
   - Relevance scoring

2. **Advanced Filtering**
   - Multi-select filters
   - Range sliders
   - Date filters

3. **Performance**
   - Redis caching layer
   - Image CDN
   - Database query optimization

### Medium Term

1. **Search Features**
   - Autocomplete
   - Search suggestions
   - Typo tolerance

2. **User Features**
   - Saved searches
   - Favorites
   - Comparison tool

3. **Analytics**
   - Search analytics
   - User behavior tracking
   - A/B testing framework

### Long Term

1. **Elasticsearch Integration**
   - Advanced search capabilities
   - Faceted search improvements
   - Better performance at scale

2. **Microservices**
   - Separate search service
   - Image processing service
   - Recommendation engine

3. **Multi-Region**
   - Geographic distribution
   - Edge computing
   - Regional databases

## Decision Log

### Why Next.js App Router over Pages Router?

**Decision:** Use App Router

**Reasons:**
- Modern React features (Server Components)
- Better performance characteristics
- Improved developer experience
- Future-proof architecture
- Better code organization

### Why SQLite for Development?

**Decision:** Use SQLite locally, PostgreSQL in production

**Reasons:**
- Zero configuration for developers
- Fast setup and teardown
- Easy to reset and seed
- File-based - simple backups
- Production uses PostgreSQL for scalability

### Why URL-Based State over Client State?

**Decision:** Store filter state in URL parameters

**Reasons:**
- SEO benefits
- Shareable links
- Browser history support
- Simpler architecture
- No state synchronization issues

### Why Prisma over Raw SQL?

**Decision:** Use Prisma ORM

**Reasons:**
- Type safety
- Better developer experience
- Automatic migrations
- Cross-database compatibility
- Reduced boilerplate

### Why Tailwind over CSS Modules?

**Decision:** Use Tailwind CSS

**Reasons:**
- Faster development
- Consistent design system
- Smaller production bundle
- No naming conflicts
- Better responsive design support

## Conclusion

This architecture provides a solid foundation for a modern, performant, and SEO-optimized marketplace catalog. The server-first approach with Next.js App Router, combined with type-safe data access through Prisma and comprehensive validation with Zod, creates a maintainable and scalable application.

The architecture is designed to handle current requirements while providing clear paths for future enhancements and scaling as the application grows.
