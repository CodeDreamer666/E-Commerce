"use client"
import { api } from "~/trpc/react"
import { useState } from "react"
import Link from "next/link"
import Loader from "../components/shared/Loader"
import ServerError from "../components/shared/ServerError"

export default function Shop() {
    const { data: products, isLoading, error } = api.products.getAllProduct.useQuery()
    const [searchInput, setSearchInput] = useState("");

    if (isLoading) return <Loader />

    if (error || !products) return <ServerError />

    const filterShopData = products.filter(product => product.title.toLowerCase().includes(searchInput.trim().toLowerCase()))

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-white to-white">

            <section className="pt-24 pb-2 px-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Shop</h1>
                <p className="text-slate-500 mt-1 text-sm sm:text-base">Find something you'll love</p>
            </section>

            <section
                className="justify-around flex w-[95%] max-w-md mb-2 mt-5 mx-auto gap-2 items-center text-base bg-white border border-slate-200 rounded-full px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all duration-300"
            >
                <label htmlFor="search" className="text-slate-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </label>

                <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    type="text"
                    autoComplete="off"
                    id="search"
                    name="search"
                    placeholder="Search products..."
                    className="outline-none px-1 flex-1 bg-transparent text-slate-900 placeholder:text-slate-400"
                />

                {searchInput && (
                    <button
                        onClick={() => setSearchInput("")}
                        aria-label="Clear search"
                        className="shrink-0 h-6 w-6 grid place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-semibold text-sm cursor-pointer transition-colors duration-200"
                    >
                        ×
                    </button>
                )}
            </section>

            <section
                className="py-8 px-4 flex flex-col items-center md:grid md:grid-cols-2 md:gap-6 md:max-w-3xl md:mx-auto lg:grid-cols-3 lg:max-w-6xl"
            >

                {filterShopData.length === 0 && (
                    <p className="text-slate-400 text-center col-span-full py-12">No products match your search.</p>
                )}

                {filterShopData.map(({ image, title, price, id }) => {
                    return (
                        <section
                            key={id}
                            className="w-full max-w-sm mb-6 bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                        >

                            <div className="aspect-square w-full bg-slate-50 overflow-hidden">
                                <img
                                    src={image}
                                    alt={`A picture of ${title}`}
                                    loading="lazy"
                                    className="h-full w-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex gap-3 justify-between items-start">
                                    <h2 className="font-semibold text-base text-slate-900 leading-snug line-clamp-2">{title}</h2>
                                    <span className="text-blue-600 font-bold text-lg whitespace-nowrap">${Number(price.toFixed(2))}</span>
                                </div>

                                <Link
                                    className="block text-center font-semibold bg-blue-600 text-white w-full rounded-xl py-2.5 hover:bg-blue-700 active:scale-[0.98] shadow-sm transition-all duration-200"
                                    href={`/products/${id}`}
                                >
                                    View Details
                                </Link>
                            </div>

                        </section>
                    )
                })}

            </section>
        </div>
    )
}