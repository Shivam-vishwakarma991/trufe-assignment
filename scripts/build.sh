#!/bin/bash

# Production build script with optimizations
# This script prepares the application for deployment

set -e

echo "Starting production build..."

# Check Node environment
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=production
  echo "Setting NODE_ENV to production"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Run linting
echo "Running linter..."
npm run lint

# Type checking
echo "Running type check..."
npx tsc --noEmit

# Build Next.js application
echo "Building Next.js application..."
npm run build

echo "Production build completed successfully!"
echo "Build artifacts are in .next directory"
