type StatusMessageProps = {
    isSuccess: "IDLE" | true | false,
    message: string,
    closeMessage: () => void
}

export default function StatusMessage({ isSuccess, message, closeMessage }: StatusMessageProps) {
    if (isSuccess === "IDLE") return null;

    return (
        < div className="fixed top-20 inset-x-0 z-50 pointer-events-none" >
            <div className="max-w-6xl mx-auto px-4 flex justify-end">

                <section
                    className={`pointer-events-auto font-bold text-lg p-4 rounded-xl shadow-2xl border-2 transition-all
                            ${isSuccess
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <h2>{message}</h2>
                        <button
                            onClick={() => closeMessage()}
                            className="hover:bg-black/5 rounded-full size-8 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </section>

            </div>
        </div >
    )
}