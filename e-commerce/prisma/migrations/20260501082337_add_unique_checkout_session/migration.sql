/*
  Warnings:

  - A unique constraint covering the columns `[userId,status]` on the table `CheckoutSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CheckoutSession_userId_status_key" ON "CheckoutSession"("userId", "status");
