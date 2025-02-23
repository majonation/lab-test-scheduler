-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "scheduleType" TEXT NOT NULL,
    "scheduleValue" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "experimentType" TEXT NOT NULL,
    "notificationEmails" TEXT[],

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
