"use client"
import Link from "next/link"
import Input from "~/app/components/shared/Input";
import useStatusMessage from "~/app/hooks/useStatusMessage";
import StatusMessage from "~/app/components/shared/StatusMessageClient";
import { useRouter, usePathname } from "next/navigation";
import { api } from "~/trpc/react";
import Loader from "~/app/components/shared/Loader";
import handleTRPCError from "~/app/libs/handleTRPCError";
import ServerError from "~/app/components/shared/ServerError";

export default function ReviewOrder() {
    const {
        data: checkoutInfo,
        isLoading,
        error
    } = api.checkout.getCheckoutInfo.useQuery();

    const router = useRouter();
    const pathname = usePathname();
    const utils = api.useUtils();

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage
    } = useStatusMessage();

    const placeOrder = api.order.placeOrder.useMutation({
        onSuccess: (newData) => {
            router.replace("/")
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

    if (isLoading) return <Loader />

    if (error || !checkoutInfo) return <ServerError />

    const {
        fullName,
        phoneNumber,
        checkoutItems,
        deliveryMethod,
        paymentMethod
    } = checkoutInfo

    const subtotal = checkoutItems.reduce((acc, currentValue) => {
        return acc + Number(currentValue.totalPrice)
    }, 0);

    const shippingFee = deliveryMethod === "Standard" ? 5 : 12

    const inputList = [
        {
            displayText: "Full name",
            text: "full-name",
            value: fullName as string,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Phone number",
            text: "phone-number",
            value: phoneNumber as string,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Delivery Method",
            text: "delivery-method",
            value: deliveryMethod as string,
            type: "text",
            isReadOnly: true
        },
        {
            displayText: "Payment Method",
            text: "payment-method",
            value: paymentMethod as string,
            type: "text",
            isReadOnly: true
        }
    ];

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] max-w-6xl mx-auto w-full px-4 pb-6 pt-4">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <section className="flex justify-end mb-2">
                <div className="flex gap-4 max-xs:flex-col max-xs:gap-2">
                    <Link
                        href="/cart"
                        className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                    >
                        Back to Cart
                    </Link>
                    <Link
                        href="/checkout/delivery-payment"
                        className="px-4 py-2 bg-blue-600 text-center text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                    >
                        Back to previous step
                    </Link>
                </div>
            </section>

            <h2 className="text-[26px] mb-2 font-bold">Order Summary</h2>

            <section className="mb-4 grid xs:mx-auto md:max-w-4xl">
                {checkoutItems.map(({ totalPrice, quantity, product }, index) => {
                    return (
                        <section key={index} className="flex flex-col gap-4 xs:grid xs:grid-cols-2 xs:gap-2 xs:justify-center xs:items-center sm:grid-cols-[200px_1fr_180px] sm:gap-4 md:grid-cols-[180px_1fr_150px_150px]">

                            <img
                                src={product.image}
                                className="object-contain max-h-50 mx-auto"
                                alt={`A picture of ${product.title}`}
                            />

                            <h2 className="hidden sm:block text-[26px] font-semibold text-gray-900">{product.title}</h2>

                            <div className="flex flex-col gap-2 md:hidden">
                                <h2 className="text-[26px] font-semibold text-gray-900 sm:hidden">{product.title}</h2>

                                <p className="flex items-center gap-2 text-[20px]">
                                    <span className="text-gray-500 font-medium">Quantity:</span>
                                    <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                        {quantity}
                                    </span>
                                </p>

                                <p className="flex items-center gap-2 text-[20px]">
                                    <span className="text-gray-500 font-medium">Subtotal:</span>
                                    <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                        {Number(totalPrice)}
                                    </span>
                                </p>
                            </div>

                            <p className="hidden md:flex items-center gap-2 text-[20px]">
                                <span className="text-gray-500 font-medium">Quantity:</span>
                                <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                    {quantity}
                                </span>
                            </p>


                            <p className="hidden md:flex items-center gap-2 text-[20px]">
                                <span className="text-gray-500 font-medium">Subtotal:</span>
                                <span className="px-3 py-0.5 bg-gray-100 rounded-md text-gray-900 font-semibold">
                                    {Number(totalPrice)}
                                </span>
                            </p>

                        </section>
                    )
                })}
            </section>

            <h2 className="text-[26px] my-4 font-bold">Order Information</h2>

            <div className="grid xs:grid-cols-2 xs:gap-2 lg:grid-cols-4 lg:gap-2">
                {inputList.map((input) => {
                    return (
                        <Input
                            key={input.text}
                            displayText={input.displayText}
                            isReadOnly={input.isReadOnly}
                            type={input.type}
                            value={input.value.toString()}
                            text={input.text}
                        />
                    )
                })}
            </div>

            <div className="flex items-start gap-6 w-full">
                <div className="flex-1">
                    <h2 className="text-xl font-bold border-b pb-2">Payment</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p>Subtotal: ${subtotal.toFixed(2)}</p>
                        <p>Shipping: ${shippingFee.toFixed(2)}</p>
                        <p className="font-bold text-black pt-1">
                            Total: ${(subtotal + shippingFee).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold border-b pb-2">Review</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Please verify your details. You can still modify items or addresses
                        before the final step.
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-bold border-b pb-2">Actions</h2>
                <div className="flex flex-col gap-2 mt-4">
                    <Link
                        href="/cart"
                        className="w-full py-2 text-center bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700"
                    >
                        Edit Order
                    </Link>

                    <Link
                        href="/checkout/info"
                        className="w-full py-2 text-center border border-blue-600 text-blue-600 rounded text-sm font-semibold hover:bg-blue-50"
                    >
                        Change Information
                    </Link>
                </div>
            </div>

            <button
                type="button"
                onClick={() => placeOrder.mutate()}
                className="cursor-pointer px-4 py-2 mt-8 block text-center w-full bg-blue-600 text-white font-semibold rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            >
                Place Order
            </button>
        </section>
    )
}