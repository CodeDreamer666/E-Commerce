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
                <label htmlFor={text} className="font-semibold text-slate-700 text-sm">{displayText}</label>
                <span className="text-blue-500">*</span>
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
                className="transition-all duration-200 ease-in-out outline-none cursor-text focus:border-blue-400 focus:ring-2 focus:ring-blue-100 border-slate-200 bg-white border w-full rounded-xl h-11 px-4 text-sm text-slate-900 placeholder:text-slate-400 read-only:bg-slate-50 read-only:cursor-default"
            />
        </div>
    )
}