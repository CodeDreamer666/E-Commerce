import { TRPCError } from "@trpc/server";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const checkoutRouter = createTRPCRouter({
    getCheckoutItems: protectedProcedure
        .query(async ({ ctx }) => {
            const userId = ctx.session.user.id;

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
                    message: "Please select products before proceeding to checkout"
                })
            }

            return selectedCartItems
        }),
})