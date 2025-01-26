import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'
import questionAreaStyle from './questionArea.module.scss'
import { Dictionary } from '@/i18n/dictionaries'

type QuestionAreaProps = {
    clickHandlerNext: () => void
    createNumbers: () => number[]
    dict: Dictionary
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [firstNumber, setFirstNumber] = useState<number>()
    const [secondNumber, setSecondNumber] = useState<number>()

    const { clickHandlerNext, createNumbers, dict } = props

    useEffect(() => {
        const [firstRandomNumber, secondRandomNumber] = createNumbers()
        setFirstNumber(firstRandomNumber)
        setSecondNumber(secondRandomNumber)
    }, [createNumbers])

    const [isDisplayAnswer, setIsDisplayAnswer] = useState<boolean>(false)

    // React Compiler によってuseCallbackを使用せずともメモ化され、useEffectが何度も発火しないようになっている。
    const clickHandler = () => {
        isDisplayAnswer ? clickHandlerNext() : setIsDisplayAnswer(true)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                clickHandler()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [clickHandler])

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
                    </>
                ) : (
                    <>
                        <div className={questionAreaStyle.question}>? ? ?</div>
                    </>
                )}
                <button
                    onClick={clickHandler}
                    className={`${questionAreaStyle.question} ${questionAreaStyle.dojo_button}`}
                >
                    <span className={questionAreaStyle.shadow}></span>
                    <span className={questionAreaStyle.edge}></span>
                    <span className={questionAreaStyle.front}>
                        {isDisplayAnswer ? dict.next : dict.answer}⏎
                    </span>
                </button>
            </div>
        </>
    )
}
