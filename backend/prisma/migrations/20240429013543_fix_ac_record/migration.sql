/*
  Warnings:

  - Added the required column `userId` to the `ACRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ACRecord` DROP FOREIGN KEY `ACRecord_id_fkey`;

-- AlterTable
ALTER TABLE `ACRecord` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ACRecord` ADD CONSTRAINT `ACRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
