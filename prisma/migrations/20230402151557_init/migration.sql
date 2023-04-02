-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firebaseUid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_firebaseUid_key`(`firebaseUid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrayerRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PrayerRecord_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrayerStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prayerRecordId` INTEGER NOT NULL,
    `prayerName` ENUM('Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha') NOT NULL,
    `prayerStatus` ENUM('Jamaah', 'OnTime', 'Late', 'Missed', 'Qadaa', 'None') NOT NULL DEFAULT 'None',

    UNIQUE INDEX `PrayerStatus_prayerRecordId_key`(`prayerRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PrayerRecord` ADD CONSTRAINT `PrayerRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrayerStatus` ADD CONSTRAINT `PrayerStatus_prayerRecordId_fkey` FOREIGN KEY (`prayerRecordId`) REFERENCES `PrayerRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
