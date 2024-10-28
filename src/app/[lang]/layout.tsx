import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import '../globals.css'
import { Language } from '@/i18n/settings'
import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { Analytics } from '@vercel/analytics/react'

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
            <body className="bg-slate-500">
                <Header lang={lang} />
                <main className="bg-white max-w-screen-md mx-auto min-h-screen">
                    {children}
                </main>
                <Analytics />
            </body>
        </html>
    )
}
