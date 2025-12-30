/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `userType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User_userCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "department" TEXT,
ADD COLUMN     "expiry" TIMESTAMP(3),
ADD COLUMN     "functionName" TEXT,
ADD COLUMN     "zone" TEXT,
ALTER COLUMN "userCode" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
DROP COLUMN "userType",
ADD COLUMN     "userType" TEXT;
