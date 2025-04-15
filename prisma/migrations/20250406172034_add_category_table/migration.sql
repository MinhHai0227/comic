-- DropIndex
DROP INDEX `comic_countryId_fkey` ON `comic`;

-- DropIndex
DROP INDEX `Transaction_coinId_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `Transaction_userId_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `comic` ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `category_name_key`(`name`),
    UNIQUE INDEX `category_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_comic_category` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_comic_category_AB_unique`(`A`, `B`),
    INDEX `_comic_category_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_coinId_fkey` FOREIGN KEY (`coinId`) REFERENCES `Coin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic` ADD CONSTRAINT `comic_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
