import Link from 'next/link'

export const Header = () => {
    return (
        <header className="p-4 bg-gray-800 text-white">
            <h1 className="text-4xl font-bold text-left">
                <Link href={'/'} className=" hover:text-red-600">
                    Keisan Dojo
                </Link>
            </h1>
        </header>
    )
}
