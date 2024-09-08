import Link from 'next/link'

export default function Home({
    params: { lang },
}: {
    params: { lang: string }
}) {
    return (
        <>
            <div>{lang}</div>
            <Link href={'two-digit-x-two-digit'}>{'2けた×2けた'}</Link>
        </>
    )
}
