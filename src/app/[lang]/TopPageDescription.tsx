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
                <h2 className={style.description}>{dict.topDescription}</h2>
            </div>
        </>
    )
}
