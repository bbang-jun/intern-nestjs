/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `summoner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `puuid` VARCHAR(191) NOT NULL,
    `gameName` VARCHAR(191) NOT NULL,
    `tagLine` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `summoner_puuid_key`(`puuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
