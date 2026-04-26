/*
  Warnings:

  - The `Portfolio` column on the `ProviderRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProviderRequest" DROP COLUMN "Portfolio",
ADD COLUMN     "Portfolio" TEXT[];
