'use client'

import { QuestionArea } from '@/features/two-digit-x-two-digit/QuestionArea'
import { useState } from 'react'

import questionAreaStyle from '@/features/two-digit-x-two-digit/questionArea.module.scss'

export default function Page() {
    const [questionCount, setQuestionCount] = useState<number>(1)

    const clickHandlerNext = () => {
        setQuestionCount((count) => count + 1)
    }

    return (
        <>
            <div className={questionAreaStyle.container}>
                <div className={questionAreaStyle.question}>
                    {questionCount}問目
                </div>
                <QuestionArea
                    key={questionCount}
                    clickHandlerNext={clickHandlerNext}
                />
            </div>
        </>
    )
}
