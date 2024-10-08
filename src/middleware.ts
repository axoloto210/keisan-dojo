import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from './i18n/settings'

function getLocale(request: NextRequest) {
    const headers = {
        'accept-language': request.headers.get('accept-language') ?? '',
    }

    // クライアントの望む言語を優先順で取得
    let negotiatedLanguage = new Negotiator({ headers }).languages()

    return match(negotiatedLanguage, AVAILABLE_LOCALES, DEFAULT_LOCALE)
}

export const SWITCHED_LANGUAGE_KEY = 'switchedLanguage'

const isValidLanguage = (targetLanguage: string) => {
    return AVAILABLE_LOCALES.some((locale) => {
        return locale === targetLanguage
    })
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const pathnameHasLocale = AVAILABLE_LOCALES.some((locale) => {
        return pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    })

    if (!pathnameHasLocale) {
        let lang =
            request.cookies.has(SWITCHED_LANGUAGE_KEY) &&
            isValidLanguage(request.cookies.get(SWITCHED_LANGUAGE_KEY)!.value)
                ? request.cookies.get(SWITCHED_LANGUAGE_KEY)!.value
                : getLocale(request)

        request.nextUrl.pathname = `/${lang}${pathname}`
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
