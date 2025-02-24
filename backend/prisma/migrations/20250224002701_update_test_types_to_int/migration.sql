/*
  Warnings:

  - Changed the type of `testType` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `experimentType` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "testType",
ADD COLUMN     "testType" INTEGER NOT NULL,
DROP COLUMN "experimentType",
ADD COLUMN     "experimentType" INTEGER NOT NULL;
