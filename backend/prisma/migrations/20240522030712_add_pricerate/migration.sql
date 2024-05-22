/*
  Warnings:

  - Added the required column `priceRate` to the `ACRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ACRecord` ADD COLUMN `priceRate` DOUBLE NOT NULL;
