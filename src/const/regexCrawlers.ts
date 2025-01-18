export const REGEX_CRAWLERS = new RegExp(
    [
        'Googlebot',
        'AdsBot-Google',
        'Mediapartners-Google',

        'bingbot',
        'BingPreview',

        'Slurp',

        'Twitterbot',
        'facebookexternalhit',
        'LinkedInBot',

        'DuckDuckBot',
        'Baiduspider',
        'YandexBot',
        'Applebot',

        'axios',
        'http_get',
        'curl',
        'Python-urllib',
        'python-requests',
        'HeadlessChrome',
    ].join('|')
)
