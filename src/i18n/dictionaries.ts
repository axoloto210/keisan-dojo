import 'server-only'
import { Language } from './settings'

const LANGUAGE_PATHS = {
    ja: 'locale/ja',
    'en-US': 'locale/en-US',
    fr: 'locale/fr',
} as const satisfies { [lang in Language]: string }

type DictionaryLoader = (
    lang: Language,
    fileName: string
) => Promise<Dictionary>

const createDictionaryLoader = (): DictionaryLoader => {
    return async (lang: Language, fileName: string) => {
        if (!LANGUAGE_PATHS[lang]) {
            throw new Error(`Unsupported language: ${lang}`)
        }

        try {
            const dictionaryModule = await import(
                `./${LANGUAGE_PATHS[lang]}/${fileName}.json`
            )
            return dictionaryModule.default
        } catch (error) {
            console.error(
                `Failed to load dictionary for ${lang}/${fileName}.json:`,
                error
            )
            throw error
        }
    }
}

const dictionaryLoader = createDictionaryLoader()

export const getDictionary = async (locale: Language, fileName: string) => {
    return dictionaryLoader(locale, fileName)
}

export const DICTIONARY_NAMES = {
    HOME: 'home',
    TWO_DIGIT_X_TWO_DIGIT: 'two-digit-x-two-digit',
    INDIAN_METHOD: 'guide/indian-method',
} as const satisfies Dictionary

export type Dictionary = {
    [key: string]: string
}
