export const SWITCHED_LANGUAGE_KEY = 'switchedLanguage'

export const DEFAULT_LOCALE = 'ja'

export const AVAILABLE_LANGUAGES = [
    { locale: 'ja', name: 'japanese', flag: '🇯🇵' },
    { locale: 'en-US', name: 'English', flag: '🇺🇸' },
    { locale: 'fr', name: 'French', flag: '🇫🇷' },
] as const satisfies { locale: Language; name: string; flag: string }[]

export const AVAILABLE_LOCALES = ['ja', 'en-US', 'fr'] as const

type Locales = typeof AVAILABLE_LOCALES
export type Language = Locales[number]
