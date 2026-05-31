/*
  Warnings:

  - You are about to drop the `CheckoutItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckoutSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckoutItem" DROP CONSTRAINT "CheckoutItem_checkoutSessionId_fkey";

-- DropForeignKey
ALTER TABLE "CheckoutItem" DROP CONSTRAINT "CheckoutItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "CheckoutSession" DROP CONSTRAINT "CheckoutSession_userId_fkey";

-- DropTable
DROP TABLE "CheckoutItem";

-- DropTable
DROP TABLE "CheckoutSession";

-- DropEnum
DROP TYPE "CheckoutSessionStatus";
