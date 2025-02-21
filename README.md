# Distributed Lab Test Scheduler

A scalable, cost-effective distributed job scheduler designed for lab test measurements and experiments in a modern biotech/chemistry lab environment.

Find the design document in the docs folder.

---

## Overview

- **Purpose:**  
  Schedule and perform lab test measurements with precise timing, leveraging AWS managed services and Kubernetes to ensure high availability and data durability.

- **Key Features:**

  - **Task Scheduling:**  
    Create, view, update, and delete lab test measurement tasks with both one-time and recurring (Cron-based) schedules.
  - **Automated Execution:**  
    When a task’s scheduled time arrives, a scheduler locks the task in the database and publishes a message to AWS SQS. A warm Lambda function is then triggered to execute the lab test measurement, process the data, and update the task status.
  - **Logging & Monitoring:**  
    Centralized logging via AWS CloudWatch provides full visibility into task execution and system performance.
  - **User Interface:**  
    A responsive React-based GUI (served via Amazon CloudFront) offers an intuitive landing page with a scrollable, paginated list of upcoming tests and an easy-to-use modal for creating new test tasks.

- **Technology Stack:**
  - **Frontend:** React.js served by Amazon CloudFront
  - **API Server:** Node.js/TypeScript running in Docker on Kubernetes
  - **Database:** AWS Aurora (scalable PostgreSQL)
  - **Scheduler:** Node.js/TypeScript service in Kubernetes using atomic row locking (`SELECT ... FOR UPDATE`)
  - **Message Queue:** AWS SQS with dead-letter support
  - **Execution:** AWS Lambda (Node.js) for lab test measurements
  - **Monitoring:** AWS CloudWatch

---

## Why This Architecture?

- **High Availability:**  
  Multi-replica Kubernetes clusters and AWS Aurora's multi-AZ replication ensure the system remains operational even during component failures.

- **Data Durability:**  
  All task data and execution logs are stored in AWS Aurora with automated backups and distributed storage.

- **Scalability:**
  - **Horizontal Scaling:** Kubernetes enables automatic scaling of the API server and scheduler pods.
  - **Serverless Execution:** AWS Lambda functions and SQS handle high volumes of scheduled tasks seamlessly.
- **Cost-Effectiveness:**  
  Managed services like Aurora, Lambda, and SQS reduce operational overhead and allow payment based on actual usage, avoiding over-provisioning.

---

## Quick Start

1. **Frontend Setup:**

   - Build the React.js application and deploy the static assets to Amazon CloudFront.

2. **Backend Setup:**

   - Containerize the Node.js/TypeScript API server and Scheduler, then deploy them to separate Kubernetes clusters.
   - Configure the API server to connect to AWS Aurora.
   - Set up the Scheduler to poll the database, lock tasks atomically, and push messages to AWS SQS.

3. **AWS Configuration:**

   - Configure AWS SQS with a dead-letter queue for handling message processing failures.
   - Deploy AWS Lambda functions (with provisioned concurrency for minimal cold starts) to process tasks from the queue.
   - Ensure all components send logs to AWS CloudWatch for centralized monitoring.

4. **Run and Monitor:**
   - Use the responsive UI to create and manage lab test tasks.
   - Monitor task execution and system health via CloudWatch dashboards.

---

## License

This project is provided as a design example for a distributed lab test scheduler. Feel free to adapt and extend the design to suit your specific requirements.
