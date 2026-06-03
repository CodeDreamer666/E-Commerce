import Link from "next/link";
import { api } from "~/trpc/server";

export default async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;
    const order = await api.order.getSelectedOrder({ orderId });
    const shippingFee = order.deliveryMethod === "Express" ? 12 : 5

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PAID":
                return "bg-blue-100 text-blue-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <main className="min-h-screen mt-16 bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] p-4">
            <section className="mx-auto max-w-4xl space-y-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Order Details
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Review information about your order.
                        </p>
                    </div>

                    <Link
                        href="/order"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                    >
                        ← My Orders
                    </Link>
                </div>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h2>

                            <p className="mt-1 text-gray-500">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        <span
                            className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                                order.status
                            )}`}
                        >
                            {order.status}
                        </span>

                    </div>

                </section>

                {/* Customer Information */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Customer Information
                    </h2>

                    <div className="space-y-4 sm:grid sm:grid-cols-2">

                        <div>
                            <p className="text-sm text-gray-500">
                                Full Name
                            </p>

                            <p className="font-medium text-gray-900">
                                {order.fullName}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Phone Number
                            </p>

                            <p className="font-medium text-gray-900">
                                {order.phoneNumber}
                            </p>
                        </div>

                    </div>

                </section>

                {/* Delivery & Payment */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Delivery & Payment
                    </h2>

                    <div className="grid gap-5 sm:grid-cols-2">

                        <div>
                            <p className="text-sm text-gray-500">
                                Delivery Method
                            </p>

                            <p className="font-medium text-gray-900">
                                {order.deliveryMethod}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Payment Method
                            </p>

                            <p className="font-medium text-gray-900">
                                {order.paymentMethod}
                            </p>
                        </div>

                    </div>

                </section>

                {/* Products */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Ordered Items
                    </h2>

                    <div className="space-y-4">

                        {order.orderItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 border-b border-gray-100 pb-4 last:border-none"
                            >

                                <img
                                    src={item.product.image}
                                    alt={item.product.title}
                                    width={80}
                                    height={80}
                                    className="rounded-lg border border-gray-200 object-cover"
                                />

                                <div className="flex flex-1 items-center justify-between">

                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {item.product.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        ${item.product.price.toFixed(2)}
                                    </p>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>

                {/* Price Summary */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-900">
                        Summary
                    </h2>

                    <div className="space-y-4">

                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${(Number(order.totalPrice) - shippingFee).toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between text-gray-600">
                            <span>Shipping Fee</span>
                            <span>${shippingFee}</span>
                        </div>

                        <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-semibold text-gray-900">
                            <span>Total</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}