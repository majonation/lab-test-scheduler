FROM node:18-alpine

# Install required dependencies including OpenSSL
RUN apk add --no-cache \
    dos2unix \
    openssl \
    openssl-dev \
    libc6-compat \
    postgresql-client

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Fix line endings and make scripts executable
RUN dos2unix setup.sh && chmod +x setup.sh
RUN dos2unix start-services.sh && chmod +x start-services.sh

EXPOSE 3000

CMD ["/bin/sh", "./start-services.sh"] 