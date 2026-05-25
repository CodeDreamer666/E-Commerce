export default function Logout({ onClick }: { onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex gap-2 items-center text-lg w-full text-left bg-[linear-gradient(to_bottom_right,#1C78C3,#2895D7)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg cursor-pointer transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            Logout
        </button>
    )
}