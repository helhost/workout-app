/*
  Warnings:

  - You are about to drop the `BodyMeasurement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BodyMeasurement" DROP CONSTRAINT "BodyMeasurement_userId_fkey";

-- DropTable
DROP TABLE "BodyMeasurement";

-- CreateTable
CREATE TABLE "UserMeasurements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMeasurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightMeasurement" (
    "id" TEXT NOT NULL,
    "userMeasurementsId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeightMeasurement" (
    "id" TEXT NOT NULL,
    "userMeasurementsId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeightMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyFatMeasurement" (
    "id" TEXT NOT NULL,
    "userMeasurementsId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BodyFatMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMeasurements_userId_key" ON "UserMeasurements"("userId");

-- CreateIndex
CREATE INDEX "WeightMeasurement_userMeasurementsId_date_idx" ON "WeightMeasurement"("userMeasurementsId", "date");

-- CreateIndex
CREATE INDEX "HeightMeasurement_userMeasurementsId_date_idx" ON "HeightMeasurement"("userMeasurementsId", "date");

-- CreateIndex
CREATE INDEX "BodyFatMeasurement_userMeasurementsId_date_idx" ON "BodyFatMeasurement"("userMeasurementsId", "date");

-- AddForeignKey
ALTER TABLE "UserMeasurements" ADD CONSTRAINT "UserMeasurements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightMeasurement" ADD CONSTRAINT "WeightMeasurement_userMeasurementsId_fkey" FOREIGN KEY ("userMeasurementsId") REFERENCES "UserMeasurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeightMeasurement" ADD CONSTRAINT "HeightMeasurement_userMeasurementsId_fkey" FOREIGN KEY ("userMeasurementsId") REFERENCES "UserMeasurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyFatMeasurement" ADD CONSTRAINT "BodyFatMeasurement_userMeasurementsId_fkey" FOREIGN KEY ("userMeasurementsId") REFERENCES "UserMeasurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
