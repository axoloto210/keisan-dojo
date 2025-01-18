import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
import { REGEX_CRAWLERS } from './const/regexCrawlers'
import {
    AVAILABLE_LOCALES,
    DEFAULT_LOCALE,
    SWITCHED_LANGUAGE_KEY,
} from './i18n/settings'

function getLocale(request: NextRequest) {
    const headers = {
        'accept-language': request.headers.get('accept-language') ?? '',
    }
    const negotiatedLanguage = new Negotiator({ headers }).languages()
    return match(negotiatedLanguage, AVAILABLE_LOCALES, DEFAULT_LOCALE)
}

const isValidLanguage = (targetLanguage: string) => {
    return AVAILABLE_LOCALES.some((locale) => {
        return locale === targetLanguage
    })
}

const rewriteCrawler = (request: NextRequest) => {
    const userAgent = request.headers.get('user-agent') || ''

    if (REGEX_CRAWLERS.test(userAgent)) {
        request.nextUrl.pathname = `/${DEFAULT_LOCALE}${request.nextUrl}`
        return NextResponse.rewrite(request.nextUrl)
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const pathnameHasLocale = AVAILABLE_LOCALES.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
        return NextResponse.next()
    }
    rewriteCrawler(request)

    const lang =
        request.cookies.has(SWITCHED_LANGUAGE_KEY) &&
        isValidLanguage(request.cookies.get(SWITCHED_LANGUAGE_KEY)!.value)
            ? request.cookies.get(SWITCHED_LANGUAGE_KEY)!.value
            : getLocale(request)

    request.nextUrl.pathname = `/${lang}${pathname}`
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
