import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
                image: product.images[0],
            },
        });

        for (const review of product.reviews ?? []) {
            await prisma.review.create({
                data: {
                    productId: newProduct.id,
                    rating: review.rating,
                    comment: review.comment,
                    name: review.reviewerName,
                    email: review.reviewerEmail,
                },
            });
        }
    }

    console.log("Seeding complete");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });