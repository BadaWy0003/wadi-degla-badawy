/*
  Warnings:

  - You are about to drop the column `drscription` on the `InvoiceItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "drscription",
ADD COLUMN     "description" TEXT;
