import { Dictionary } from '@/i18n/dictionaries'

type TopPageDescriptionProps = {
    dict: Dictionary
}

export function TopPageDescription(props: TopPageDescriptionProps) {
    const { dict } = props

    return (
        <>
            <h2>{dict.description}</h2>
        </>
    )
}
