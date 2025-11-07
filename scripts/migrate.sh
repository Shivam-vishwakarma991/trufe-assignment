#!/bin/bash

# Database migration script for deployment
# This script handles database schema updates and seeding

set -e

echo "Starting database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push database schema changes
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Check if seeding is needed (optional flag)
if [ "$SEED_DATABASE" = "true" ]; then
  echo "Seeding database..."
  npm run db:seed
else
  echo "Skipping database seeding (set SEED_DATABASE=true to enable)"
fi

echo "Database migration completed successfully!"
