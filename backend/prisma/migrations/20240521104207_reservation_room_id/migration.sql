-- DropForeignKey
ALTER TABLE `Reservation` DROP FOREIGN KEY `Reservation_roomId_fkey`;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`roomId`) ON DELETE SET NULL ON UPDATE CASCADE;
