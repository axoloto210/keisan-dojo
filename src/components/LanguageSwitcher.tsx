'use client'

import { AVAILABLE_LANGUAGES, DEFAULT_LOCALE } from '@/i18n/settings'
import { SWITCHED_LANGUAGE_KEY } from '@/middleware'
import { getCookie, setCookie } from 'cookies-next' // https://www.npmjs.com/package/cookies-next
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import style from './languageSwitcher.module.scss'

export function LanguageSwitcher() {
    const router = useRouter()
    const paths = usePathname().split('/')

    const lang = paths[1]
    const restPaths = paths.toSpliced(0, 2) // delete the first two elements

    const initialLanguage =
        getCookie(SWITCHED_LANGUAGE_KEY) ?? lang ?? DEFAULT_LOCALE

    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)

    const changeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const switchedLanguage = e.target.value
        setSelectedLanguage(switchedLanguage)
        setCookie(SWITCHED_LANGUAGE_KEY, switchedLanguage)

        const newPath = `/${switchedLanguage}/`.concat(restPaths.join('/'))
        router.push(newPath)
    }

    return (
        <div className={style.select_wrap}>
            <select
                className={style.language_switcher}
                value={selectedLanguage}
                onChange={changeEventHandler}
            >
                {AVAILABLE_LANGUAGES.map((lang) => {
                    return (
                        <option key={lang.locale} value={lang.locale}>
                            {`${lang.flag} ${lang.name}`}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}
