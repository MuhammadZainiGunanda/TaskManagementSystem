/*
  Warnings:

  - You are about to alter the column `dueDate` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `BigInt`.

*/
-- AlterTable
ALTER TABLE `tasks` MODIFY `dueDate` BIGINT NOT NULL;
