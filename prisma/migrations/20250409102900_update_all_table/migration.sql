/*
  Warnings:

  - You are about to alter the column `create_at` on the `category` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_at` on the `category` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `auto_unlock_time` on the `chapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `chapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_at` on the `chapter` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `coin` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_at` on the `comic` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `comic` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `country` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_at` on the `country` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `create_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - You are about to alter the column `update_at` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

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
ALTER TABLE `category` MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `chapter` MODIFY `auto_unlock_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `coin` MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `comic` MODIFY `update_at` DATETIME(0) NOT NULL,
    MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `country` MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `user` MODIFY `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `update_at` DATETIME(0) NOT NULL;

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
