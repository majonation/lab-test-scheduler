FROM node:18-alpine

# Install PostgreSQL client and required dependencies
RUN apk add --no-cache \
    postgresql-client \
    dos2unix \
    openssl \
    openssl-dev \
    libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Fix line endings and make script executable
RUN dos2unix setup.sh && \
    chmod +x setup.sh

# Expose port
EXPOSE 3000

# Start script
CMD ["/bin/sh", "./setup.sh"] 