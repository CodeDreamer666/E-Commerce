/*
  Warnings:

  - You are about to drop the column `address` on the `CheckoutSession` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CheckoutSession" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address";
