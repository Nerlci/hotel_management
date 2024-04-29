/*
  Warnings:

  - You are about to drop the column `windspeed` on the `ACRecord` table. All the data in the column will be lost.
  - Added the required column `fanSpeed` to the `ACRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ACRecord` DROP COLUMN `windspeed`,
    ADD COLUMN `fanSpeed` INTEGER NOT NULL;
