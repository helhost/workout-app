/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `BodyFatMeasurement` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `HeightMeasurement` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeightMeasurement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BodyFatMeasurement" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "HeightMeasurement" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "WeightMeasurement" DROP COLUMN "updatedAt";
