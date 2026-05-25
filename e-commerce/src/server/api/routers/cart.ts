import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const cartRouter = createTRPCRouter({
    addCartItem: protectedProcedure
        .input(z.object({
            quantity: z.number().int().positive(),
            productId: z.number().int().positive(),
            unitPrice: z.coerce.number().positive()
        }))
        .mutation(async ({ ctx, input }) => {
            const product = await ctx.db.cart.findFirst({
                where: {
                    productId: input.productId
                }
            });

            if (product) {
                await ctx.db.cart.update({
                    where: { id: product.id },
                    data: { quantity: product.quantity + input.quantity }
                });
                return {
                    isSuccess: true,
                    message: "Update cart successfully"
                }
            }

            await ctx.db.cart.create({
                data: {
                    quantity: input.quantity,
                    productId: input.productId,
                    totalPrice: Number((input.quantity * input.unitPrice).toFixed(2)),
                    userId: ctx.session.user.id
                }
            })

            return {
                isSuccess: true,
                message: "Add to cart successfully"
            }
        }),

    getCart: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id

            const cart = await ctx.db.cart.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    product: true,
                    quantity: true,
                    totalPrice: true,
                    productId: true,
                    isSelected: true
                },
                orderBy: {
                    id: "asc"
                }
            })

            return cart.map((cart) => {
                return {
                    ...cart,
                    totalPrice: Number(cart.totalPrice.toFixed(2)),
                    product: {
                        ...cart.product,
                        price: Number(cart.product.price.toFixed(2)),
                        discountedPercentage: Number(cart.product.discountedPercentage.toFixed(2)),
                        rating: Number(cart.product.rating.toFixed(2))
                    }
                }
            })
        }),

    deleteCartItem: protectedProcedure
        .input(z.object({
            productId: z.number().int().positive(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id

            await ctx.db.cart.delete({
                where: {
                    userId_productId: {
                        productId: input.productId,
                        userId: userId
                    }
                }
            })

            return {
                isSuccess: true,
                message: "Delete cart's item successfully"
            }
        }),

    updateCartItemQuantity: protectedProcedure
        .input(z.object({
            productId: z.number().int().positive(),
            action: z.enum(["increase", "decrease"])
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            const cartItem = await ctx.db.cart.findUnique({
                where: {
                    userId_productId: {
                        productId: input.productId,
                        userId: userId
                    }
                },
                select: {
                    quantity: true,
                    product: true
                }
            });

            if (!cartItem) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Cart's item not found"
                })
            }

            let newQuantity = cartItem.quantity;

            if (input.action === "increase") {
                newQuantity += 1;
            } else {
                if (newQuantity <= 1) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Update cart's quantity unsuccessfully"
                    });
                }
                newQuantity -= 1;
            }

            await ctx.db.cart.update({
                where: {
                    userId_productId: {
                        productId: input.productId,
                        userId: userId
                    }
                },
                data: {
                    quantity: newQuantity,
                    totalPrice: Number(
                        (newQuantity * Number(cartItem.product.price)).toFixed(2)
                    )
                }
            })

            return {
                isSuccess: true,
                message: "Update cart's quantity successfully"
            }
        }),

    selectCartItem: protectedProcedure
        .input(z.object({
            productId: z.number().int().positive(),
            isSelected: z.boolean()
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            await ctx.db.cart.update({
                where: {
                    userId_productId: {
                        productId: input.productId,
                        userId: userId
                    }
                },
                data: {
                    isSelected: input.isSelected
                },
            })

            return {
                isSuccess: true,
                message: "Selection toggle successfully"
            }
        }),

    selectAllCartItems: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id

        await ctx.db.cart.updateMany({
            where: {
                userId
            },
            data: {
                isSelected: true
            }
        })

        return {
            isSuccess: true,
            message: "Selection toggle successfully"
        }
    }),

    deselectAllCartItems: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id

        await ctx.db.cart.updateMany({
            where: {
                userId
            },
            data: {
                isSelected: false
            }
        })

        return {
            isSuccess: true,
            message: "Selection toggle successfully"
        }
    }),
})