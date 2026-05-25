"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import FormTitle from "~/app/components/shared/FormTitle";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import StatusMessage from "~/app/components/shared/StatusMessageClient";
import Input from "~/app/components/shared/Input";
import { api } from "~/trpc/react";
import Link from "next/link";
import { z } from "zod"
import Loader from "~/app/components/shared/Loader";
import ServerError from "~/app/components/shared/ServerError";
import handleTRPCError from "~/app/libs/handleTRPCError";
import type { DeliveryMethod, PaymentMethod } from "generated/prisma/enums";

export default function ShippingAddress() {
    const [formInput, setFormInput] = useState<{
        fullName: string,
        phoneNumber: string,
        deliveryMethod: DeliveryMethod | "",
        paymentMethod: PaymentMethod | ""
    }>({
        fullName: "",
        phoneNumber: "",
        deliveryMethod: "",
        paymentMethod: ""
    })

    const pathname = usePathname();
    const router = useRouter();
    const utils = api.useUtils();

    const {
        data: checkoutInfo,
        isLoading,
        error
    } = api.checkout.getCheckoutInfo.useQuery();

    const {
        isSuccess,
        message,
        setIsSuccess,
        setMessage
    } = useStatusMessage();

    // Submit mutation
    const submitShippingAddressInfo = api.checkout.submitCheckoutInfo.useMutation({
        onSuccess: () => {
            router.push("/checkout/review");
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

    useEffect(() => {
        if (!checkoutInfo) return;

        setFormInput(prev => {
            return {
                ...prev,
                fullName: checkoutInfo.fullName,
                phoneNumber: checkoutInfo.phoneNumber,
                deliveryMethod: checkoutInfo.deliveryMethod as DeliveryMethod | "",
                paymentMethod: checkoutInfo.paymentMethod as PaymentMethod || ""
            }
        });

    }, [checkoutInfo])

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
        deliveryMethod: z.enum(["Standard", "Express"], "Please select a delivery method"),
        paymentMethod: z.enum(["Cash", "PayPal", "Card"], "Please select a payment method")
    })

    if (isLoading) return <Loader />

    if (error || !checkoutInfo) return <ServerError />

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] mt-16 flex flex-col justify-center items-center w-full min-h-[90vh] px-4 pb-6 pt-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <section className="w-full flex flex-col gap-2 max-w-md mx-auto">

                <section className="flex justify-end mb-2">
                    <Link
                        href="/cart"
                        className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                    >
                        Back to Cart
                    </Link>
                </section>

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

                        submitShippingAddressInfo.mutate(formInput as {
                            fullName: string,
                            phoneNumber: string,
                            deliveryMethod: DeliveryMethod,
                            paymentMethod: PaymentMethod
                        })
                    }}
                    className="shadow-md rounded-md flex flex-col p-4 "
                >

                    <FormTitle
                        heading="Shipping Address"
                        subHeading="Enter your delivery details below"
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
                            <label htmlFor="delivery-method" className="font-semibold text">Delivery Method</label>
                            <span className="text-red-500">*</span>
                        </div>
                        <select
                            value={formInput.deliveryMethod}
                            onChange={(event) => setFormInput(prev => {
                                return {
                                    ...prev,
                                    deliveryMethod: event.target.value as DeliveryMethod || ""
                                }
                            })}
                            id="delivery-method"
                            name="delivery-method"
                            className="transition-all duration-300 ease-in-out outline-none cursor-text focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-md border-gray-300 border w-full rounded-md h-10 px-4 text-sm"
                        >
                            <option value="">Please select a delivery method</option>
                            <option value="Standard">Standard</option>
                            <option value="Express">Express</option>
                        </select>
                    </section>

                    <section className="flex flex-col mb-4">
                        <div className="flex gap-1 mb-2">
                            <label htmlFor="payment-method" className="font-semibold text">Payment Method</label>
                            <span className="text-red-500">*</span>
                        </div>
                        <select
                            value={formInput.paymentMethod}
                            onChange={(event) => setFormInput(prev => {
                                return {
                                    ...prev,
                                    paymentMethod: event.target.value as PaymentMethod || ""
                                }
                            })}
                            id="payment-method"
                            name="payment-method"
                            className="transition-all duration-300 ease-in-out outline-none cursor-text focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-md border-gray-300 border w-full rounded-md h-10 px-4 text-sm"
                        >
                            <option value="">Please select a payment method</option>
                            <option value="Cash">Cash</option>
                            <option value="PayPal">PayPal</option>
                            <option value="Card">Card</option>
                        </select>
                    </section>

                    <button
                        type="submit"
                        className="cursor-pointer px-4 py-2 mt-4 block text-center w-full bg-blue-600 text-white font-medium rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]">
                        Next
                    </button>
                </form>
            </section>
        </section>
    )
}