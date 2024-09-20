import { getDictionary } from '@/i18n/dictionaries'
import { Language } from '@/i18n/settings'
import Link from 'next/link'

export default async function Home({
    params: { lang },
}: {
    params: { lang: Language }
}) {
    const dict = await getDictionary(lang, 'home')
    return (
        <>
            <div>{lang}</div>
            <Link href={`${lang}/two-digit-x-two-digit`}>
                {dict['two-x-two']}
            </Link>
        </>
    )
}
