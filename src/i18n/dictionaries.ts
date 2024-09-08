import 'server-only'
import { Language } from './settings'

const DICTIONARIES = {
    // TODO: Enable importing of additional JSON files.
    ja: () => import('./locale/ja/home.json').then((module) => module.default),
    'en-US': () =>
        import('./locale/en-US/home.json').then((module) => module.default),
    fr: () => import('./locale/fr/home.json').then((module) => module.default),
}

export const getDictionary = async (locale: Language) => DICTIONARIES[locale]()
