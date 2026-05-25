import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  insertProductAndReview: publicProcedure.mutation(async ({ ctx }) => {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    for (const product of data.products) {
      await ctx.db.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          discountedPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          warrantyInformation: product.warrantyInformation,
          shippingInformation: product.shippingInformation,
          availabilityStatus: product.availabilityStatus,
          returnPolicy: product.returnPolicy,
          minimumOrderQuantity: product.minimumOrderQuantity,
          image: product.images[0]
        }
      })
    }

    for (const product of data.products) {
      for (const review of product.reviews) {
        await ctx.db.review.create({
          data: {
            productId: product.id,
            rating: review.rating,
            comment: review.comment,
            name: review.reviewerName,
            email: review.reviewerEmail
          }
        })
      }
    }

    return "DONE"
  }),
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
