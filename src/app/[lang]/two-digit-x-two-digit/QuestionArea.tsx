import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'
import questionAreaStyle from './questionArea.module.scss'
import { Dictionary } from '@/i18n/dictionaries'

type QuestionAreaProps = {
    clickHandlerNext: () => void
    dict: Dictionary
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [firstNumber, setFirstNumber] = useState<number>()
    const [secondNumber, setSecondNumber] = useState<number>()

    const { clickHandlerNext, dict } = props

    useEffect(() => {
        setFirstNumber(Math.floor(Math.random() * 89) + 11)
        setSecondNumber(Math.floor(Math.random() * 89) + 11)
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

    if (firstNumber == null || secondNumber == null) {
        return <Loading />
    }

    return (
        <>
            <div className={questionAreaStyle.container}>
                <div className={questionAreaStyle.question}>
                    {firstNumber} × {secondNumber}
                </div>
                {isDisplayAnswer ? (
                    <>
                        <div className={questionAreaStyle.question}>
                            {firstNumber * secondNumber}
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
                        <div className={questionAreaStyle.question}>？？？</div>
                        <button
                            onClick={clickHandlerDisplayAnswer}
                            className={questionAreaStyle.question}
                        >
                            {dict.answer}⏎
                        </button>
                    </>
                )}
            </div>
        </>
    )
}
