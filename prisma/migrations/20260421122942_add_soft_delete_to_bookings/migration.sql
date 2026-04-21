-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Booking_deletedAt_idx" ON "Booking"("deletedAt");
