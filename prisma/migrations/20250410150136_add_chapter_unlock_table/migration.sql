-- DropIndex
DROP INDEX `chapter_comicId_fkey` ON `chapter`;

-- DropIndex
DROP INDEX `chapter_image_chapterId_fkey` ON `chapter_image`;

-- DropIndex
DROP INDEX `comic_countryId_fkey` ON `comic`;

-- DropIndex
DROP INDEX `Transaction_coinId_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_userId_fkey` ON `transaction`;

-- CreateTable
CREATE TABLE `chapter_unlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `chapterId` INTEGER NOT NULL,
    `unlock_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_coinId_fkey` FOREIGN KEY (`coinId`) REFERENCES `Coin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic` ADD CONSTRAINT `comic_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter` ADD CONSTRAINT `chapter_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_image` ADD CONSTRAINT `chapter_image_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_unlock` ADD CONSTRAINT `chapter_unlock_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_unlock` ADD CONSTRAINT `chapter_unlock_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
