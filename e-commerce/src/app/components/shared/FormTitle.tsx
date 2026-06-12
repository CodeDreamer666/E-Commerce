type FomrTitleProps = {
    heading: string,
    subHeading: string
}

export default function FormTitle({ heading, subHeading }: FomrTitleProps) {
    return (
        <div className="mb-6 flex flex-col">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-left">{heading}</h1>
            <p className="text-sm text-slate-400 mt-0.5">{subHeading}</p>
        </div>
    )
}