import { DICTIONARY_NAMES, getDictionary } from '@/i18n/dictionaries'
import { QuestionBox } from './QuestionBox'
import { Language } from '@/i18n/settings'

export default async function Page(props: {
    params: Promise<{ lang: Language }>
}) {
    const params = await props.params
    const { lang } = params

    const dict = await getDictionary(
        lang,
        DICTIONARY_NAMES.TWO_DIGIT_X_TWO_DIGIT
    )
    return (
        <>
            <QuestionBox dict={dict} />
        </>
    )
}
