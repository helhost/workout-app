/*
  Warnings:

  - You are about to drop the column `emailNotifications` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `highContrast` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `notificationSound` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `pushNotifications` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "emailNotifications",
DROP COLUMN "highContrast",
DROP COLUMN "notificationSound",
DROP COLUMN "pushNotifications",
ADD COLUMN     "defaultMeasurementUnit" TEXT NOT NULL DEFAULT 'metric';
