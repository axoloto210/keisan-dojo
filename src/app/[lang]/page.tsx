import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { Language } from '@/i18n/settings'
import Link from 'next/link'
import { TopPageDescription } from './TopPageDescription'
import style from '@/components/layout/linkMenu.module.scss'

export default async function Home(props: {
    params: Promise<{ lang: Language }>
}) {
    const params = await props.params

    const { lang } = params

    const [homeDict] = await Promise.all([
        await getDictionary(lang, DICTIONARY_NAMES.HOME),
    ])
    return (
        <>
            <TopPageDescription dict={homeDict} />
            <div className={style.linkButton}>
                <Link
                    className={style.link}
                    href={`${lang}/two-digit-x-two-digit`}
                >
                    {homeDict['two-x-two']}
                </Link>
            </div>
            <div className={style.linkButton}>
                <Link className={style.link} href={`${lang}/indian`}>
                    {homeDict.indian}
                </Link>
            </div>
            <div className={style.linkButton}>
                <Link className={style.link} href={`${lang}/indian-2`}>
                    {homeDict['indian-2']}
                </Link>
            </div>
        </>
    )
}
