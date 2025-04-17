/*
  Warnings:

  - Changed the type of `muscleGroup` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'cardio', 'fullBody');

-- AlterTable
ALTER TABLE "Exercise"
ALTER COLUMN "muscleGroup" TYPE "MuscleGroup" USING "muscleGroup"::"MuscleGroup";

