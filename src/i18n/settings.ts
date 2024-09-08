export const DEFAULT_LOCALE = 'ja'
export const AVAILABLE_LOCALES = [DEFAULT_LOCALE, 'en-US', 'fr'] as const

type Locales = typeof AVAILABLE_LOCALES
export type Language = Locales[number]
