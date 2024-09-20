import { AVAILABLE_LOCALES } from '@/i18n/settings'
import style from './languageSwitcher.module.scss'

export function LanguageSwitcher() {
    return (
        <select className={style.language_switcher}>
            {AVAILABLE_LOCALES.map((lang) => {
                return <option key={lang}>{lang}</option>
            })}
        </select>
    )
}
