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
        <div className="mt-16 bg-gradient-to-b from-blue-50/60 via-white to-white flex min-h-[90vh] items-center justify-center px-4 py-8">

            <section className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 shadow-md">

                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-9 text-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-slate-900 tracking-tight">
                        Order confirmed
                    </h1>

                    <p className="text-slate-500 leading-relaxed">
                        Thank you for your purchase. We've received your order
                        and will begin processing it shortly.
                    </p>
                </div>

                {/* Order Details */}
                <section className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">

                    <h2 className="mb-4 text-base font-semibold text-slate-900">
                        Order details
                    </h2>

                    <div className="space-y-3">

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Order number
                            </span>

                            <span className="font-semibold text-slate-900">
                                {orderId.slice(-8)}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Status
                            </span>

                            <span className="font-semibold text-blue-600">
                                {order.status}
                            </span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Payment method
                            </span>

                            <span className="font-semibold text-slate-900">
                                {order.paymentMethod}
                            </span>
                        </div>

                    </div>

                </section>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/order"
                        className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] shadow-sm"
                    >
                        View orders
                    </Link>

                    <Link
                        href="/"
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
                    >
                        Continue shopping
                    </Link>
                </div>
            </section>
        </div>
    );
}