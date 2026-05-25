/*
  Warnings:

  - You are about to drop the column `postalCode` on the `CheckoutSession` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CheckoutSession" DROP COLUMN "postalCode";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "postalCode";
