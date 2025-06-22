/*
  Warnings:

  - Made the column `age` on table `worker` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `worker` MODIFY `age` INTEGER NOT NULL;
