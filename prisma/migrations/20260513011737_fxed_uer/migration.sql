/*
  Warnings:

  - You are about to drop the column `email` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - Added the required column `name` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tournament_email_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
