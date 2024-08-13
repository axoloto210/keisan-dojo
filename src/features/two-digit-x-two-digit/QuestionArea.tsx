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
                <>
                    <div>
                        {num1} × {num2}
                    </div>
                    {isDisplayAnswer ? (
                        <>
                            <div>{num1 * num2}</div>
                            <button onClick={props.clickHandlerNext}>
                                つぎへ
                            </button>
                        </>
                    ) : (
                        <button onClick={clickHandlerDisplayAnswer}>
                            こたえ
                        </button>
                    )}
                </>
            ) : (
                <Loading />
            )}
        </>
    )
}
