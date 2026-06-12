type StatusMessageProps = {
    isSuccess: "IDLE" | true | false,
    message: string,
    closeMessage: () => void
}

export default function StatusMessage({ isSuccess, message, closeMessage }: StatusMessageProps) {
    if (isSuccess === "IDLE") return null;

    return (
        <div className="fixed top-20 inset-x-0 z-50 pointer-events-none">
            <div className="max-w-6xl mx-auto px-4 flex justify-end">

                <section
                    className={`pointer-events-auto font-semibold text-base p-4 rounded-2xl shadow-lg border transition-all
                            ${isSuccess
                            ? "bg-blue-50 border-blue-100 text-blue-700"
                            : "bg-red-50 border-red-100 text-red-700"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <h2>{message}</h2>
                        <button
                            onClick={() => closeMessage()}
                            aria-label="Dismiss"
                            className="hover:bg-black/5 rounded-full size-7 flex items-center justify-center transition-colors cursor-pointer text-sm"
                        >
                            ✕
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}