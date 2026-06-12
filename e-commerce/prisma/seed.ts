import { PrismaClient } from "../generated/prisma/client"
import { env } from "~/env";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Initialize the pool and adapter
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

async function main() {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    for (const product of data.products) {
        const newProduct = await prisma.product.create({
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
                image: product.images?.[0],
            },
        });

        for (const review of product.reviews) {
            await prisma.review.create({
                data: {
                    rating: review.rating,
                    comment: review.comment,
                    name: review.reviewerName,
                    email: review.reviewerEmail,
                    productId: newProduct.id
                },
            });
        }
    }

    console.log("Seed completed 🚀");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });