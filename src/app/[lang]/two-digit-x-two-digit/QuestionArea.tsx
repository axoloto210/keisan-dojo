import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'
import questionAreaStyle from './questionArea.module.scss'
import { DICTIONARY } from '@/i18n/dictionaries'

type QuestionAreaProps = {
    clickHandlerNext: () => void
    dict: DICTIONARY
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [firstDigit, setFirstDigit] = useState<number>()
    const [secondDigit, setSecondDigit] = useState<number>()

    const { clickHandlerNext, dict } = props

    useEffect(() => {
        setFirstDigit(Math.floor(Math.random() * 89) + 11)
        setSecondDigit(Math.floor(Math.random() * 89) + 11)
    }, [])

    const [isDisplayAnswer, setIsDisplayAnswer] = useState<boolean>(false)

    const clickHandlerDisplayAnswer = () => {
        setIsDisplayAnswer(true)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (isDisplayAnswer) {
                    clickHandlerNext()
                } else {
                    clickHandlerDisplayAnswer()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isDisplayAnswer, clickHandlerNext])

    return (
        <>
            {!!firstDigit && !!secondDigit ? (
                <div className={questionAreaStyle.container}>
                    <div className={questionAreaStyle.question}>
                        {firstDigit} × {secondDigit}
                    </div>
                    {isDisplayAnswer ? (
                        <>
                            <div className={questionAreaStyle.question}>
                                {firstDigit * secondDigit}
                            </div>
                            <button
                                onClick={props.clickHandlerNext}
                                className={questionAreaStyle.question}
                            >
                                {dict.next}⏎
                            </button>
                        </>
                    ) : (
                        <>
                            <div className={questionAreaStyle.question}>
                                ？？？
                            </div>
                            <button
                                onClick={clickHandlerDisplayAnswer}
                                className={questionAreaStyle.question}
                            >
                                {dict.answer}⏎
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}
