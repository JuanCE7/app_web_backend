/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `useCaseAlternateId` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `useCaseMainId` on the `Flow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mainFlowId]` on the table `UseCase` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_useCaseAlternateId_fkey";

-- DropForeignKey
ALTER TABLE "Flow" DROP CONSTRAINT "Flow_useCaseMainId_fkey";

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "useCaseAlternateId",
DROP COLUMN "useCaseMainId";

-- AlterTable
ALTER TABLE "UseCase" ADD COLUMN     "mainFlowId" TEXT;

-- CreateTable
CREATE TABLE "_AlternateFlow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AlternateFlow_AB_unique" ON "_AlternateFlow"("A", "B");

-- CreateIndex
CREATE INDEX "_AlternateFlow_B_index" ON "_AlternateFlow"("B");

-- CreateIndex
CREATE UNIQUE INDEX "UseCase_mainFlowId_key" ON "UseCase"("mainFlowId");

-- AddForeignKey
ALTER TABLE "UseCase" ADD CONSTRAINT "UseCase_mainFlowId_fkey" FOREIGN KEY ("mainFlowId") REFERENCES "Flow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlternateFlow" ADD CONSTRAINT "_AlternateFlow_A_fkey" FOREIGN KEY ("A") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlternateFlow" ADD CONSTRAINT "_AlternateFlow_B_fkey" FOREIGN KEY ("B") REFERENCES "UseCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
