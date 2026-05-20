/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Crime` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Crime_name_key" ON "Crime"("name");
