/*
  Warnings:

  - Added the required column `device_id` to the `vitals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vitals" ADD COLUMN     "device_id" TEXT NOT NULL;
