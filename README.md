# Lab Test Scheduler

A web application for scheduling and managing laboratory tests with support for both one-time and recurring executions. This is an excercise for managing distributed systems.

## Overview

The Lab Test Scheduler enables laboratory personnel to:

- Schedule one-time tests with specific date/time
- Configure recurring tests using cron expressions
- Monitor test execution status
- Receive email notifications for test results
- Manage different test types and experiments
- Handle concurrent test execution with locking mechanism

## System Design for production

For detailed information about the system architecture, components, and production setup, please refer to our [Design Document](docs/Design%20Document.pdf).

## Tech Stack for the Prototype

The prototype is not using any AWS services and therefore is without message queue. It showcasing the node.js and react parts and runs in one Docker container.

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Task Scheduling**: Custom scheduler with worker processes

## RUN-OPTION 1: Running with Docker Compose

### Prerequisites

- Docker
- Docker Compose

### Starting the Application

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lab-test-scheduler.git
cd lab-test-scheduler
```

2. Start the application:

```bash
docker-compose up --build
```

3. Access the application at `http://localhost:5173`

## RUN-OPTION 2: Local Development Setup ( assuming Postgres is running locally)

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ running locally
- npm or yarn

### Database Setup

1. Create a local PostgreSQL database:

```sql
-- Create user if not exists
CREATE USER postgres WITH PASSWORD 'password';

-- Create database
CREATE DATABASE taskdb;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskdb TO postgres;

-- Connect to taskdb
\c taskdb

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

2. Configure your local database connection:

```bash
# In backend/.env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskdb?schema=public"
```

### Backend Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Run database migrations:

```bash
npm run migrate:local
```

3. Test database connection:

```bash
npm run test:db
```

4. Start the API server:

```bash
npm run dev
```

5. Start the scheduler (in a new terminal):

```bash
cd backend
npm run scheduler
```

### Frontend Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Development Notes

- The API server runs with hot-reload enabled
- The scheduler runs independently and can be restarted separately
- Frontend changes are reflected immediately
- Database schema changes require running migrations
