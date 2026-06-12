"use client";
import { useSearchParams } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export default function SignInClient() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50/60 via-white to-white px-4">
            <section className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">

                <div className="mb-8 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        S
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Welcome
                        </h1>

                        <p className="text-sm text-slate-500 leading-relaxed">
                            Continue with Google to access your account.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: redirect,
                        });
                    }}
                    className="flex h-12 cursor-pointer w-full items-center justify-center gap-3 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.99]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5">
                        <path fill="#FFC107" d="M21.35 11.1h-9.17v2.92h5.36c-.23 1.49-1.62 4.38-5.36 4.38a5.99 5.99 0 1 1 0-11.98c1.66 0 2.8.7 3.45 1.3l2.36-2.27C16.51 3.99 14.46 3 12.18 3 6.99 3 2.85 7.13 2.85 12.32s4.14 9.32 9.33 9.32c5.38 0 8.95-3.78 8.95-9.1 0-.61-.07-1.07-.16-1.44Z" />
                    </svg>
                    Continue with Google
                </button>

            </section>
        </section>
    );
}