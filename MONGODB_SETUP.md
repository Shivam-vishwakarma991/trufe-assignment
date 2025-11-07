# MongoDB Setup Guide

This guide will help you configure MongoDB for the Marketplace Catalog application.

## Prerequisites

- MongoDB Atlas account (free tier available)
- MongoDB cluster URL

## Step 1: Get Your MongoDB Connection String

Your MongoDB connection string should look like this:

```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketplace?retryWrites=true&w=majority
```

## Step 2: Configure GitHub Secrets

Add the following secret to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secret:

| Secret Name | Value |
|-------------|-------|
| `DATABASE_URL` | Your MongoDB connection string |

Example:
```
Name: DATABASE_URL
Value: mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketplace?retryWrites=true&w=majority
```

## Step 3: Configure Local Development

Update your `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local and add your MongoDB URL
DATABASE_URL="mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketplace-dev?retryWrites=true&w=majority"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Note:** Use a different database name for development (e.g., `marketplace-dev`) to keep it separate from production.

## Step 4: Initialize the Database

Run the following commands to set up your database:

```bash
# Generate Prisma Client for MongoDB
npx prisma generate

# Push the schema to MongoDB
npx prisma db push

# Seed the database with sample data
npm run db:seed
```

## Step 5: Verify the Setup

1. **Check the database:**
   ```bash
   npx prisma studio
   ```
   This will open Prisma Studio where you can view your MongoDB data.

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Visit the catalog page:**
   ```
   http://localhost:3000/catalog
   ```

## Step 6: Configure Vercel (Production)

If deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your production MongoDB URL | Production |
| `NEXT_PUBLIC_APP_URL` | Your production domain | Production |

Example:
```
DATABASE_URL=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketplace?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## MongoDB Atlas Setup (If You Don't Have a Cluster)

### 1. Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization (if needed)

### 2. Create a Cluster

1. Click **"Build a Database"**
2. Choose **"Shared"** (Free tier - M0)
3. Select your cloud provider and region
4. Click **"Create Cluster"**

### 3. Create a Database User

1. Go to **Database Access** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password (save these!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 4. Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **"Add IP Address"**
3. For development/testing, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **Note:** For production, restrict to specific IPs
4. Click **"Confirm"**

### 5. Get Connection String

1. Go to **Database** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with your database name (e.g., `marketplace`)

Example:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/marketplace?retryWrites=true&w=majority
```

## Troubleshooting

### Issue: "MongoServerError: bad auth"

**Solution:** Check your username and password in the connection string. Make sure special characters are URL-encoded.

Example:
- Password: `p@ssw0rd!`
- Encoded: `p%40ssw0rd%21`

### Issue: "MongooseServerSelectionError: Could not connect"

**Solution:** 
1. Check your network access settings in MongoDB Atlas
2. Ensure your IP address is whitelisted
3. Verify the connection string is correct

### Issue: "Error: P1001: Can't reach database server"

**Solution:**
1. Check if MongoDB Atlas cluster is running
2. Verify network access settings
3. Check if your internet connection is working

### Issue: Build fails with "DATABASE_URL is empty"

**Solution:**
1. Verify the `DATABASE_URL` secret is set in GitHub
2. Check that the secret name is exactly `DATABASE_URL` (case-sensitive)
3. Re-run the GitHub Actions workflow

### Issue: Seed script fails

**Solution:**
1. Ensure the database is empty or drop existing collections
2. Check that the MongoDB user has write permissions
3. Verify the connection string includes the database name

## Schema Changes

When you need to update the database schema:

1. **Edit the schema:**
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Push changes to MongoDB:**
   ```bash
   npx prisma db push
   ```

3. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

**Note:** MongoDB with Prisma doesn't use migrations like SQL databases. Use `prisma db push` to sync your schema.

## Differences from SQLite

### ID Fields

**SQLite:**
```prisma
id String @id @default(cuid())
```

**MongoDB:**
```prisma
id String @id @default(auto()) @map("_id") @db.ObjectId
```

### Indexes

Both SQLite and MongoDB support indexes the same way in Prisma:
```prisma
@@index([category])
@@index([location])
```

### Unique Constraints

Both support unique constraints:
```prisma
slug String @unique
```

## Production Checklist

Before deploying to production:

- [ ] MongoDB cluster is created
- [ ] Database user is created with appropriate permissions
- [ ] Network access is configured (whitelist production IPs)
- [ ] `DATABASE_URL` secret is set in GitHub Actions
- [ ] `DATABASE_URL` environment variable is set in Vercel
- [ ] Database is seeded with initial data (if needed)
- [ ] Connection string uses production database name
- [ ] Password is strong and secure
- [ ] Connection string is not exposed in code or logs

## Monitoring

### View Database Contents

```bash
# Open Prisma Studio
npx prisma studio
```

### Check Connection

```bash
# Test database connection
npx prisma db pull
```

### View Logs

Check your application logs for database connection issues:
- GitHub Actions logs for build-time issues
- Vercel logs for runtime issues
- Browser console for client-side issues

## Support

For MongoDB-specific issues:
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Prisma MongoDB Documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb)

For application issues:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md)
- Review [ARCHITECTURE.md](./ARCHITECTURE.md)
- Open an issue on GitHub
