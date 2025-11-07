# Deployment Guide

This guide covers deploying the Marketplace Catalog application to production using GitHub Actions and Vercel.

## Prerequisites

- GitHub repository with the application code
- Vercel account (free tier works for most use cases)
- Node.js 20.x or higher
- Database (SQLite for development, PostgreSQL/MySQL recommended for production)

## Environment Variables

### Required Environment Variables

Create these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

#### Vercel Configuration
- `VERCEL_TOKEN`: Your Vercel authentication token
  - Get from: https://vercel.com/account/tokens
- `VERCEL_ORG_ID`: Your Vercel organization ID
  - Get from: Vercel project settings
- `VERCEL_PROJECT_ID`: Your Vercel project ID
  - Get from: Vercel project settings

#### Application Configuration
- `DATABASE_URL`: Production database connection string
  - Example: `postgresql://user:password@host:5432/database`
  - For SQLite: `file:./prod.db` (not recommended for production)
- `NEXT_PUBLIC_APP_URL`: Your production domain
  - Example: `https://marketplace.example.com`

#### Preview Environment (Optional)
- `PREVIEW_DATABASE_URL`: Preview environment database URL
- `PREVIEW_APP_URL`: Preview environment URL

### Local Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. For production builds, create a production environment file:
   ```bash
   cp .env.production.example .env.production
   ```

3. Fill in the required values in both files.

## Deployment Methods

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

The application automatically deploys when code is pushed to the `main` branch.

#### Setup Steps:

1. **Configure GitHub Secrets**
   - Go to your repository settings
   - Navigate to Secrets and variables > Actions
   - Add all required secrets listed above

2. **Push to Main Branch**
   ```bash
   git push origin main
   ```

3. **Monitor Deployment**
   - Go to the Actions tab in your GitHub repository
   - Watch the deployment workflow progress
   - Check for any errors in the logs

#### Workflow Stages:

1. **Test**: Runs linting and type checking
2. **Build**: Builds the Next.js application
3. **Deploy**: Deploys to Vercel and runs database migrations

### Method 2: Manual Deployment via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

### Method 3: Direct Vercel Integration

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Vercel will automatically deploy on every push to main

## Database Migration

### Automatic Migration (via GitHub Actions)

Database migrations run automatically after deployment in the GitHub Actions workflow.

### Manual Migration

If you need to run migrations manually:

```bash
# Set environment variables
export DATABASE_URL="your-production-database-url"

# Run migration script
npm run db:migrate

# Or run commands individually
npx prisma generate
npx prisma db push
npm run db:seed  # Optional: seed initial data
```

### Migration Script

The `scripts/migrate.sh` script handles:
- Generating Prisma Client
- Pushing schema changes to the database
- Optionally seeding the database

Set `SEED_DATABASE=true` to enable seeding during migration.

## Build Optimization

### Production Build Script

The `scripts/build.sh` script performs:
- Dependency installation
- Prisma Client generation
- Linting
- Type checking
- Next.js production build

Run manually:
```bash
npm run build:production
```

### Next.js Optimizations

The application includes several production optimizations:

1. **Image Optimization**
   - AVIF and WebP format support
   - Responsive image sizes
   - Lazy loading

2. **Security Headers**
   - HSTS (HTTP Strict Transport Security)
   - X-Frame-Options
   - Content Security Policy
   - XSS Protection

3. **Static Optimization**
   - Standalone output mode
   - Compression enabled
   - Powered-by header removed

4. **Caching Strategy**
   - Static assets cached at CDN
   - API responses cached appropriately
   - Database query optimization

## Monitoring and Maintenance

### Health Checks

Monitor these endpoints:
- `/catalog` - Main catalog page
- `/catalog/[id]` - Product detail pages
- Check response times and error rates

### Database Maintenance

1. **Regular Backups**
   - Set up automated database backups
   - Test restore procedures regularly

2. **Performance Monitoring**
   - Monitor query performance
   - Check database connection pool usage
   - Review slow query logs

3. **Data Cleanup**
   - Archive old data if needed
   - Optimize database indexes

### Application Monitoring

Consider integrating:
- **Vercel Analytics**: Built-in performance monitoring
- **Sentry**: Error tracking and monitoring
- **Google Analytics**: User behavior tracking

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails with Prisma errors
```bash
# Solution: Ensure DATABASE_URL is set
export DATABASE_URL="your-database-url"
npx prisma generate
npm run build
```

**Issue**: Type checking errors
```bash
# Solution: Run type check locally
npm run type-check
# Fix any TypeScript errors before deploying
```

#### Deployment Failures

**Issue**: Vercel deployment fails
- Check Vercel token is valid
- Verify organization and project IDs
- Review Vercel deployment logs

**Issue**: Database migration fails
- Verify DATABASE_URL is correct
- Check database connectivity
- Review migration logs for specific errors

#### Runtime Issues

**Issue**: 500 errors in production
- Check Vercel function logs
- Verify environment variables are set
- Review database connection status

**Issue**: Images not loading
- Verify image domains in next.config.js
- Check image URLs are accessible
- Review Content Security Policy headers

## Rollback Procedure

If a deployment causes issues:

1. **Via Vercel Dashboard**
   - Go to your project in Vercel
   - Navigate to Deployments
   - Click on a previous stable deployment
   - Click "Promote to Production"

2. **Via Git**
   ```bash
   # Revert to previous commit
   git revert HEAD
   git push origin main
   # This triggers automatic redeployment
   ```

3. **Database Rollback**
   - Restore from backup if schema changes were made
   - Prisma doesn't support automatic rollbacks
   - Manual intervention may be required

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set as secrets
- [ ] DATABASE_URL uses secure connection string
- [ ] HTTPS is enforced (handled by Vercel)
- [ ] Security headers are configured
- [ ] Rate limiting is implemented (if needed)
- [ ] No secrets in client-side code
- [ ] Dependencies are up to date
- [ ] Prisma Client is generated in production
- [ ] Error messages don't expose sensitive data

## Performance Checklist

- [ ] Images are optimized
- [ ] Database queries use proper indexes
- [ ] Static pages are pre-rendered
- [ ] Caching headers are configured
- [ ] Bundle size is optimized
- [ ] Core Web Vitals are passing
- [ ] Lighthouse score is acceptable

## Support

For issues or questions:
- Check GitHub Actions logs for deployment errors
- Review Vercel deployment logs
- Consult Next.js documentation: https://nextjs.org/docs
- Consult Prisma documentation: https://www.prisma.io/docs
