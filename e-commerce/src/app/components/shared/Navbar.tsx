"use client"
import Navigation from "./Link";
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation";
import { authClient } from "~/server/better-auth/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: userSession } = authClient.useSession()

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, userSession]);

    async function signOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/")
                }
            }
        })
    }

    const navLinks = (
        <>
            <Navigation
                displayText="Shop"
                path="/"
                icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                )}
            />

            {userSession?.user.name != null ? (
                <>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 text-[15px] font-medium text-slate-600 hover:text-red-600 px-4 py-2.5 rounded-full hover:bg-red-50 active:scale-[0.97] cursor-pointer transition-all duration-200 w-full sm:w-auto text-left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Logout
                    </button>

                    <Navigation
                        displayText="Order"
                        path="/order"
                        icon={(
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        )}
                    />
                </>
            ) : (
                <Navigation
                    displayText="Login"
                    path="/auth"
                    icon={(
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
                        </svg>
                    )}
                />
            )}

            <Navigation
                displayText="Cart"
                path="/cart"
                icon={(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                )}
            />
        </>
    );

    return (
        <header>
            <nav className="h-16 z-50 fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/70 flex items-center px-4 sm:px-6">
                <div className="flex w-full justify-between items-center max-w-6xl mx-auto">

                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                            S
                        </div>
                        <p className="font-semibold text-[15px] sm:text-lg text-slate-900 tracking-tight">
                            Welcome, <span className="text-blue-600">{userSession?.user.name ?? "Guest"}</span>
                        </p>
                    </div>

                    <ul className="hidden sm:flex items-center gap-1">
                        {navLinks}
                    </ul>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="sm:hidden h-10 w-10 grid place-items-center rounded-full bg-blue-50 text-blue-600 active:scale-95 transition-transform duration-200"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                <ul className={`fixed top-0 left-0 h-screen w-72 bg-white p-6 shadow-2xl z-60 flex flex-col gap-1 transform transition-transform duration-500 ease-in-out sm:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {navLinks}
                </ul>
            </nav>

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 sm:hidden"
                />
            )}
        </header>
    );
}