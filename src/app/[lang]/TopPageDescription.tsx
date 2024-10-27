type TopPageDescriptionProps = {
    dict: { [key: string]: string }
}

export function TopPageDescription(props: TopPageDescriptionProps) {
    const { dict } = props

    return (
        <>
            <h2>{dict.description}</h2>
        </>
    )
}
