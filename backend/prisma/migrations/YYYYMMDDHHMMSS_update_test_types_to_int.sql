-- AlterTable
ALTER TABLE "tasks" 
ALTER COLUMN "testType" TYPE INTEGER USING "testType"::INTEGER,
ALTER COLUMN "experimentType" TYPE INTEGER USING "experimentType"::INTEGER; 