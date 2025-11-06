# Marketplace Catalog

A modern Next.js marketplace catalog application with faceted search capabilities, designed for SEO optimization and deep-linkable filters.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with server actions
- **Database**: SQLite with Prisma ORM
- **Validation**: Zod for schema validation
- **State Management**: URL-based state with Next.js searchParams

## Getting Started

### Prerequisites

- Node.js 18.19.0 or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

3. (Optional) Seed the database:
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── catalog/        # Catalog-specific components
│   ├── product/        # Product-specific components
│   └── ui/             # Reusable UI components
├── lib/                # Utility functions and configurations
├── services/           # Business logic and API services
└── types/              # TypeScript type definitions

prisma/
├── schema.prisma       # Database schema
└── seed.ts            # Database seeding script
```

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

## Features

- Server-side rendered catalog pages with advanced filtering
- Faceted search with category, price, and location filters
- SEO-optimized product detail pages
- URL-based filter state for deep linking
- Responsive design with mobile-first approach
- Accessibility features and keyboard navigation
- Performance optimizations and caching strategies

## Development

This project follows the spec-driven development methodology. See the `.kiro/specs/marketplace-catalog/` directory for detailed requirements, design, and implementation tasks.