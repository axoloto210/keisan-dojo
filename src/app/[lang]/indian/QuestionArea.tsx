import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'
import questionAreaStyle from './questionArea.module.scss'
import { Dictionary } from '@/i18n/dictionaries'

type QuestionAreaProps = {
    clickHandlerNext: () => void
    dict: Dictionary
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [firstDigit, setFirstDigit] = useState<number>()
    const [secondDigit, setSecondDigit] = useState<number>()

    const { clickHandlerNext, dict } = props

    useEffect(() => {
        const firstRandomNumber = Math.floor(Math.random() * 89) + 11
        const secondRandomNumber =
            Math.floor(firstRandomNumber / 10) * 10 +
            (10 - (firstRandomNumber % 10))

        setFirstDigit(firstRandomNumber)
        setSecondDigit(secondRandomNumber)
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
