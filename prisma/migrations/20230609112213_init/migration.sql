-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firebaseId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_firebaseId_key`(`firebaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrayerRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PrayerRecord_userId_date_key`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PrayerStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recordId` INTEGER NOT NULL,
    `name` ENUM('fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha') NOT NULL,
    `status` ENUM('jamaah', 'onTime', 'afterHalfTime', 'late', 'missed', 'qadaa', 'none') NOT NULL DEFAULT 'none',

    UNIQUE INDEX `PrayerStatus_recordId_name_key`(`recordId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemorizedSurahAyat` (
    `userId` INTEGER NOT NULL,
    `surahId` INTEGER NOT NULL,
    `startAya` INTEGER NOT NULL,
    `endAya` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `surahId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PrayerRecord` ADD CONSTRAINT `PrayerRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrayerStatus` ADD CONSTRAINT `PrayerStatus_recordId_fkey` FOREIGN KEY (`recordId`) REFERENCES `PrayerRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemorizedSurahAyat` ADD CONSTRAINT `MemorizedSurahAyat_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
