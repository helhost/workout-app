/*
  Warnings:

  - You are about to drop the column `date` on the `BodyFatMeasurement` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `ExerciseSet` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `HeightMeasurement` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `WeightMeasurement` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Workout` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BodyFatMeasurement_userMeasurementsId_date_idx";

-- DropIndex
DROP INDEX "HeightMeasurement_userMeasurementsId_date_idx";

-- DropIndex
DROP INDEX "WeightMeasurement_userMeasurementsId_date_idx";

-- DropIndex
DROP INDEX "Workout_userId_date_idx";

-- AlterTable
ALTER TABLE "BodyFatMeasurement" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "ExerciseSet" DROP COLUMN "completed";

-- AlterTable
ALTER TABLE "HeightMeasurement" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "WeightMeasurement" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "date";

-- CreateIndex
CREATE INDEX "BodyFatMeasurement_userMeasurementsId_createdAt_idx" ON "BodyFatMeasurement"("userMeasurementsId", "createdAt");

-- CreateIndex
CREATE INDEX "HeightMeasurement_userMeasurementsId_createdAt_idx" ON "HeightMeasurement"("userMeasurementsId", "createdAt");

-- CreateIndex
CREATE INDEX "WeightMeasurement_userMeasurementsId_createdAt_idx" ON "WeightMeasurement"("userMeasurementsId", "createdAt");

-- CreateIndex
CREATE INDEX "Workout_userId_startTime_idx" ON "Workout"("userId", "startTime");
