/*
  Warnings:

  - You are about to drop the column `isDropSet` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the `SubSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubSet" DROP CONSTRAINT "SubSet_exerciseSetId_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "isDropSet";

-- DropTable
DROP TABLE "SubSet";

-- CreateTable
CREATE TABLE "Dropset" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dropset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DropsetSubSet" (
    "id" TEXT NOT NULL,
    "dropsetId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DropsetSubSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dropset_exerciseId_idx" ON "Dropset"("exerciseId");

-- CreateIndex
CREATE INDEX "DropsetSubSet_dropsetId_idx" ON "DropsetSubSet"("dropsetId");

-- AddForeignKey
ALTER TABLE "Dropset" ADD CONSTRAINT "Dropset_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DropsetSubSet" ADD CONSTRAINT "DropsetSubSet_dropsetId_fkey" FOREIGN KEY ("dropsetId") REFERENCES "Dropset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
