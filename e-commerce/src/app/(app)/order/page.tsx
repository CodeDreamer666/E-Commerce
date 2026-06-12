import Link from "next/link";
import { api } from "~/trpc/server";

export default async function OrdersPage() {
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

    const orders = await api.order.getAllOrder();

    return (
        <main className="bg-gradient-to-b from-blue-50/60 via-white to-white mt-16 min-h-screen p-4">
            <section className="mx-auto max-w-6xl">
                <div className="mb-6 pt-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        My orders
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View and track your recent purchases.
                    </p>
                </div>

                {orders.length === 0 ? (
                    <section className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                        <div className="mb-4 flex justify-center">
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-blue-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="mb-2 text-xl font-semibold text-slate-900">
                            No orders yet
                        </h2>

                        <p className="mb-6 text-slate-500">
                            Your purchases will appear here once you place an order.
                        </p>

                        <Link
                            href="/"
                            className="inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] shadow-sm"
                        >
                            Start shopping
                        </Link>
                    </section>
                ) : (
                    <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">

                        {orders.map((order) => (
                            <section
                                key={order.id}
                                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            >

                                <div className="mb-5 flex items-start justify-between">
                                    <div>
                                        <h2 className="font-semibold text-slate-900">
                                            Order #{order.id.slice(-6).toUpperCase()}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
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
                                            className="h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1.5"
                                        />
                                    ))}
                                </div>

                                <div className="mb-5">
                                    <p className="text-slate-600 text-sm line-clamp-2">
                                        {order.orderItems
                                            .map((product) => product.product.title)
                                            .join(", ")}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Total
                                        </p>

                                        <p className="text-xl font-bold text-blue-600">
                                            ${order.totalPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    <Link
                                        href={`/order/${order.id}`}
                                        className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.99] shadow-sm"
                                    >
                                        View details
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