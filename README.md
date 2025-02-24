# Lab Test Scheduler

A web application for scheduling and managing laboratory tests with support for both one-time and recurring executions.

## Overview

The Lab Test Scheduler enables laboratory personnel to:

- Schedule one-time tests with specific date/time
- Configure recurring tests using cron expressions
- Monitor test execution status
- Receive email notifications for test results
- Manage different test types and experiments
- Handle concurrent test execution with locking mechanism

## System Design

For detailed information about the system architecture, components, and production setup, please refer to our [Design Document](docs/Design%20Document.pdf).

## Tech Stack for the Prototype

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Task Scheduling**: Custom scheduler with worker processes

## Running with Docker

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

## Running with Docker Compose

### Prerequisites

- Docker
- Docker Compose
