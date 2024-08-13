import Link from 'next/link'

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Link href={'two-digit-x-two-digit'}>{'2けた×2けた'}</Link>
        </main>
    )
}
