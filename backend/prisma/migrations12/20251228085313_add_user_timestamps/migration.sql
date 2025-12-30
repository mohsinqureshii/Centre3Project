/*
  Warnings:

  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `functionName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `zone` on the `User` table. All the data in the column will be lost.
  - The `userType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `userCode` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "department",
DROP COLUMN "expiry",
DROP COLUMN "functionName",
DROP COLUMN "zone",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userCode" SET NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL,
DROP COLUMN "userType",
ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'INTERNAL';

-- CreateIndex
CREATE UNIQUE INDEX "User_userCode_key" ON "User"("userCode");
