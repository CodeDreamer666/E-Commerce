import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
    placeOrder: protectedProcedure
        .input(z.object({
            fullName: z.string().trim().min(1, "Min 1 character for full name").max(20, "Max 20 characters for full name"),
            phoneNumber: z.coerce.number().int().positive().min(10000000, "Phone number must be exactly 8 digits").max(99999999, "Phone number must be exactly 8 digits"),
            deliveryMethod: z.enum(["Standard", "Express"], "Please select a delivery method"),
            paymentMethod: z.enum(["Cash", "PayPal", "Card"], "Please select a payment method")
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;
            let orderId = "";

            const selectedCartItems = await ctx.db.cart.findMany({
                where: {
                    userId,
                    isSelected: true
                },
                include: {
                    product: true
                }
            });

            if (!selectedCartItems || selectedCartItems.length === 0) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Please select products before placing products"
                })
            }

            const orderTotalPrice = selectedCartItems.reduce((acc, currentValue) => {
                return acc + Number(currentValue.totalPrice)
            }, 0);

            await ctx.db.$transaction(async (tx) => {
                const order = await tx.order.create({
                    data: {
                        userId,
                        fullName: input.fullName,
                        phoneNumber: input.phoneNumber.toString(),
                        deliveryMethod: input.deliveryMethod,
                        paymentMethod: input.paymentMethod,
                        totalPrice: orderTotalPrice + (input.deliveryMethod === "Standard" ? 5 : 12)
                    }
                });

                orderId = order.id

                await tx.orderItem.createMany({
                    data: selectedCartItems.map((cartItem) => {
                        return {
                            orderId: order.id,
                            productId: cartItem.productId,
                            quantity: cartItem.quantity,
                            totalPrice: cartItem.totalPrice
                        }
                    })
                });

                await tx.cart.deleteMany({
                    where: {
                        userId,
                        isSelected: true
                    }
                })
            })

            return {
                success: true,
                messasge: "Place order successfully",
                orderId
            }
        }),

    getSelectedOrder: protectedProcedure
        .input(z.object({
            orderId: z.string().nonempty()
        }))
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const order = await ctx.db.order.findUnique({
                where: {
                    userId,
                    id: input.orderId
                }
            });

            if (!order) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Order not found"
                })
            }

            return order
        }),

    getAllOrder: protectedProcedure
        .query(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const orders = await ctx.db.order.findMany({
                where: {
                    userId
                }
            });

            return orders;
        })
})