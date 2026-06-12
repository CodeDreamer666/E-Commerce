"use client"
import { useState } from "react";
import { useRouter, usePathname, redirect } from "next/navigation";
import FormTitle from "~/app/components/shared/FormTitle";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import StatusMessage from "~/app/components/shared/StatusMessageClient";
import Input from "~/app/components/shared/Input";
import { api } from "~/trpc/react";
import { z } from "zod"
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import handleTRPCError from "~/app/libs/handleTRPCError";
import LoadingIcon from "../../components/shared/LoadingIcon";
import { TRPCClientError } from "@trpc/client";

export default function ShippingAddress() {
    const [formInput, setFormInput] = useState({
        fullName: "",
        phoneNumber: "",
        deliveryMethod: "",
        paymentMethod: ""
    })
    const [shippingFee, setShippinhFee] = useState(0);

    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();

    const {
        data: checkoutItemsInfo,
        isLoading,
        error
    } = api.checkout.getCheckoutItems.useQuery();

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage
    } = useStatusMessage();

    // Submit mutation
    const placeOrder = api.order.placeOrder.useMutation({
        onSuccess: (newData) => {
            router.replace(`/order/success/${newData.orderId}`)
        },

        onError: (error) => {
            handleTRPCError({
                error, setMessage, setIsSuccess, router, pathname
            })
        },

        onSettled: async () => {
            await utils.invalidate()
        }
    });

    const inputList = [
        {
            displayText: "Full name",
            text: "full-name",
            value: formInput.fullName,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setFormInput(prev => {
                return {
                    ...prev,
                    fullName: event.target.value
                }
            }),
            type: "text",
            placeholder: "Enter your full name"
        },
        {
            displayText: "Phone number",
            text: "phone-number",
            value: formInput.phoneNumber,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setFormInput(prev => {
                return {
                    ...prev,
                    phoneNumber: event.target.value
                }
            }),
            type: "tel",
            placeholder: "Enter your phone number"
        },
    ];

    const schema = z.object({
        fullName: z.string().trim().min(1, "Min 1 character for full name").max(20, "Max 20 characters for full name"),
        phoneNumber: z.coerce.number().int().positive().min(10000000, "Phone number must be exactly 8 digits").max(99999999, "Phone number must be exactly 8 digits"),
        deliveryMethod: z.enum(["Standard", "Express"], {
            errorMap: () => ({ message: "Please select a delivery method" }),
        }),
        paymentMethod: z.enum(["Cash", "PayPal", "Card"], {
            errorMap: () => ({ message: "Please select a payment method" }),
        }),
    })

    if (isLoading) return <Loader />

    if (error instanceof TRPCClientError) {
        if (error.data.code === "BAD_REQUEST") {
            return redirect("/cart")
        }
    }

    if (error || !checkoutItemsInfo) return <ServerError />

    const subtotal = checkoutItemsInfo.reduce((acc, currentValue) => {
        return acc + Number(currentValue.totalPrice)
    }, 0);

    return (
        <section className="bg-gradient-to-b from-blue-50/60 via-white to-white mt-16 flex flex-col justify-center items-center w-full min-h-[90vh] px-4 pb-6 pt-6">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <section className="w-full flex flex-col gap-2 max-w-md mx-auto">

                <form
                    onSubmit={(event) => {
                        event.preventDefault();

                        const result = schema.safeParse(formInput);

                        if (!result.success) {
                            const firstError = result.error.issues[0]?.message;
                            setIsSuccess(false);
                            setMessage(firstError ?? "Something went wrong");
                            return;
                        }

                        placeOrder.mutate(result.data);
                    }}
                    className="bg-white shadow-md border border-slate-100 rounded-3xl flex flex-col p-5 sm:p-6"
                >

                    <FormTitle
                        heading="Delivery information"
                        subHeading="Enter your contact and delivery details"
                    />

                    {inputList.map((input) => (
                        <Input
                            key={input.text}
                            displayText={input.displayText}
                            text={input.text}
                            value={input.value}
                            onChange={input.onChange}
                            type={input.type}
                            placeholder={input.placeholder}
                        />
                    ))}

                    <section className="flex flex-col mb-4">
                        <div className="flex gap-1 mb-2">
                            <label htmlFor="delivery-method" className="font-semibold text-slate-700 text-sm">Delivery option</label>
                            <span className="text-blue-500">*</span>
                        </div>
                        <select
                            value={formInput.deliveryMethod}
                            onChange={(event) => {
                                if (event.target.value === "Standard") {
                                    setShippinhFee(5)
                                } else if (event.target.value === "Express") {
                                    setShippinhFee(12)
                                }

                                setFormInput(prev => {
                                    return {
                                        ...prev,
                                        deliveryMethod: event.target.value
                                    }
                                })
                            }}
                            id="delivery-method"
                            name="delivery-method"
                            className="transition-all duration-200 ease-in-out outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100 border-slate-200 bg-white border w-full rounded-xl h-11 px-4 text-sm text-slate-900"
                        >
                            <option value="">Please select a delivery method</option>
                            <option value="Standard">Standard</option>
                            <option value="Express">Express</option>
                        </select>
                    </section>

                    <section className="flex flex-col mb-4">
                        <div className="flex gap-1 mb-2">
                            <label htmlFor="payment-method" className="font-semibold text-slate-700 text-sm">Payment method</label>
                            <span className="text-blue-500">*</span>
                        </div>
                        <select
                            value={formInput.paymentMethod}
                            onChange={(event) => setFormInput(prev => {
                                return {
                                    ...prev,
                                    paymentMethod: event.target.value
                                }
                            })}
                            id="payment-method"
                            name="payment-method"
                            className="transition-all duration-200 ease-in-out outline-none cursor-pointer focus:border-blue-400 focus:ring-2 focus:ring-blue-100 border-slate-200 bg-white border w-full rounded-xl h-11 px-4 text-sm text-slate-900"
                        >
                            <option value="">Please select a payment method</option>
                            <option value="Cash">Cash</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Card">Card</option>
                        </select>
                    </section>

                    <FormTitle
                        heading="Order summary"
                        subHeading="Review your selected items before completing your purchase"
                    />

                    <section className="mb-4 flex flex-col gap-3">
                        {checkoutItemsInfo.map(({ totalPrice, quantity, product }, index) => {
                            return (
                                <section key={index} className="flex gap-4 items-center bg-slate-50 rounded-2xl p-3">

                                    <div className="bg-white rounded-xl shrink-0 w-20 h-20 flex items-center justify-center overflow-hidden border border-slate-100">
                                        <img
                                            src={product.image}
                                            className="object-contain max-h-16 max-w-16"
                                            alt={`A picture of ${product.title}`}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5 min-w-0">
                                        <h2 className="text-base font-semibold text-slate-900 truncate">{product.title}</h2>

                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>Quantity:</span>
                                            <span className="px-2 py-0.5 bg-blue-50 rounded-md text-blue-700 font-semibold">
                                                {quantity}
                                            </span>
                                        </p>

                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                            <span>Subtotal:</span>
                                            <span className="px-2 py-0.5 bg-blue-50 rounded-md text-blue-700 font-semibold">
                                                ${Number(totalPrice)}
                                            </span>
                                        </p>
                                    </div>
                                </section>
                            )
                        })}
                    </section>

                    <section className="mt-2 border-t border-slate-100 pt-4">
                        <div className="space-y-3">

                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-slate-500 text-sm">
                                <span>Shipping</span>
                                <span>${shippingFee.toFixed(2)}</span>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-semibold text-slate-900">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    ${(subtotal + shippingFee).toFixed(2)}
                                </span>
                            </div>

                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={placeOrder.isPending}
                        className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 mt-6 block text-center w-full bg-blue-600 text-white font-semibold rounded-xl text-base shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.99]">
                        {placeOrder.isPending ? (
                            <div className="flex items-center justify-center gap-2">
                                <LoadingIcon />
                                <p>Completing order...</p>
                            </div>
                        ) : "Complete order"}
                    </button>
                </form>
            </section>
        </section>
    )
}