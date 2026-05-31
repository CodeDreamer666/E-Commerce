"use client";
import { useSearchParams } from "next/navigation";
import { authClient } from "~/server/better-auth/client";

export default function SignInClient() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/";

    return (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
            <section className="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-2xl shadow-blue-100">

                <div className="mb-8 flex flex-col items-center text-center gap-3">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Welcome
                    </h1>

                    <p className="text-sm text-gray-500 leading-relaxed">
                        Continue with Google to access your account.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: redirect,
                        });
                    }}
                    className="flex h-12 cursor-pointer w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    Continue with Google
                </button>

            </section>
        </section>
    );
}