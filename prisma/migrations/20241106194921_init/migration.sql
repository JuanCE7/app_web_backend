/*
  Warnings:

  - You are about to drop the column `projectCode` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_projectCode_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "projectCode",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "Project"("code");
