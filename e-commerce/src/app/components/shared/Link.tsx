import Link from "next/link";
import type { JSX } from "react";

type NavigationProps = {
    path: string,
    icon: JSX.Element,
    displayText: string
}

export default function Navigation({ path, icon, displayText }: NavigationProps) {
    return (
        <Link
            href={path}
            className="flex items-center gap-3 text-[15px] font-medium text-slate-600 hover:text-blue-600 px-4 py-2.5 rounded-full hover:bg-blue-50 active:scale-[0.97] transition-all duration-200 w-full sm:w-auto"
        >
            <span className="text-blue-500 [&>svg]:size-5">{icon}</span>
            {displayText}
        </Link>
    )
}