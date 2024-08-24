'use client'

import { Loading } from '@/components/layout/Loading'
import { useEffect, useState } from 'react'

type QuestionAreaProps = {
    clickHandlerNext: () => void
}

export const QuestionArea = (props: QuestionAreaProps) => {
    const [num1, setNum1] = useState<number>()
    const [num2, setNum2] = useState<number>()

    useEffect(() => {
        setNum1(10 + (Math.floor(Math.random() * 100) % 90))
        setNum2(10 + (Math.floor(Math.random() * 100) % 90))
    }, [])

    const [isDisplayAnswer, setIsDisplayAnswer] = useState<boolean>(false)

    const clickHandlerDisplayAnswer = () => {
        setIsDisplayAnswer(true)
    }

    return (
        <>
            {!!num1 && !!num2 ? (
                <div>
                    <div className="p-4 text-6xl">
                        {num1} × {num2}
                    </div>
                    {isDisplayAnswer ? (
                        <>
                            <div className="p-4 text-6xl">{num1 * num2}</div>
                            <button
                                onClick={props.clickHandlerNext}
                                className="p-4 text-6xl"
                            >
                                つぎへ
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="p-4 text-6xl">？？？</div>
                            <button
                                onClick={clickHandlerDisplayAnswer}
                                className="p-4 text-6xl"
                            >
                                こたえ
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
