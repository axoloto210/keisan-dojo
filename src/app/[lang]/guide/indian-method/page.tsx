import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { Language } from '@/i18n/settings'

export default async function Page({
    params: { lang },
}: {
    params: { lang: Language }
}) {
    const dict = await getDictionary(lang, DICTIONARY_NAMES.INDIAN_METHOD)
    return (
        <article>
            <h2>{dict.title}</h2>
            <p>{dict.description}</p>
        </article>
    )
}
