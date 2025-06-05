-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_content_id_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_protection_id_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_situation_id_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_symptom_id_fkey`;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_content_id_fkey` FOREIGN KEY (`content_id`) REFERENCES `content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_protection_id_fkey` FOREIGN KEY (`protection_id`) REFERENCES `protection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_situation_id_fkey` FOREIGN KEY (`situation_id`) REFERENCES `situation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_symptom_id_fkey` FOREIGN KEY (`symptom_id`) REFERENCES `symptom`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
