import Link from 'next/link'
import { LanguageSwitcher } from '../LanguageSwitcher'
import style from './header.module.scss'

export const Header = () => {
    return (
        <header className={style.header}>
            <h1 className="text-4xl font-bold text-left">
                <Link href={'/'} className=" hover:text-red-600">
                    Keisan Dojo
                </Link>
            </h1>
            <div className={style.language_switcher}>
                <LanguageSwitcher />
            </div>
        </header>
    )
}
;``
