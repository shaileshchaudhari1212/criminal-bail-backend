-- AlterTable
ALTER TABLE "Criminal" ADD COLUMN     "crimeId" TEXT,
ADD COLUMN     "ipcSections" TEXT[];

-- CreateTable
CREATE TABLE "Crime" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Criminal" ADD CONSTRAINT "Criminal_crimeId_fkey" FOREIGN KEY ("crimeId") REFERENCES "Crime"("id") ON DELETE SET NULL ON UPDATE CASCADE;
