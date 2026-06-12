import Link from "next/link";
import { api } from "~/trpc/server";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const order = await api.order.getSelectedOrder({ orderId });
    const shippingFee = order.deliveryMethod === "Express" ? 12 : 5

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-blue-50 text-blue-700";

            case "CANCELLED":
                return "bg-red-50 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <main className="min-h-screen mt-16 bg-gradient-to-b from-blue-50/60 via-white to-white p-4">
            <section className="mx-auto max-w-4xl space-y-4 pb-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center pt-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            Order details
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Review information about your order.
                        </p>
                    </div>

                    <Link
                        href="/order"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                        ← My orders
                    </Link>
                </div>

                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h2>

                            <p className="mt-1 text-slate-500">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <span
                            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                                order.status
                            )}`}
                        >
                            {order.status}
                        </span>

                    </div>

                </section>

                {/* Customer Information */}
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-900">
                        Customer information
                    </h2>

                    <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">

                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-sm text-slate-400">
                                Full name
                            </p>

                            <p className="font-semibold text-slate-900 mt-0.5">
                                {order.fullName}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-sm text-slate-400">
                                Phone number
                            </p>

                            <p className="font-semibold text-slate-900 mt-0.5">
                                {order.phoneNumber}
                            </p>
                        </div>

                    </div>

                </section>

                {/* Delivery & Payment */}
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-900">
                        Delivery & payment
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-sm text-slate-400">
                                Delivery method
                            </p>

                            <p className="font-semibold text-slate-900 mt-0.5">
                                {order.deliveryMethod}
                            </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4">
                            <p className="text-sm text-slate-400">
                                Payment method
                            </p>

                            <p className="font-semibold text-slate-900 mt-0.5">
                                {order.paymentMethod}
                            </p>
                        </div>

                    </div>

                </section>

                {/* Products */}
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-900">
                        Ordered items
                    </h2>

                    <div className="flex flex-col gap-3">

                        {order.orderItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 items-center bg-slate-50 rounded-2xl p-3"
                            >

                                <div className="bg-white rounded-xl shrink-0 w-16 h-16 flex items-center justify-center overflow-hidden border border-slate-100">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.title}
                                        className="object-contain max-h-12 max-w-12"
                                    />
                                </div>

                                <div className="flex flex-1 items-center justify-between min-w-0">

                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-900 truncate">
                                            {item.product.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-bold text-blue-600 whitespace-nowrap pl-4">
                                        ${item.product.price.toFixed(2)}
                                    </p>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

                {/* Price Summary */}
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-slate-900">
                        Summary
                    </h2>

                    <div className="space-y-3">

                        <div className="flex justify-between text-slate-500 text-sm">
                            <span>Subtotal</span>
                            <span>${(Number(order.totalPrice) - shippingFee).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-slate-500 text-sm">
                            <span>Shipping fee</span>
                            <span>${shippingFee}</span>
                        </div>

                        <div className="border-t border-slate-100 pt-3 flex justify-between text-lg font-semibold text-slate-900">
                            <span>Total</span>
                            <span className="text-blue-600">${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}