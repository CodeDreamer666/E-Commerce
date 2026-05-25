import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const checkoutRouter = createTRPCRouter({
    checkout: protectedProcedure
        .mutation(async ({ ctx }) => {
            const userId = ctx.session.user.id

            const selectedCartInfo = await ctx.db.cart.findMany({
                where: {
                    isSelected: true
                },
                select: {
                    productId: true,
                    quantity: true,
                    totalPrice: true
                }
            })

            if (!selectedCartInfo || selectedCartInfo.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Please select products before proceeding to checkout"
                })
            }

            await ctx.db.$transaction(async (tx) => {
                const checkoutSession = await tx.checkoutSession.upsert({
                    where: {
                        userId_status: {
                            userId,
                            status: "DRAFT"
                        }
                    },
                    update: {},
                    create: {
                        userId,
                        status: "DRAFT"
                    },
                    select: {
                        id: true
                    }
                })

                await Promise.all(
                    selectedCartInfo.map((product) =>
                        tx.checkoutItem.create({
                            data: {
                                productId: product.productId,
                                quantity: product.quantity,
                                totalPrice: product.totalPrice,
                                checkoutSessionId: checkoutSession.id
                            }
                        })
                    )
                );
            })

            return {
                isSuccess: true,
                message: "Please proceed to the next section"
            }
        }),

    getCheckoutInfo: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id

        const info = await ctx.db.checkoutSession.findUnique({
            where: {
                userId_status: {
                    userId,
                    status: "DRAFT"
                }
            },
            include: {
                checkoutItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!info) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Please select products before proceeding to checkout"
            })
        }

        return {
            ...info,
            fullName: !info.fullName ? "" : info.fullName,
            phoneNumber: !info.phoneNumber ? "" : info.phoneNumber,
            deliveryMethod: !info.deliveryMethod ? "" : info.deliveryMethod,
            paymentMethod: !info.paymentMethod ? "" : info.paymentMethod
        }
    }),

    submitCheckoutInfo: protectedProcedure
        .input(z.object({
            fullName: z.string().trim().min(1, "Min 1 character for full name").max(20, "Max 20 characters for full name"),
            phoneNumber: z.coerce.number().int().positive().min(10000000, "Phone number must be exactly 8 digits").max(99999999, "Phone number must be exactly 8 digits"),
            deliveryMethod: z.enum(["Standard", "Express"], "Please select a delivery method"),
            paymentMethod: z.enum(["Cash", "PayPal", "Card"], "Please select a payment method")
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id

            await ctx.db.checkoutSession.update({
                where: {
                    userId_status: {
                        userId,
                        status: "DRAFT"
                    }
                },
                data: {
                    fullName: input.fullName,
                    phoneNumber: input.phoneNumber.toString(),
                    deliveryMethod: input.deliveryMethod,
                    paymentMethod: input.paymentMethod
                }
            })

            return {
                isSuccess: true,
                message: "Please proceed to the next section"
            }
        }),
})