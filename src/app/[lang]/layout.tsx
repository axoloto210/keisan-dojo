import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import '../globals.css'
import { Language } from '@/i18n/settings'
import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'

export async function generateMetadata({
    params: { lang },
}: {
    params: { lang: Language }
}): Promise<Metadata> {
    const dict = await getDictionary(lang, DICTIONARY_NAMES.HOME)
    return {
        title: dict.title,
        description: dict.description,
    }
}

export default function RootLayout({
    params: { lang },
    children,
}: Readonly<{
    params: { lang: Language }
    children: React.ReactNode
}>) {
    return (
        <html lang={`${lang}`}>
            <body className="bg-slate-500">
                <Header lang={lang} />
                <main className="bg-white max-w-screen-md mx-auto min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    )
}
