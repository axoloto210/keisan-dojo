import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
    title: 'Keisan Dojo',
    description: '2けたのかけ算の暗算など、計算の修行ができます。',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ja">
            <body className="bg-slate-500">
                <Header />
                <main className="bg-white max-w-screen-md mx-auto min-h-screen">
                    <div className="flex  flex-col items-center justify-between">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    )
}
