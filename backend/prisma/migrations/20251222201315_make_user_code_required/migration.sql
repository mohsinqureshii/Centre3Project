/*
  Warnings:

  - Made the column `userCode` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `userCode` VARCHAR(191) NOT NULL;
