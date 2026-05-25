type ButtonProps = {
    displayText: string,
    onClick?: (event: React.SyntheticEvent) => void,
    className?: string,
    type?: "button" | "submit" | "reset",
    disabled?: boolean
}

export default function Button({ 
    displayText, 
    onClick, 
    className = "cursor-pointer px-4 py-2 mt-4 block text-center w-full bg-blue-600 text-white font-medium rounded-md text-lg shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]",
    type = "button",
    disabled = false
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={className}
            type={type ?? "button"}
            disabled={disabled}
        >
            {displayText}
        </button>
    )
}
