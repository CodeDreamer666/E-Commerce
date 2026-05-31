import Link from "next/link";
import { api } from "~/trpc/server";

export default async function SuccessOrder({
    params
}: {
    params: Promise<{ orderId: string }>
}) {
    const { orderId } = await params;

    const order = await api.order.getSelectedOrder({ orderId });

    return (
        <div className="mt-16 bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] flex min-h-[90vh] items-center justify-center px-4 py-8">

            <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-md">

                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Order Confirmed
                    </h1>

                    <p className="text-gray-500">
                        Thank you for your purchase. We've received your order
                        and will begin processing it shortly.
                    </p>
                </div>

                {/* Order Details */}
                <section className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5">

                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Order Details
                    </h2>

                    <div className="space-y-3">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Order Number
                            </span>

                            <span className="font-medium text-gray-900">
                                {orderId.slice(-8)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Status
                            </span>

                            <span className="font-medium text-green-600">
                                {order.status}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Payment Method
                            </span>

                            <span className="font-medium text-gray-900">
                                {order.paymentMethod}
                            </span>
                        </div>

                    </div>

                </section>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/order"
                        className="rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white transition-all duration-200 hover:bg-blue-700"
                    >
                        View Orders
                    </Link>

                    <Link
                        href="/"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </section>
        </div>
    );
}