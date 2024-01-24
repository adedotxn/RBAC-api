/*
  Warnings:

  - You are about to drop the `ImageUpload` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImageUpload" DROP CONSTRAINT "ImageUpload_targetCustomerUserId_fkey";

-- DropForeignKey
ALTER TABLE "ImageUpload" DROP CONSTRAINT "ImageUpload_uploaderAdminUserId_fkey";

-- DropTable
DROP TABLE "ImageUpload";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageDescription" TEXT NOT NULL,
    "targetCustomerUserId" INTEGER NOT NULL,
    "uploaderAdminUserId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_targetCustomerUserId_fkey" FOREIGN KEY ("targetCustomerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploaderAdminUserId_fkey" FOREIGN KEY ("uploaderAdminUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
