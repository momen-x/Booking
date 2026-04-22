/*
  Warnings:

  - Added the required column `paymentIntentId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_bookingId_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentIntentId" TEXT NOT NULL;
