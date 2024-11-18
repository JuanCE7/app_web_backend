/*
  Warnings:

  - You are about to drop the column `dni` on the `Entity` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Entity_dni_key";

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "dni";
