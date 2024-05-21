/*
  Warnings:

  - Added the required column `target` to the `ACRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ACRecord` ADD COLUMN `target` DOUBLE NOT NULL;
