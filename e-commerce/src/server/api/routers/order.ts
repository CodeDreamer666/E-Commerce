import { TRPCError } from "@trpc/server";
import { DeliveryMethod, PaymentMethod } from "generated/prisma/enums";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
    placeOrder: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id;

        const checkoutInfo = await ctx.db.checkoutSession.findUnique({
            where: {
                userId_status: {
                    userId,
                    status: "DRAFT"
                }
            },
            select: {
                userId: true,
                fullName: true,
                paymentMethod: true,
                deliveryMethod: true,
                postalCode: true,
                phoneNumber: true,
                checkoutItems: {
                    select: {
                        productId: true,
                        quantity: true,
                        totalPrice: true,
                    }
                }
            }
        })

        if (!checkoutInfo) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Please complete the previous step before placing order"
            })
        }

        if (
            !checkoutInfo.fullName ||
            !checkoutInfo.phoneNumber ||
            !checkoutInfo.postalCode ||
            !checkoutInfo.deliveryMethod ||
            !checkoutInfo.paymentMethod ||
            checkoutInfo.checkoutItems.length === 0
        ) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Please complete the previous step before placing order"
            })
        }

        const orderTotalPrice = checkoutInfo.checkoutItems.reduce((acc, cur) => {
            return Number((Number(cur.totalPrice) + acc).toFixed(2))
        }, 0)

        await ctx.db.$transaction(async (tx) => {
            const orderInfo = await tx.order.create({
                data: {
                    fullName: checkoutInfo.fullName as string,
                    phoneNumber: checkoutInfo.phoneNumber as string,
                    postalCode: checkoutInfo.postalCode as string,
                    deliveryMethod: checkoutInfo.deliveryMethod as DeliveryMethod,
                    paymentMethod: checkoutInfo.paymentMethod as PaymentMethod,
                    userId,
                    totalPrice: orderTotalPrice
                },
                select: {
                    id: true
                }
            })

            checkoutInfo.checkoutItems.forEach(async (item) => {
                await tx.orderItem.create({
                    data: {
                        orderId: orderInfo.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice
                    }
                })
            })
        })

        return {
            isSuccess: true,
            message: "Place order successfully"
        }
    })
})