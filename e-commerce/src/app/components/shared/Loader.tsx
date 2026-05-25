export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        <p className="text-3xl font-mono font-medium tracking-[0.2em] uppercase text-slate-800">
          Loading
        </p>
        <div className="flex gap-3">
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-4 h-4 rounded-full bg-indigo-600 animate-bounce" />
        </div>
      </div>
    </div>
  );
}