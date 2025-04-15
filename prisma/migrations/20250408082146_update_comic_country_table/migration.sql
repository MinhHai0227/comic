/*
  Warnings:

  - You are about to drop the column `careate_at` on the `comic` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `country` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapter_image_url` to the `chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `country` table without a default value. This is not possible if the table is not empty.

*/
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

-- AlterTable
ALTER TABLE `chapter` ADD COLUMN `chapter_image_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `comic` DROP COLUMN `careate_at`,
    ADD COLUMN `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `country` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `country_slug_key` ON `country`(`slug`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_coinId_fkey` FOREIGN KEY (`coinId`) REFERENCES `Coin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comic` ADD CONSTRAINT `comic_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter` ADD CONSTRAINT `chapter_comicId_fkey` FOREIGN KEY (`comicId`) REFERENCES `comic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chapter_image` ADD CONSTRAINT `chapter_image_chapterId_fkey` FOREIGN KEY (`chapterId`) REFERENCES `chapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_A_fkey` FOREIGN KEY (`A`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_comic_category` ADD CONSTRAINT `_comic_category_B_fkey` FOREIGN KEY (`B`) REFERENCES `comic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
