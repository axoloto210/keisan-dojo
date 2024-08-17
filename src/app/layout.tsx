import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

export const metadata: Metadata = {
    title: 'Keisan Dojo',
    description:
        '2けたのかけ算の暗算など、計算の修行ができます。おみやげ算やインド式計算法などをみにつけよう！',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ja">
            <body>
                <Header />
                {children}
            </body>
        </html>
    )
}
