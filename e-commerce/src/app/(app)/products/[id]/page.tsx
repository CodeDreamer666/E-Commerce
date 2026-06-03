"use client"
import { useState } from "react";
import StatusMessage from "~/app/components/shared/StatusMessageClient";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import { api } from "~/trpc/react";
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import handleTRPCError from "~/app/libs/handleTRPCError";
import { useParams, useRouter, usePathname } from "next/navigation";

export default function ProductDetailClient() {
    const params = useParams<{ id: string }>();
    const {
        data: productDetail,
        isLoading,
        error
    } = api.products.getOneProductDetail.useQuery({ productId: Number(params.id) });

    const router = useRouter();
    const pathname = usePathname();
    const utils = api.useUtils();

    // Add cart item mutation
    const addCartItem = api.cart.addCartItem.useMutation({
        onSuccess: (newData) => {
            router.push("/")
        },

        onError: (err) => {
            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [productQuantity, setProductQuantity] = useState(1);
    const {
        setMessage,
        setIsSuccess,
        message,
        isSuccess
    } = useStatusMessage();

    if (isLoading) return <Loader />

    if (error || !productDetail) return <ServerError />

    const {
        id,
        title,
        description,
        price,
        stock,
        warrantyInformation,
        shippingInformation,
        availabilityStatus,
        returnPolicy,
        review,
        image
    } = productDetail;

    function formatDate(dateStr: Date) {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] w-full">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <div className="p-4 md:p-8">
                <section className="grid md:grid-cols-[350px_1fr] md:mt-20 md:items-center md:justify-center lg:grid-cols-[480px_1fr] lg:max-w-260 lg:mx-auto">
                    <img
                        className="mt-16 w-full max-h-75 object-contain"
                        src={image}
                        alt={`A picture of ${title}`}
                    />

                    <div>
                        <div className="flex flex-row gap-4 items-center justify-between">
                            <h1 className="font-bold text-2xl">{title}</h1>
                            <span className="text-black/80 font-bold text-xl">${price.toFixed(2)}</span>
                        </div>

                        <p className="ml-4 mt-2 text-gray-700 font-semibold">
                            {description}
                        </p>

                        <h2 className="mt-6 text-lg font-bold">
                            Stock: <span className="text-gray-700">{stock} ( {availabilityStatus} )</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Shipping Information: <span className="text-gray-700">{shippingInformation}</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Warranty Information: <span className="text-gray-700">{warrantyInformation}</span>
                        </h2>

                        <h2 className="text-lg font-bold">
                            Return Policy: <span className="text-gray-700">{returnPolicy}</span>
                        </h2>

                        <button
                            onClick={() => {
                                setIsCartOpen(!isCartOpen);
                            }}
                            className="max-md:hidden w-full mt-6 mx-auto bg-black/80 text-white py-2 font-bold rounded-lg hover:bg-white hover:text-black/80 transition-all duration-300 cursor-pointer">
                            Add to Cart
                        </button>
                    </div>
                </section>

                {review ? (
                    <section className="max-w-260 mx-auto">
                        <h2 className="text-lg font-bold mt-4">Reviews: </h2>

                        <ul className="w-full flex flex-col gap-4 mt-2 mb-6 lg:grid lg:grid-cols-2">
                            {review.map(({ rating, createdAt, comment, id, name }) => {
                                return (
                                    <li
                                        key={id}
                                        className="w-full bg-white shadow-md rounded-lg p-4 border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-lg">{name}</h3>
                                            <p className="text-gray-500 text-sm">{formatDate(createdAt)}</p>
                                        </div>

                                        <div className="flex items-center mb-2">
                                            <span className="font-bold text-yellow-600">{rating}★</span>
                                        </div>

                                        <p className="text-gray-700">{comment}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </section>
                ) :
                    <p className="font-semibold mt-4 text-[20px]">
                        No reviews available
                    </p>
                }

                <button
                    onClick={() => {
                        setIsCartOpen(!isCartOpen);
                    }}
                    className="md:hidden w-full mt-6 mx-auto bg-black/80 text-white py-2 font-bold rounded-lg hover:bg-white hover:text-black/80 transition-all duration-300 cursor-pointer">
                    Add to Cart
                </button>
            </div>

            {isCartOpen && (
                <>
                    <section
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 z-50 mx-auto flex justify-center items-center">
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white shadow-lg p-4 rounded-lg w-[95%] max-w-100">
                            <div className="flex justify-between">
                                <h1 className="text-3xl font-bold">Cart</h1>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="font-semibold mr-2 cursor-pointer hover:scale-120 transition-all duration-300">
                                    X
                                </button>
                            </div>
                            <img src={image} alt={`A picture of ${title}`} className="object-contain w-6/10 mx-auto" />
                            <div className="flex gap-4 items-center">
                                <h2 className="text-2xl font-semibold">Quantity:</h2>
                                <div className="flex gap-4 items-center">
                                    <button
                                        onClick={() => setProductQuantity(productQuantity - 1)}
                                        disabled={productQuantity === 1}
                                        className="font-bold disabled:cursor-not-allowed text-lg hover:bg-gray-500 transition-all duration-300 bg-gray-300 px-6 py-2 rounded-full cursor-pointer">
                                        -
                                    </button>
                                    <p className="font-bold text-[20px]">{productQuantity}</p>
                                    <button
                                        onClick={() => setProductQuantity(productQuantity + 1)}
                                        className="font-bold text-lg hover:bg-gray-500 transition-all duration-300 bg-gray-300 px-6 py-2 rounded-full cursor-pointer">
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <h2 className="text-2xl font-semibold">Price:</h2>
                                <p className="font-bold text-[20px] mt-0.5">${Number((price * productQuantity).toFixed(2))}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCartOpen(false);
                                    addCartItem.mutate({
                                        productId: id,
                                        quantity: productQuantity,
                                        unitPrice: Number(price.toFixed(2))
                                    })
                                }}
                                className="mt-4 w-full font-bold text-[20px] bg-black text-white rounded-lg py-1 cursor-pointer hover:bg-gray-200 hover:text-black transition-all duration-300">
                                Add to Cart
                            </button>
                        </div>
                    </section>

                    <div className="bg-black/40 inset-0 fixed cursor-pointer z-40" />
                </>
            )}
        </section>
    )
}
