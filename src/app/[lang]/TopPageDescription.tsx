import { Dictionary } from '@/i18n/dictionaries'
import style from '@/app/[lang]/topPageDescription.module.scss'

type TopPageDescriptionProps = {
    dict: Dictionary
}

export function TopPageDescription(props: TopPageDescriptionProps) {
    const { dict } = props

    return (
        <>
            <div className={style.descriptionContainer}>
                <h2>{dict.description}</h2>
            </div>
        </>
    )
}
