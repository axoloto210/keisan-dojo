import { DICTIONARY } from '@/i18n/dictionaries'

type TopPageDescriptionProps = {
    dict: DICTIONARY
}

export function TopPageDescription(props: TopPageDescriptionProps) {
    const { dict } = props

    return (
        <>
            <h2>{dict.description}</h2>
        </>
    )
}
