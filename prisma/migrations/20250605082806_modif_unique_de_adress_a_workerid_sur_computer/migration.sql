/*
  Warnings:

  - A unique constraint covering the columns `[worker_id]` on the table `Computer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Computer_adress_key` ON `computer`;

-- CreateIndex
CREATE UNIQUE INDEX `Computer_worker_id_key` ON `Computer`(`worker_id`);
