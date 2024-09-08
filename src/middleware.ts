import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const DEFAULT_LOCALE = 'ja'
const AVAILABLE_LOCALES = [DEFAULT_LOCALE, 'en-US', 'fr']

function getLocale(request: NextRequest) {
    const headers = {
        'accept-language': request.headers.get('accept-language') ?? '',
    }

    // クライアントの望む言語を優先順で取得
    let negotiatedLanguage = new Negotiator({ headers }).languages()

    return match(negotiatedLanguage, AVAILABLE_LOCALES, DEFAULT_LOCALE)
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const pathnameHasLocale = AVAILABLE_LOCALES.some((locale) => {
        return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    })

    if (!pathnameHasLocale) {
        const locale = getLocale(request)
        request.nextUrl.pathname = `/${locale}${pathname}`
        return NextResponse.redirect(request.nextUrl)
    }

    return NextResponse.next()
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
