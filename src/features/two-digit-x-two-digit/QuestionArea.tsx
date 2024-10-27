import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'
import questionAreaStyle from './questionArea.module.scss'

type QuestionAreaProps = {
    clickHandlerNext: () => void
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [firstDigit, setFirstDigit] = useState<number>()
    const [secondDigit, setSecondDigit] = useState<number>()

    const { clickHandlerNext } = props

    useEffect(() => {
        setFirstDigit(10 + (Math.floor(Math.random() * 100) % 90))
        setSecondDigit(10 + (Math.floor(Math.random() * 100) % 90))
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
                                つぎへ⏎
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
                                こたえ⏎
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
