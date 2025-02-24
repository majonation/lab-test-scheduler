# Lab Test Scheduler System Architecture

This document provides an overview of the Lab Test Scheduler system architecture and its components.

## System Overview

The Lab Test Scheduler is designed as a distributed system for managing laboratory test executions at scale. While the prototype runs in a single container, the production system is designed to handle high loads and provide fault tolerance.

## Architecture Diagram

![System Architecture](./images/architecture.png)

## Key Components

### Frontend Application

- React-based SPA
- Near Real-time updates via Polling
- Responsive design for lab equipment interfaces

### Backend Services

1. **API Service**

   - REST API endpoints
   - Authentication & authorization
   - Request validation
   - Task management

2. **Scheduler Service**

   - Task scheduling logic
   - Cron expression parsing
   - Task distribution
   - Lock management

3. **Worker Service**
   - Task execution
   - Status updates
   - Error handling
   - Retry logic

### Data Storage

- PostgreSQL for task data

### Message Queue

- Amazon SQS for task distribution
- Ensures reliable task delivery
- Handles back pressure

## Scalability & Reliability

The production architecture (detailed in [Design Document.pdf](Design%20Document.pdf)) includes:

- Horizontal scaling of workers
- High availability setup
- Fault tolerance mechanisms
- Data replication
- Load balancing

## Monitoring & Logging

- CloudWatch metrics
- Centralized logging
- Performance monitoring
- Alert system

## Security Considerations

- JWT authentication
- Role-based access control
- Data encryption
- Audit logging

## Deployment

The production system is deployed on AWS with:

- Auto-scaling groups
- Load balancers using AWS ALB or Kubernetes Ingress
- Multi-AZ setup
- Blue-green deployment

For implementation details and deployment guides, see the [Design Document](Design%20Document.pdf).
