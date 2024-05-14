-- CreateTable
CREATE TABLE `Reservation` (
    `id` varchar(191) NOT NULL,
    `roomId` varchar(191) DEFAULT NULL,
    `userId` varchar(191) NOT NULL,
    `startDate` datetime(3) NOT NULL,
    `endDate` datetime(3) NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `Reservation_userId_key` (`userId`),
    KEY `Reservation_roomId_fkey` (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` varchar(191) NOT NULL,
    `roomId` varchar(191) NOT NULL,
    `status` varchar(191) NOT NULL DEFAULT 'available',

    PRIMARY KEY (`id`),
    UNIQUE KEY `Room_roomId_key` (`roomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE;
