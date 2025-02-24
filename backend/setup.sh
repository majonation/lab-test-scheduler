#!/bin/bash

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h postgres -p 5432 -U postgres; do
  sleep 1
done

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Push schema changes (for development)
echo "Pushing schema changes..."
npx prisma db push --accept-data-loss

# Run seed if needed
echo "Running seeds..."
npx prisma db seed

