-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "schedule_type" TEXT NOT NULL,
    "schedule_value" TEXT NOT NULL,
    "test_type" INTEGER NOT NULL,
    "experiment_type" INTEGER NOT NULL,
    "notification_emails" TEXT[],
    "locked_at" TIMESTAMP(3),
    "lock_expires" TIMESTAMP(3),
    "next_execution_date" TIMESTAMP(3),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
); 