-- DropIndex
DROP INDEX `chapter_unlock_chapterId_fkey` ON `chapter_unlock`;

-- DropIndex
DROP INDEX `chapter_unlock_userId_fkey` ON `chapter_unlock`;

-- DropIndex
DROP INDEX `comic_follower_comicId_fkey` ON `comic_follower`;

-- DropIndex
DROP INDEX `comic_follower_userId_fkey` ON `comic_follower`;

-- DropIndex
DROP INDEX `comic_history_chapterId_fkey` ON `comic_history`;

-- DropIndex
DROP INDEX `comic_history_comicId_fkey` ON `comic_history`;

-- DropIndex
DROP INDEX `Transaction_coinId_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_userId_fkey` ON `transaction`;

-- CreateTable
CREATE TABLE `comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `comicId` INTEGER NULL,
    `chapterId` INTEGER NULL,
    `content` VARCHAR(191) NOT NULL,
    `parentId` INTEGER NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `comment_comicId_idx`(`comicId`),
    INDEX `comment_chapterId_idx`(`chapterId`),
    INDEX `comment_parentId_idx`(`parentId`),
    INDEX `comment_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NOT NULL,
    `seen` BOOLEAN NOT NULL DEFAULT false,
    `type` ENUM('payment', 'unlock', 'reply') NOT NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `chapter_is_lokesd_auto_unlock_time_idx` ON `chapter`(`is_lokesd`, `auto_unlock_time`);

-- CreateIndex
CREATE INDEX `chapter_unlock_chapterId_userId_idx` ON `chapter_unlock`(`chapterId`, `userId`);

-- CreateIndex
CREATE INDEX `comic_follower_userId_comicId_idx` ON `comic_follower`(`userId`, `comicId`);

-- CreateIndex
CREATE INDEX `comic_history_userId_comicId_idx` ON `comic_history`(`userId`, `comicId`);

-- CreateIndex
CREATE INDEX `comic_history_userId_idx` ON `comic_history`(`userId`);

-- CreateIndex
CREATE INDEX `User_username_idx` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_coinId_fkey` FOREIGN KEY (`coinId`) REFERENCES `Coin`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic` ADD CONSTRAINT `comic_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter` ADD CONSTRAINT `chapter_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_image` ADD CONSTRAINT `chapter_image_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_unlock` ADD CONSTRAINT `chapter_unlock_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_unlock` ADD CONSTRAINT `chapter_unlock_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic_follower` ADD CONSTRAINT `comic_follower_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic_follower` ADD CONSTRAINT `comic_follower_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic_history` ADD CONSTRAINT `comic_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic_history` ADD CONSTRAINT `comic_history_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic_history` ADD CONSTRAINT `comic_history_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `chapter` RENAME INDEX `chapter_comicId_fkey` TO `chapter_comicId_idx`;

-- RenameIndex
ALTER TABLE `chapter_image` RENAME INDEX `chapter_image_chapterId_fkey` TO `chapter_image_chapterId_idx`;

-- RenameIndex
ALTER TABLE `comic` RENAME INDEX `comic_countryId_fkey` TO `comic_countryId_idx`;
