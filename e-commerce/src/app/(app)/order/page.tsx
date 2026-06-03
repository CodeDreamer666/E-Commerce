import Link from "next/link";
import { api } from "~/trpc/server";

export default async function OrdersPage() {
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

    const orders = await api.order.getAllOrder();

    return (
        <main className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] mt-16 min-h-screen p-4">
            <section className="mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-500">
                        View and track your recent purchases.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <div className="mb-4 text-5xl">
                            📦
                        </div>

                        <h2 className="mb-2 text-xl font-semibold text-gray-900">
                            No Orders Yet
                        </h2>

                        <p className="mb-6 text-gray-500">
                            Your purchases will appear here once you place an order.
                        </p>

                        <Link
                            href="/"
                            className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Start Shopping
                        </Link>
                    </section>
                ) : (
                    <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">

                        {orders.map((order) => (
                            <section
                                key={order.id}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                            >

                                <div className="mb-5 flex items-start justify-between">
                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            Order #{order.id.slice(-6).toUpperCase()}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mb-5 flex gap-3 overflow-x-auto">
                                    {order.orderItems.map((product) => (
                                        <img
                                            key={product.product.title}
                                            src={product.product.image}
                                            alt={product.product.title}
                                            className="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                                        />
                                    ))}
                                </div>

                                <div className="mb-5">
                                    <p className="text-gray-700">
                                        {order.orderItems
                                            .map((product) => product.product.title)
                                            .join(", ")}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="text-xl font-semibold text-gray-900">
                                            ${order.totalPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/order/${order.id}`}
                                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}