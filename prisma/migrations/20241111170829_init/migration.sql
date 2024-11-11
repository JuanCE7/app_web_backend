/*
  Warnings:

  - You are about to drop the column `analyzedText` on the `Explanation` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `Explanation` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Explanation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Explanation` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `TestCase` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[testCaseId]` on the table `Explanation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `details` to the `Explanation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Explanation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useCaseId` to the `TestCase` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_projectId_fkey";

-- AlterTable
ALTER TABLE "Explanation" DROP COLUMN "analyzedText",
DROP COLUMN "explanation",
DROP COLUMN "keywords",
DROP COLUMN "type",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCase" DROP COLUMN "projectId",
ADD COLUMN     "useCaseId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AnalysisType";

-- CreateIndex
CREATE UNIQUE INDEX "Explanation_testCaseId_key" ON "Explanation"("testCaseId");

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_useCaseId_fkey" FOREIGN KEY ("useCaseId") REFERENCES "UseCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
