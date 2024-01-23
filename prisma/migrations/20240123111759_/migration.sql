/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `ImageUpload` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ImageUpload_imageUrl_key";

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_id_key" ON "ImageUpload"("id");
