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
        <section className="bg-gradient-to-b from-blue-50/60 via-white to-white w-full min-h-screen">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <div className="p-4 md:p-8">
                <section className="grid gap-6 md:grid-cols-[360px_1fr] md:gap-12 md:mt-20 md:items-center lg:grid-cols-[440px_1fr] lg:max-w-260 lg:mx-auto">

                    <div className="mt-16 md:mt-0 bg-white rounded-3xl border border-slate-100 shadow-md aspect-square flex items-center justify-center overflow-hidden">
                        <img
                            className="w-full h-full object-contain p-8"
                            src={image}
                            alt={`A picture of ${title}`}
                        />
                    </div>

                    <div>
                        <div className="flex flex-row gap-4 items-start justify-between">
                            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">{title}</h1>
                            <span className="text-blue-600 font-bold text-xl sm:text-2xl whitespace-nowrap">${price.toFixed(2)}</span>
                        </div>

                        <p className="mt-3 text-slate-600 leading-relaxed">
                            {description}
                        </p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Stock</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{stock} units · {availabilityStatus}</p>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Shipping</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{shippingInformation}</p>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Warranty</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{warrantyInformation}</p>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Returns</p>
                                <p className="mt-1 text-sm font-medium text-slate-800">{returnPolicy}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsCartOpen(!isCartOpen);
                            }}
                            className="max-md:hidden w-full mt-6 bg-blue-600 text-white py-3 font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] shadow-sm transition-all duration-200 cursor-pointer">
                            Add to cart
                        </button>
                    </div>
                </section>

                {review ? (
                    <section className="max-w-260 mx-auto mt-10">
                        <h2 className="text-lg font-bold text-slate-900">Reviews</h2>

                        <ul className="w-full flex flex-col gap-4 mt-3 mb-6 lg:grid lg:grid-cols-2">
                            {review.map(({ rating, createdAt, comment, id, name }) => {
                                return (
                                    <li
                                        key={id}
                                        className="w-full bg-white shadow-sm rounded-2xl p-4 border border-slate-100"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-slate-900">{name}</h3>
                                            <p className="text-slate-400 text-sm">{formatDate(createdAt)}</p>
                                        </div>

                                        <div className="flex items-center mb-2">
                                            <span className="font-bold text-amber-500">{rating}★</span>
                                        </div>

                                        <p className="text-slate-600">{comment}</p>
                                    </li>
                                )
                            })}
                        </ul>
                    </section>
                ) :
                    <p className="font-semibold mt-8 text-lg text-slate-400 text-center">
                        No reviews available
                    </p>
                }

                <button
                    onClick={() => {
                        setIsCartOpen(!isCartOpen);
                    }}
                    className="md:hidden w-full mt-6 bg-blue-600 text-white py-3 font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] shadow-sm transition-all duration-200 cursor-pointer">
                    Add to cart
                </button>
            </div>

            {isCartOpen && (
                <>
                    <section
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 z-50 mx-auto flex justify-center items-center px-4">
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white shadow-2xl p-5 rounded-3xl w-full max-w-100">
                            <div className="flex justify-between items-center">
                                <h1 className="text-2xl font-bold text-slate-900">Cart</h1>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    aria-label="Close"
                                    className="h-8 w-8 grid place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold cursor-pointer transition-colors duration-200">
                                    ×
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-2xl mt-4 flex items-center justify-center overflow-hidden">
                                <img src={image} alt={`A picture of ${title}`} className="object-contain w-3/5 h-3/5" />
                            </div>

                            <div className="flex gap-4 items-center justify-between mt-5">
                                <h2 className="text-base font-semibold text-slate-900">Quantity</h2>
                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() => setProductQuantity(productQuantity - 1)}
                                        disabled={productQuantity === 1}
                                        className="font-bold disabled:opacity-40 disabled:cursor-not-allowed text-lg text-blue-600 hover:bg-blue-100 transition-colors duration-200 bg-blue-50 w-10 h-10 rounded-full cursor-pointer">
                                        -
                                    </button>
                                    <p className="font-bold text-lg text-slate-900 min-w-6 text-center">{productQuantity}</p>
                                    <button
                                        onClick={() => setProductQuantity(productQuantity + 1)}
                                        className="font-bold text-lg text-blue-600 hover:bg-blue-100 transition-colors duration-200 bg-blue-50 w-10 h-10 rounded-full cursor-pointer">
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Total</h2>
                                <p className="font-bold text-xl text-blue-600">${Number((price * productQuantity).toFixed(2))}</p>
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
                                className="mt-5 w-full font-semibold text-base bg-blue-600 text-white rounded-xl py-3 cursor-pointer hover:bg-blue-700 active:scale-[0.99] shadow-sm transition-all duration-200">
                                Add to cart
                            </button>
                        </div>
                    </section>

                    <div className="bg-slate-900/30 backdrop-blur-sm inset-0 fixed cursor-pointer z-40" />
                </>
            )}
        </section>
    )
}