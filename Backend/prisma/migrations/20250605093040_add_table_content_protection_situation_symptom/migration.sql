/*
  Warnings:

  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `protection` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `situation` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `symptom` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `posts` DROP COLUMN `content`,
    DROP COLUMN `protection`,
    DROP COLUMN `situation`,
    DROP COLUMN `symptom`,
    ADD COLUMN `content_id` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `protection_id` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `situation_id` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `symptom_id` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `content` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detail` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `protection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detail` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `situation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detail` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `symptom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detail` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_protection_id_fkey` FOREIGN KEY (`protection_id`) REFERENCES `protection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_situation_id_fkey` FOREIGN KEY (`situation_id`) REFERENCES `situation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_symptom_id_fkey` FOREIGN KEY (`symptom_id`) REFERENCES `symptom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
