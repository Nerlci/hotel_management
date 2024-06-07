/*
  Warnings:

  - Added the required column `roomId` to the `DiningRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DiningRecord` ADD COLUMN `roomId` VARCHAR(191) NOT NULL;
