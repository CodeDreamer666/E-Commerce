type FomrTitleProps = {
    heading: string,
    subHeading: string
}

export default function FormTitle({ heading, subHeading }: FomrTitleProps) {
    return (
        <div className="mb-6 flex flex-col">
            <h1 className="text-2xl font-semibold text-left">{heading}</h1>
            <p className="text-sm italic text-gray-500">{subHeading}</p>
        </div>
    )
}