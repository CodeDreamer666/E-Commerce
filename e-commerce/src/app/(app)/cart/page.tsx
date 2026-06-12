"use client"
import { api } from "~/trpc/react"
import Loader from "../../components/shared/Loader";
import ServerError from "../../components/shared/ServerError";
import { useRouter, usePathname } from "next/navigation";
import StatusMessage from "../../components/shared/StatusMessageClient";
import useStatusMessage from "../../hooks/useStatusMessage";
import { useState } from "react";
import handleTRPCError from "../../libs/handleTRPCError";
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
                bg-gradient-to-b from-blue-50/60 via-white to-white 
                w-full min-h-screen mt-16 px-4 pb-6 pt-6 max-w-6xl mx-auto
            `}
        >

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={closeMessage}
            />

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4">Your cart</h1>

            {!isEmpty && (
                <section className="mb-4 w-full flex flex-row justify-end items-center gap-3">
                    <button
                        disabled={cart.length === 0 || selectAllCartItems.isPending}
                        onClick={() => selectAllCartItems.mutate()}
                        className={`
                           cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold
                         bg-blue-600 text-white
                         hover:bg-blue-700 hover:shadow-md
                           active:scale-[0.97]
                           transition-all duration-200 flex items-center justify-center gap-2
                        `}
                    >
                        Select all
                    </button>

                    <button
                        disabled={cart.length === 0 || deselectAllCartItems.isPending}
                        onClick={() => deselectAllCartItems.mutate()}
                        className={`
                           cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-semibold
                         bg-white text-slate-600 border border-slate-200
                         hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm
                           active:scale-[0.97]
                           transition-all duration-200 
                        `}
                    >
                        Deselect all
                    </button>
                </section>
            )}

            <div className="flex flex-col gap-3">
                {cart.map(({ id, productId, quantity, totalPrice, isSelected, product, }) => {
                    return (
                        <section
                            key={id}
                            className="w-full relative bg-white rounded-3xl border border-slate-100 shadow-sm p-4"
                        >

                            <div className="flex justify-between items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(event) => selectCartItem.mutate({ productId, isSelected: event.target.checked })}
                                    className="w-5 h-5 cursor-pointer accent-blue-600 rounded"
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
                                    aria-label={`Remove ${product.title} from cart`}
                                    className="h-9 w-9 grid place-items-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col py-2 px-1 xs:grid xs:items-center xs:grid-cols-2 xs:gap-4 sm:grid-cols-4 sm:gap-6">
                                <div className="bg-slate-50 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
                                    <img
                                        className="w-full h-full max-w-37.5 mx-auto object-contain p-3"
                                        src={product.image}
                                        alt={`A picture of ${product.title}`}
                                    />
                                </div>

                                <h1 className="font-semibold text-xl text-slate-900 mb-2 xs:hidden sm:block">{product.title}</h1>

                                <div className="flex justify-between xs:flex-col xs:gap-2 mt-3 xs:mt-0">
                                    <h1 className="font-semibold text-xl text-slate-900 hidden xs:block sm:hidden">{product.title}</h1>

                                    <section className="flex flex-col gap-1">
                                        <div className="flex gap-2 text-base">
                                            <p className="font-medium text-slate-500">Each</p>
                                            <p className="text-blue-600 font-semibold">${Number(product.price.toFixed(2))}</p>
                                        </div>
                                        <div className="flex gap-2 text-base">
                                            <p className="font-medium text-slate-500">Subtotal</p>
                                            <p className="text-blue-600 font-semibold">${Number(totalPrice.toFixed(2))}</p>
                                        </div>
                                    </section>

                                    <section className="flex gap-2 items-center sm:hidden">
                                        <button
                                            onClick={() => {
                                                updateCartItemQuantity.mutate({
                                                    productId, action: "decrease"

                                                })
                                            }}
                                            disabled={quantity === 1 || updateCartItemQuantity.isPending}
                                            className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-lg text-blue-600 bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed 
                                                  hover:bg-blue-100 cursor-pointer transition-all duration-200 
                                                    rounded-full w-8 h-8
                                                `}>
                                            -
                                        </button>

                                        <p className="font-bold text-lg text-slate-900 min-w-5 text-center">{quantity}</p>

                                        <button
                                            disabled={updateCartItemQuantity.isPending}
                                            onClick={() => updateCartItemQuantity.mutate({ productId, action: "increase" })}
                                            className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-lg text-blue-600 bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed 
                                                  hover:bg-blue-100 cursor-pointer transition-all duration-200 
                                                    rounded-full w-8 h-8
                                                `}>
                                            +
                                        </button>
                                    </section>
                                </div>

                                <section className="hidden sm:flex sm:gap-2 sm:items-center sm:pl-2">
                                    <button
                                        onClick={() => {
                                            updateCartItemQuantity.mutate({
                                                productId, action: "decrease"

                                            })
                                        }}
                                        disabled={quantity === 1 || updateCartItemQuantity.isPending}
                                        className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-lg text-blue-600 bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed 
                                                  hover:bg-blue-100 cursor-pointer transition-all duration-200 
                                                    rounded-full w-8 h-8
                                                `}>
                                        -
                                    </button>

                                    <p className="font-bold text-lg text-slate-900 min-w-5 text-center">{quantity}</p>

                                    <button
                                        disabled={updateCartItemQuantity.isPending}
                                        onClick={() => updateCartItemQuantity.mutate({ productId, action: "increase" })}
                                        className={`
                                                    font-semibold flex items-center justify-center 
                                                    text-lg text-blue-600 bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed 
                                                  hover:bg-blue-100 cursor-pointer transition-all duration-200 
                                                    rounded-full w-8 h-8
                                                `}>
                                        +
                                    </button>
                                </section>

                            </div>
                        </section>
                    )
                })}
            </div>

            {isOpen && (
                <section
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center items-center w-full h-screen fixed inset-0 bg-slate-900/30 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] z-50"
                >
                    <section
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white shadow-2xl p-6 rounded-3xl w-[92%] max-w-96 flex flex-col gap-5 animate-[scaleIn_0.2s_ease-out]"
                    >
                        <h2 className="font-semibold text-lg text-slate-900">
                            Are you sure you want to remove
                            <span className="font-bold"> {productDetail.title} </span>
                            from your cart?
                        </h2>

                        <section className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer px-4 py-2 rounded-full
                                         bg-slate-100 text-slate-600 font-medium
                                         hover:bg-slate-200 hover:text-slate-900
                                           transition-all duration-200 active:scale-[0.97]"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    deleteCartItem.mutate({ productId: productDetail.id })
                                }}
                                className="px-4 cursor-pointer py-2 rounded-full bg-red-600 text-white font-semibold
                                         hover:bg-red-700 hover:shadow-md
                                           transition-all duration-200 active:scale-[0.97]"
                            >
                                Remove
                            </button>
                        </section>
                    </section>
                </section>
            )}

            {isEmpty ? (
                <section className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                    <p className="font-semibold text-lg text-slate-900">Your cart is empty</p>
                    <p className="text-slate-500 text-sm mt-1">Items you add will show up here.</p>
                    <Link
                        href="/"
                        className="mt-4 flex gap-2 justify-center items-center w-full max-w-xs mx-auto bg-blue-600 text-white font-semibold rounded-xl text-base py-2.5 cursor-pointer transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <p>Start shopping</p>
                    </Link>
                </section>
            ) : (
                <section className="mt-6 sticky bottom-4 bg-white rounded-3xl border border-slate-100 shadow-md p-4 flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <section className="text-base flex gap-2 items-center font-semibold text-slate-700">
                        <h2>Total ({selectedCount} items)</h2>
                        <p className="text-blue-600 text-xl font-bold">${totalPrice.toFixed(2)}</p>
                    </section>
                    <button
                        onClick={() => router.push("/checkout")}
                        disabled={cart.filter(cart => cart.isSelected).length === 0}
                        className={`
                              disabled:opacity-40 disabled:cursor-not-allowed flex gap-2 justify-center 
                              items-center w-full sm:w-auto bg-blue-600 font-semibold rounded-xl text-base text-white
                              px-6 py-2.5 cursor-pointer transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] shadow-sm
                        `}
                    >

                        <div className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
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