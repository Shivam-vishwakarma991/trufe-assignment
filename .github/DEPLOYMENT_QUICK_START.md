# Deployment Quick Start

Quick reference for deploying the Marketplace Catalog application.

## First-Time Setup

### 1. Configure GitHub Secrets (One-time)

Add these secrets in GitHub: Settings > Secrets and variables > Actions

```
VERCEL_TOKEN          - Get from https://vercel.com/account/tokens
VERCEL_ORG_ID         - From Vercel project settings
VERCEL_PROJECT_ID     - From Vercel project settings
DATABASE_URL          - Production database connection string
NEXT_PUBLIC_APP_URL   - Your production domain
```

See `.github/SECRETS.md` for detailed instructions.

### 2. Verify Local Build

```bash
# Install dependencies
npm ci

# Run type check
npm run type-check

# Run linter
npm run lint

# Build locally
npm run build

# Test production build
npm start
```

## Deployment Commands

### Automatic Deployment (Recommended)

```bash
# Push to main branch triggers automatic deployment
git push origin main

# Monitor deployment at:
# https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login to Vercel (one-time)
vercel login

# Deploy to production
vercel --prod

# Run database migrations
export DATABASE_URL="your-production-database-url"
npm run db:migrate
```

### Preview Deployment

```bash
# Create a pull request - automatic preview deployment
git checkout -b feature/my-feature
git push origin feature/my-feature
# Open PR on GitHub - preview deploys automatically
```

## Database Management

### Run Migrations

```bash
# Set environment variable
export DATABASE_URL="your-database-url"

# Run migration script
npm run db:migrate

# Or manually:
npx prisma generate
npx prisma db push
```

### Seed Database

```bash
# Seed with initial data
export DATABASE_URL="your-database-url"
npm run db:seed
```

### View Database

```bash
# Open Prisma Studio
export DATABASE_URL="your-database-url"
npm run db:studio
```

## Common Tasks

### Update Environment Variables

**In Vercel Dashboard:**
1. Go to project settings
2. Navigate to Environment Variables
3. Add/update variables
4. Redeploy for changes to take effect

**In GitHub Secrets:**
1. Go to Settings > Secrets and variables > Actions
2. Update secret values
3. Re-run workflow

### Check Deployment Status

```bash
# View GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

# View Vercel deployments
# Go to: https://vercel.com/YOUR_USERNAME/YOUR_PROJECT
```

### View Logs

**GitHub Actions Logs:**
- Go to Actions tab
- Click on workflow run
- View logs for each job

**Vercel Logs:**
- Go to Vercel dashboard
- Select your project
- Click on deployment
- View function logs

### Rollback Deployment

**Via Vercel Dashboard:**
1. Go to Deployments
2. Find previous stable deployment
3. Click "Promote to Production"

**Via Git:**
```bash
git revert HEAD
git push origin main
```

## Troubleshooting

### Build Fails

```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

### Database Connection Issues

```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# Test database connection
npx prisma db push --preview-feature

# Regenerate Prisma Client
npx prisma generate
```

### Deployment Workflow Fails

1. Check GitHub Actions logs for specific error
2. Verify all secrets are set correctly
3. Ensure Vercel token is valid
4. Check database is accessible

## Pre-Deployment Checklist

Before deploying to production:

- [ ] All tests pass locally
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] GitHub secrets are set
- [ ] Vercel project is configured

## Monitoring After Deployment

1. **Check Application Health**
   - Visit your production URL
   - Test main catalog page
   - Test product detail pages
   - Test search and filters

2. **Monitor Performance**
   - Check Vercel Analytics
   - Review Core Web Vitals
   - Monitor response times

3. **Check for Errors**
   - Review Vercel function logs
   - Check for 500 errors
   - Monitor error rates

## Support Resources

- **Full Documentation**: See `DEPLOYMENT.md`
- **Secrets Setup**: See `.github/SECRETS.md`
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Actions**: https://docs.github.com/actions
