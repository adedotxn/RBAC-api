/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `ImageUpload` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ImageUpload_targetUserId_key";

-- AlterTable
ALTER TABLE "ImageUpload" ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_imageUrl_key" ON "ImageUpload"("imageUrl");
