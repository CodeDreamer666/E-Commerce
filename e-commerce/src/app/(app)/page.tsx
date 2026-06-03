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
        <>
            <section
                className="mt-20 justify-around flex w-[95%] max-w-75 mb-2 mx-auto gap-1 items-center text-lg border-2 rounded-full px-2 py-1"
            >
                <label htmlFor="search">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
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
                    className="outline-none px-2 rounded-full"
                />

                <button
                    onClick={() => setSearchInput("")}
                    className="font-semibold cursor-pointer mr-1">
                    X
                </button>
            </section>

            <section
                className="py-4 flex flex-col items-center justify-center md:grid md:grid-cols-2 md:p-8 md:gap-2 md:mx-auto md:max-w-250 lg:grid-cols-3 lg:max-w-7xl"
            >

                {filterShopData.map(({ image, title, price, id }) => {
                    return (
                        <section
                            key={id}
                            className="w-[95%] p-4 relative max-w-100 mb-6 shadow-lg hover:shadow-lg rounded-lg transition-all duration-300 cursor-pointer"
                        >

                            <img src={image} alt={`A picture of ${title}`} loading="lazy" />

                            <div className="flex gap-4 justify-between items-center">
                                <h2 className="font-semibold text-[20px]">{title}</h2>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-black font-bold text-xl">${Number(price.toFixed(2))}</span>
                                </div>
                            </div>

                            <Link
                                className="mt-2 block text-center font-bold bg-[#2870d7] text-white w-full shadow-md rounded-lg py-2 cursor-pointer hover:bg-[#28C8D7] hover:shadow-lg transition-all duration-300"
                                href={`/products/${id}`}
                            >
                                View Details
                            </Link>

                        </section>
                    )
                })}

            </section>
        </>
    )
}