/*
  Warnings:

  - A unique constraint covering the columns `[userCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `userCode` VARCHAR(191) NULL,
    ADD COLUMN `userType` ENUM('INTERNAL', 'EXTERNAL') NOT NULL DEFAULT 'INTERNAL';

-- CreateIndex
CREATE UNIQUE INDEX `User_userCode_key` ON `User`(`userCode`);
