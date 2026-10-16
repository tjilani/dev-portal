/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `ItemType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemType_system_slug_key" ON "ItemType"("slug") WHERE ("userId" IS NULL);
