type InputProps = {
    displayText?: string;
    text: string;
    value?: string | number,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    isReadOnly?: boolean;
}

export default function Input({ displayText, text, value, onChange, type = "text", placeholder = "", isReadOnly = false }: InputProps) {
    return (
        <div className="mb-4">
            <div className="flex gap-1 mb-2">
                <label htmlFor={text} className="font-semibold text">{displayText}</label>
                <span className="text-red-500">*</span>
            </div>
            <input
                autoComplete="off"
                required
                type={type}
                id={text}
                name={text}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={isReadOnly}
                className="transition-all duration-300 ease-in-out outline-none cursor-text focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-md border-gray-300 border w-full rounded-md h-10 px-4 text-sm"
            />
        </div>
    )
}
