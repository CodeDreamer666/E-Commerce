import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
    getAllProduct: publicProcedure
        .query(async ({ ctx }) => {
            const productData = await ctx.db.product.findMany()
            return productData.map((product) => {
                return {
                    ...product,
                    price: Number(product.price.toFixed(2)),
                    discountedPercentage: Number(product.discountedPercentage.toFixed(2)),
                    rating: Number(product.rating.toFixed(2))
                }
            })
        }),

    getOneProductDetail: publicProcedure
        .input(z.object({ productId: z.number().int().positive() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.db.product.findUnique({
                where: {
                    id: input.productId
                },
                include: {
                    review: true
                }
            })

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found"
                })
            }

            return {
                ...product,
                price: Number(product.price.toFixed(2)),
                discountedPercentage: Number(product.discountedPercentage.toFixed(2)),
                rating: Number(product.rating.toFixed(2)),
                review: product.review.map((review) => {
                    return {
                        ...review,
                        rating: Number(review.rating.toFixed(2))
                    }
                })
            }
        })
})
