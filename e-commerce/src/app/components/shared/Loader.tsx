export default function Loader() {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="flex flex-col items-center gap-6">
                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loading
                </p>
                <div className="flex gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-bounce" />
                </div>
            </div>
        </div>
    );
}