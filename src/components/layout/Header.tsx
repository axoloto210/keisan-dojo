import Link from 'next/link'
import { LanguageSwitcher } from '../LanguageSwitcher'
import style from './header.module.scss'
import { Language } from '@/i18n/settings'
import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'

type HeaderProps = { lang: Language }

export const Header = async ({ lang }: HeaderProps) => {
    const dict = await getDictionary(lang, DICTIONARY_NAMES.HOME)
    return (
        <header className={style.header}>
            <h1 className="text-4xl font-bold text-left">
                <Link href={'/'} className=" hover:text-red-600">
                    {dict.title}
                </Link>
            </h1>
            <div className={style.language_switcher}>
                <LanguageSwitcher />
            </div>
        </header>
    )
}
