/*
  Warnings:

  - The primary key for the `summoner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `summoner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `summoner` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`puuid`);

-- CreateTable
CREATE TABLE `Match` (
    `matchId` VARCHAR(191) NOT NULL,
    `userPuuid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`matchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Match` ADD CONSTRAINT `Match_userPuuid_fkey` FOREIGN KEY (`userPuuid`) REFERENCES `Summoner`(`puuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `summoner` RENAME INDEX `summoner_puuid_key` TO `Summoner_puuid_key`;
