import Link from "next/link";
import { JSX } from "react";

type NavigationProps = {
    path: string,
    icon: JSX.Element,
    displayText: string
}

export default function Navigation({ path, icon, displayText }: NavigationProps) {
    return (
        <Link href={path} className="flex gap-2 items-center text-lg w-full text-left bg-[linear-gradient(to_bottom_right,#1C78C3,#2895D7)] text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 hover:shadow-lg cursor-pointer transition-all duration-300">
            {icon}
            {displayText}
        </Link>
    )
}