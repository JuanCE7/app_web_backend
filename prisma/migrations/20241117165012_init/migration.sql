/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Entity` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - Made the column `entityId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_entityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "imageEntity" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ALTER COLUMN "entityId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
