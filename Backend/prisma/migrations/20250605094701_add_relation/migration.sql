-- AlterTable
ALTER TABLE `posts` ALTER COLUMN `content_id` DROP DEFAULT,
    ALTER COLUMN `protection_id` DROP DEFAULT,
    ALTER COLUMN `situation_id` DROP DEFAULT,
    ALTER COLUMN `symptom_id` DROP DEFAULT;
