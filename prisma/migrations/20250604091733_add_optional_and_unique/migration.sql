/*
  Warnings:

  - A unique constraint covering the columns `[siret]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[adress]` on the table `Computer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mail]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mail` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `computer` DROP FOREIGN KEY `Computer_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `computer` DROP FOREIGN KEY `Computer_worker_id_fkey`;

-- DropForeignKey
ALTER TABLE `worker` DROP FOREIGN KEY `Worker_company_id_fkey`;

-- DropIndex
DROP INDEX `Computer_company_id_fkey` ON `computer`;

-- DropIndex
DROP INDEX `Computer_worker_id_fkey` ON `computer`;

-- DropIndex
DROP INDEX `Worker_company_id_fkey` ON `worker`;

-- AlterTable
ALTER TABLE `company` MODIFY `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `computer` MODIFY `company_id` INTEGER NULL,
    MODIFY `worker_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `worker` ADD COLUMN `mail` VARCHAR(191) NOT NULL,
    MODIFY `age` INTEGER NULL,
    MODIFY `gender` VARCHAR(191) NULL,
    MODIFY `company_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Company_siret_key` ON `Company`(`siret`);

-- CreateIndex
CREATE UNIQUE INDEX `Computer_adress_key` ON `Computer`(`adress`);

-- CreateIndex
CREATE UNIQUE INDEX `Worker_mail_key` ON `Worker`(`mail`);

-- AddForeignKey
ALTER TABLE `Worker` ADD CONSTRAINT `Worker_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Computer` ADD CONSTRAINT `Computer_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Computer` ADD CONSTRAINT `Computer_worker_id_fkey` FOREIGN KEY (`worker_id`) REFERENCES `Worker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
