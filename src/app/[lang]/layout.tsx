import style from '@/app/[lang]/rootLayout.module.scss'
import { Header } from '@/components/layout/Header'
import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { Language } from '@/i18n/settings'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import '../globals.css'

export async function generateMetadata(props: {
    params: Promise<{ lang: Language }>
}): Promise<Metadata> {
    const params = await props.params

    const { lang } = params

    const dict = await getDictionary(lang, DICTIONARY_NAMES.HOME)
    return {
        title: dict.title,
        description: dict.description,
    }
}

export default async function RootLayout(
    props: Readonly<{
        params: Promise<{ lang: Language }>
        children: React.ReactNode
    }>
) {
    const params = await props.params

    const { lang } = params

    const { children } = props

    return (
        <html lang={`${lang}`}>
            <body className={style.root_body}>
                <Header lang={lang} />
                <main>{children}</main>
                <Analytics />
            </body>
        </html>
    )
}
