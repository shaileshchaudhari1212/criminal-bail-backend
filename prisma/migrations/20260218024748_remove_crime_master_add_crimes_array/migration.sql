/*
  Warnings:

  - You are about to drop the column `crimeId` on the `Criminal` table. All the data in the column will be lost.
  - You are about to drop the `Crime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Criminal" DROP CONSTRAINT "Criminal_crimeId_fkey";

-- AlterTable
ALTER TABLE "Criminal" DROP COLUMN "crimeId",
ADD COLUMN     "crimes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "ipcSections" SET DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "Crime";
