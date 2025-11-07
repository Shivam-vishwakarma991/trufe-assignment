# Marketplace Catalog

A modern, SEO-optimized marketplace catalog application built with Next.js 14+ App Router. Features faceted search, advanced filtering, and deep-linkable URLs for sharing specific search results.

## ✨ Features

- 🔍 **Faceted Search** - Multi-dimensional filtering by category, price range, location, and keywords
- 🔗 **Deep Linking** - Share exact search results with URL-based state management
- ⚡ **Server-Side Rendering** - Fast initial page loads with SSR for catalog pages
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🎯 **SEO Optimized** - Dynamic metadata, canonical URLs, and structured data
- ♿ **Accessible** - WCAG compliant with keyboard navigation support
- 🚀 **Performance** - Optimized images, caching, and efficient database queries
- 🔒 **Secure** - Input validation, sanitization, and security headers

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ with App Router, React Server Components, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Components with direct database access
- **Database**: SQLite (development) / PostgreSQL (production) with Prisma ORM
- **Validation**: Zod for runtime type validation and schema enforcement
- **State Management**: URL-based state with Next.js searchParams
- **Deployment**: Vercel with GitHub Actions CI/CD

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.19.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd marketplace-catalog
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database:**
   ```bash
   npm run db:push
   ```

5. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Verify Installation

- **Catalog Page**: [http://localhost:3000/catalog](http://localhost:3000/catalog)
- **Search**: [http://localhost:3000/catalog?q=laptop](http://localhost:3000/catalog?q=laptop)
- **Prisma Studio**: Run `npm run db:studio` to view database contents

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run type-check` | Run TypeScript type checking |
| `npm run db:push` | Push Prisma schema changes to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:migrate` | Run database migrations (production) |
| `npm run build:production` | Full production build with checks |

## 📁 Project Structure

```
marketplace-catalog/
├── .github/                    # GitHub Actions workflows
├── .kiro/                      # Kiro spec files (requirements, design, tasks)
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.ts                # Database seeding script
│   └── dev.db                 # SQLite database (development)
├── scripts/
│   ├── build.sh               # Production build script
│   └── migrate.sh             # Database migration script
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── catalog/           # Catalog pages (SSR)
│   │   │   ├── page.tsx       # Main catalog page
│   │   │   └── [id]/          # Product detail pages (SSG)
│   │   ├── search/            # Search redirect route
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── catalog/           # Catalog-specific components
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── FilterPills.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── __tests__/     # Component tests
│   │   ├── product/           # Product-specific components
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductGallery.tsx
│   │   │   └── ProductInfo.tsx
│   │   └── ui/                # Reusable UI components
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Prisma client instance
│   │   └── validations.ts     # Zod schemas and validation
│   ├── services/              # Business logic layer
│   │   ├── searchService.ts   # Search functionality
│   │   ├── filterService.ts   # Filter logic
│   │   ├── paginationService.ts
│   │   └── index.ts
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── .env.example               # Environment variables template
├── .env.local                 # Local environment variables (gitignored)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── README.md                  # This file
├── API.md                     # API documentation
├── ARCHITECTURE.md            # Architecture decisions
└── DEPLOYMENT.md              # Deployment guide
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. Create a `.env.local` file for local development:

```bash
cp .env.example .env.local
```

**Required Variables:**

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` (SQLite) or `postgresql://...` |
| `NEXT_PUBLIC_APP_URL` | Application base URL | `http://localhost:3000` |

**Production Variables:**

For production deployment, additional variables may be required. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

### Database Configuration

**Development (SQLite):**
```env
DATABASE_URL="file:./dev.db"
```

**Production (PostgreSQL):**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

## 🎨 Key Features Explained

### Faceted Search

Multi-dimensional filtering system allowing users to narrow results by:
- **Keywords**: Full-text search across product titles and descriptions
- **Category**: Filter by product category (e.g., Electronics, Clothing)
- **Price Range**: Set minimum and maximum price bounds
- **Location**: Filter by geographic location

### Deep Linking

All filter states are stored in URL parameters, enabling:
- **Shareable Links**: Send exact search results to others
- **Bookmarkable**: Save specific searches for later
- **SEO-Friendly**: Search engines can index filtered views
- **Browser History**: Back/forward navigation works naturally

Example URL:
```
/catalog?q=laptop&category=electronics&min=500&max=1500&location=new-york
```

### Server-Side Rendering

- **Catalog Pages**: Rendered on-demand for fresh data and SEO
- **Product Pages**: Pre-rendered at build time for instant loading
- **Dynamic Metadata**: SEO tags generated based on filters
- **Structured Data**: Schema.org markup for rich search results

### Responsive Design

- **Desktop**: Sidebar filters with sticky positioning
- **Tablet**: Adaptive layout with collapsible filters
- **Mobile**: Drawer-based filters with touch-optimized controls
- **Progressive Enhancement**: Works without JavaScript

## 🚀 Deployment

This project is configured for automatic deployment using GitHub Actions and Vercel.

### Quick Deployment to Vercel

1. **Fork or clone this repository**

2. **Connect to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables

3. **Set Environment Variables in Vercel:**
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Deploy:**
   - Vercel automatically deploys on push to main branch
   - Preview deployments created for pull requests

### Automated Deployment with GitHub Actions

For CI/CD pipeline setup:

1. **Configure GitHub Secrets:**
   - `VERCEL_TOKEN` - Your Vercel authentication token
   - `VERCEL_ORG_ID` - Your Vercel organization ID
   - `VERCEL_PROJECT_ID` - Your Vercel project ID
   - `DATABASE_URL` - Production database connection string
   - `NEXT_PUBLIC_APP_URL` - Production domain URL

2. **Push to main branch:**
   ```bash
   git push origin main
   ```

3. **Monitor deployment:**
   - Check GitHub Actions tab for build status
   - View deployment logs in Vercel dashboard

### Manual Deployment

Using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Database Migration

After deployment, run database migrations:

```bash
npm run db:migrate
```

Or set `SEED_DATABASE=true` in environment variables to seed initial data.

### Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide with troubleshooting
- **[API.md](./API.md)** - API endpoints and data models documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture decisions and technology choices

## 💻 Development

### Development Workflow

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Make changes to the code**

3. **View changes in browser:**
   - Hot reload automatically updates the page
   - Check console for errors

4. **Run type checking:**
   ```bash
   npm run type-check
   ```

5. **Run linting:**
   ```bash
   npm run lint
   ```

### Database Management

**View database contents:**
```bash
npm run db:studio
```

**Reset database:**
```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**Update schema:**
1. Edit `prisma/schema.prisma`
2. Run `npm run db:push`
3. Restart dev server

### Adding New Features

This project follows spec-driven development methodology:

1. **Requirements**: Define user stories and acceptance criteria
2. **Design**: Create technical design and architecture
3. **Tasks**: Break down into implementation tasks
4. **Implementation**: Execute tasks incrementally

See `.kiro/specs/marketplace-catalog/` for:
- `requirements.md` - Feature requirements
- `design.md` - Technical design
- `tasks.md` - Implementation tasks

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: (Optional) Add for consistent formatting
- **Naming**: camelCase for variables, PascalCase for components

### Component Guidelines

**Server Components (default):**
- Use for data fetching
- No client-side interactivity
- Better performance

**Client Components:**
- Add `'use client'` directive
- Use for interactive UI
- State management and event handlers

### Testing

**Run tests:**
```bash
npm test
```

**Test structure:**
```
src/components/catalog/__tests__/
├── FilterSidebar.test.tsx
└── MobileFilterButton.test.tsx
```

**Writing tests:**
- Focus on user behavior
- Test component rendering
- Test user interactions
- Mock external dependencies

## 📚 Documentation

### Core Documentation

- **[README.md](./README.md)** (this file) - Getting started and overview
- **[API.md](./API.md)** - API routes, data models, and service interfaces
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture decisions and design patterns
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide and CI/CD setup

### Spec Documentation

Located in `.kiro/specs/marketplace-catalog/`:

- **[requirements.md](.kiro/specs/marketplace-catalog/requirements.md)** - Feature requirements and user stories
- **[design.md](.kiro/specs/marketplace-catalog/design.md)** - Technical design and component architecture
- **[tasks.md](.kiro/specs/marketplace-catalog/tasks.md)** - Implementation task list

### External Resources

- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Zod Documentation](https://zod.dev) - Schema validation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript language

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests and linting
5. Commit with descriptive messages
6. Push to your fork
7. Create a pull request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Keep commits focused and atomic
- Write clear commit messages

### Pull Request Process

1. Ensure all tests pass
2. Update README if needed
3. Add description of changes
4. Request review from maintainers
5. Address review feedback
6. Merge after approval

## 🐛 Troubleshooting

### Common Issues

**Issue: Database connection error**
```bash
# Solution: Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

**Issue: Port 3000 already in use**
```bash
# Solution: Use different port
PORT=3001 npm run dev
```

**Issue: Prisma Client not generated**
```bash
# Solution: Generate Prisma Client
npx prisma generate
```

**Issue: TypeScript errors**
```bash
# Solution: Check types
npm run type-check
```

**Issue: Build fails**
```bash
# Solution: Clean and rebuild
rm -rf .next
npm run build
```

### Getting Help

- Check [GitHub Issues](../../issues) for known problems
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Consult [API.md](./API.md) for API-related questions
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Prisma](https://www.prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Validated with [Zod](https://zod.dev/)
- Deployed on [Vercel](https://vercel.com/)

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check existing documentation
- Review spec files in `.kiro/specs/`

---

**Built with ❤️ using Next.js and TypeScript**