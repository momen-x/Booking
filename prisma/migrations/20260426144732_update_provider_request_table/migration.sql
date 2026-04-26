/*
  Warnings:

  - You are about to drop the column `experience` on the `ProviderRequest` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `ProviderRequest` table. All the data in the column will be lost.
  - Added the required column `IDImage` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IDNumber` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Portfolio` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationality` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provideName` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selfieIDImage` to the `ProviderRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProviderRequest" DROP COLUMN "experience",
DROP COLUMN "message",
ADD COLUMN     "IDImage" TEXT NOT NULL,
ADD COLUMN     "IDNumber" TEXT NOT NULL,
ADD COLUMN     "Portfolio" TEXT NOT NULL,
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "nationality" TEXT NOT NULL,
ADD COLUMN     "provideName" TEXT NOT NULL,
ADD COLUMN     "selfieIDImage" TEXT NOT NULL;
