import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { Language } from '@/i18n/settings'
import Link from 'next/link'

export default async function Home({
    params: { lang },
}: {
    params: { lang: Language }
}) {
    const [homeDict, indianMethodDict] = await Promise.all([
        await getDictionary(lang, DICTIONARY_NAMES.HOME),
        await getDictionary(lang, DICTIONARY_NAMES.INDIAN_METHOD),
    ])
    return (
        <>
            <Link href={`${lang}/two-digit-x-two-digit`}>
                {homeDict['two-x-two']}
            </Link>
            <Link href={`${lang}/guide/indian-method`}>
                {indianMethodDict.title}
            </Link>
        </>
    )
}
