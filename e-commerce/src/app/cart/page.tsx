"use client"
import { api } from "~/trpc/react"
import Loader from "../components/shared/Loader";
import ServerError from "../components/shared/ServerError";
import { useRouter, usePathname } from "next/navigation";
import StatusMessage from "../components/shared/StatusMessageClient";
import useStatusMessage from "../hooks/useStatusMessage";
import { useState } from "react";
import handleTRPCError from "../libs/handleTRPCError";
import React from "react";
import Link from "next/link";

export default function CartPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [productDetail, setProductDetail] = useState({
        title: "",
        id: 0
    });

    const {
        data: cart,
        isLoading,
        error
    } = api.cart.getCart.useQuery();

    const utils = api.useUtils();
    const router = useRouter();
    const pathname = usePathname();

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage,
        closeMessage
    } = useStatusMessage();

    // Select cart item mutation
    const selectCartItem = api.cart.selectCartItem.useMutation({
        onMutate: async (newData) => {
            await utils.cart.getCart.cancel();

            const previousCart = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return old;

                return old.map(item =>
                    item.productId === newData.productId
                        ? { ...item, isSelected: newData.isSelected }
                        : item
                );
            });

            return { previousCart };
        },

        onError: (error, newData, context) => {
            if (context?.previousCart) {
                utils.cart.getCart.setData(undefined, context.previousCart);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    // Select all cart items mutation
    const selectAllCartItems = api.cart.selectAllCartItems.useMutation({
        onMutate: async (newData) => {
            await utils.cart.getCart.cancel();

            const previousCart = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return old;

                return old.map((item) => {
                    return {
                        ...item,
                        isSelected: true
                    }
                })
            });

            return { previousCart };
        },

        onError: (error, newData, context) => {
            if (context?.previousCart) {
                utils.cart.getCart.setData(undefined, context.previousCart);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    // Deselect all cart items mutation
    const deselectAllCartItems = api.cart.deselectAllCartItems.useMutation({
        onMutate: async (newData) => {
            await utils.cart.getCart.cancel();

            const previousCart = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return old;

                return old.map((item) => {
                    return {
                        ...item,
                        isSelected: false
                    }
                })
            });

            return { previousCart };
        },

        onError: (error, newData, context) => {
            if (context?.previousCart) {
                utils.cart.getCart.setData(undefined, context.previousCart);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    // Delete cart item mutation
    const deleteCartItem = api.cart.deleteCartItem.useMutation({
        onMutate: async (newData) => {
            await utils.cart.getCart.cancel();

            const previousCart = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return old;

                return old.filter(item => item.productId !== newData.productId)
            });

            return { previousCart };
        },

        onError: (error, newData, context) => {
            if (context?.previousCart) {
                utils.cart.getCart.setData(undefined, context.previousCart);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    // Update cart item quantity
    const updateCartItemQuantity = api.cart.updateCartItemQuantity.useMutation({
        onMutate: async (newData) => {
            await utils.cart.getCart.cancel();

            const previousCart = utils.cart.getCart.getData();

            utils.cart.getCart.setData(undefined, (old) => {
                if (!old) return old;

                return old.map((item) => {
                    if (item.productId === newData.productId) {
                        if (newData.action === "increase") {
                            return {
                                ...item,
                                quantity: item.quantity + 1,
                                totalPrice: Number((item.quantity * Number(item.product.price)).toFixed(2))
                            }
                        } else if (newData.action === "decrease" && item.quantity > 1) {
                            return {
                                ...item,
                                quantity: item.quantity - 1,
                                totalPrice: Number((item.quantity * Number(item.product.price)).toFixed(2))
                            }
                        }
                    }

                    return item
                })
            });

            return { previousCart };
        },

        onError: (error, newData, context) => {
            if (context?.previousCart) {
                utils.cart.getCart.setData(undefined, context.previousCart);
            }

            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    // checkout mutation
    const checkout = api.checkout.checkout.useMutation({
        onSuccess: () => {
            router.push("/checkout");
        },

        onError: (error) => {
            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            });
        },

        onSettled: () => {
            utils.invalidate();
        }
    });

    if (isLoading) return <Loader />

    if (error || !cart) return <ServerError />

    const isEmpty = cart.length === 0;
    const selectedCount = cart.filter(item => item.isSelected).length

    const totalPrice = cart.reduce(
        (acc, item) => acc + (item.isSelected ? item.totalPrice : 0),
        0
    );

    return (
        <section
            className={`
                bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] 
                w-full mt-16 px-4 pb-6 pt-4 max-w-6xl mx-auto
            `}
        >

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={closeMessage}
            />

            <section className="mb-4 w-full flex flex-row justify-end items-center gap-3">
                <button
                    disabled={cart.length === 0 || selectAllCartItems.isPending}
                    onClick={() => selectAllCartItems.mutate()}
                    className={`
                       cursor-pointer disabled:cursor-not-allowed px-4 py-2 rounded-lg text-md font-semibold
                     bg-blue-600 text-white
                     hover:bg-blue-500 hover:shadow-md
                       active:scale-[0.97]
                       transition-all duration-200 flex items-center justify-center gap-2
                    `}
                >
                    Select all items
                </button>

                <button
                    disabled={cart.length === 0 || deselectAllCartItems.isPending}
                    onClick={() => deselectAllCartItems.mutate()}
                    className={`
                       cursor-pointer disabled:cursor-not-allowed px-4 py-2 rounded-lg text-md font-semibold
                     bg-white text-gray-700 border border-gray-200
                     hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm
                       active:scale-[0.97]
                       transition-all duration-200 
                    `}
                >
                    Deselect all items
                </button>
            </section>

            {cart.map(({ id, productId, quantity, totalPrice, isSelected, product, }) => {
                return (
                    <React.Fragment key={id}>
                        <section className="w-full relative">

                            <div className="h-8 flex justify-between items-center">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(event) => selectCartItem.mutate({ productId, isSelected: event.target.checked })}
                                    className="w-5 h-5 cursor-pointer text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />

                                <button
                                    onClick={() => {
                                        setIsOpen(true)
                                        setProductDetail(prev => {
                                            return {
                                                ...prev,
                                                id: product.id,
                                                title: product.title
                                            }
                                        })
                                    }}
                                    className="px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-300 text-white hover:text-black transition-all duration-300 cursor-pointer">
                                    Remove
                                </button>
                            </div>

                            <div className="grid xs:grid-cols-[150px_1fr] xs:items-center sm:grid-cols-[200px_1fr_120px] sm:items-center sm:gap-2 md:grid-cols-[200px_1fr_180px_120px] md:gap-4 md:items-center lg:grid-cols-[40px_160px_1fr_120px_120px_140px_140px] lg:gap-6 lg:max-w-300 lg:mx-auto">
                                <div className="min-w-0">
                                    <img
                                        className="w-full max-w-37.5 mx-auto object-contain"
                                        src={product.image}
                                        alt={`A picture of ${product.title}`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h1 className="font-semibold text-2xl mx mb-2">{product.title}</h1>

                                    <div className="flex my-4 max-xs:justify-between max-xs:items-center xs:flex-row xs:my-2 xs:gap-4 lg:hidden">
                                        <section className="flex flex-col xs:pl-4 md:hidden">
                                            <div className="flex gap-2 text-lg">
                                                <p className="font-semibold">Each: </p>
                                                <p className="text-red-600 font-semibold">${Number(product.price.toFixed(2))}</p>
                                            </div>
                                            <div className="flex gap-2 text-lg">
                                                <p className="font-semibold">Subtotal:</p>
                                                <p className="text-red-600 font-semibold">${Number(totalPrice.toFixed(2))}</p>
                                            </div>
                                        </section>

                                        <section className="flex gap-2 xs:my-4 xs:pl-4 sm:hidden">
                                            <button
                                                onClick={() => {
                                                    updateCartItemQuantity.mutate({
                                                        productId, action: "decrease"

                                                    })
                                                }}
                                                disabled={quantity === 1 || updateCartItemQuantity.isPending}
                                                className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-[20px] bg-gray-400 disabled:cursor-not-allowed 
                                                  hover:bg-gray-500 cursor-pointer transition-all duration-300 
                                                    rounded-full w-8 h-8
                                                `}>
                                                -
                                            </button>

                                            <p className="font-bold text-lg">{quantity}</p>

                                            <button
                                                disabled={updateCartItemQuantity.isPending}
                                                onClick={() => updateCartItemQuantity.mutate({ productId, action: "increase" })}
                                                className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-[20px] bg-gray-400 disabled:cursor-not-allowed 
                                                  hover:bg-gray-500 cursor-pointer transition-all duration-300 
                                                    rounded-full w-8 h-8
                                                `}>
                                                +
                                            </button>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="mt-2 w-full h-px mb-4 bg-gray-300" />
                    </React.Fragment>
                )
            })}

            {isOpen && (
                <section
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center w-full h-screen fixed inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
                >
                    <section
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white shadow-2xl border border-gray-100 p-6 rounded-2xl w-[92%] max-w-96 flex flex-col gap-5 animate-[scaleIn_0.2s_ease-out]"
                    >
                        <h2 className="font-semibold text-[18px] text-gray-900">
                            Are you sure you want to remove
                            <span className="font-bold text-black"> {productDetail.title} </span>
                            from your cart?
                        </h2>

                        <section className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer px-4 py-2 rounded-lg border border-gray-200
                                         bg-gray-100 text-gray-700 font-medium
                                         hover:bg-gray-200 hover:text-gray-900 hover:shadow-sm
                                           transition-all duration-200 active:scale-[0.97]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    deleteCartItem.mutate({ productId: productDetail.id })
                                }}
                                className="px-4 cursor-pointer py-2 rounded-lg border border-red-500 bg-linear-to-b 
                                         from-red-500 to-red-600 text-white font-semibold
                                         hover:from-red-600 hover:to-red-700 hover:shadow-md
                                           transition-all duration-200 active:scale-[0.97]"
                            >
                                Remove
                            </button>
                        </section>
                    </section>
                </section>
            )}

            {isEmpty ? (
                <>
                    <p className="text-center mt-8 font-semibold text-lg">Your cart is empty</p>
                    <Link
                        href="/"
                        className={`mt-2 flex gap-2 justify-center items-center w-full bg-blue-400 font-semibold rounded-md text-lg py-2 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <p>Start Shopping</p>
                    </Link>
                </>
            ) : (
                <section className="mt-4 flex justify-center items-end flex-col">
                    <section className="text-lg flex gap-2 items-center font-bold">
                        <h2 className="">Total ({selectedCount} items):</h2>
                        <p className="text-gray-800">${totalPrice.toFixed(2)}</p>
                    </section>
                    <button
                        disabled={checkout.isPending}
                        onClick={() => checkout.mutate()}
                        className={`
                              disabled:cursor-not-allowed mt-2 flex gap-2 justify-center 
                              items-center w-full bg-blue-400 font-semibold rounded-md text-lg 
                              py-2 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:text-white
                        `}
                    >

                        <div className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            Checkout
                        </div>

                    </button>
                </section>
            )}
        </section>
    )
}