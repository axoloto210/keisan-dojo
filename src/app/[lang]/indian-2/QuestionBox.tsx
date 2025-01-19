'use client'

import { QuestionArea } from '@/features/two-digit-x-two-digit/QuestionArea'
import { useState } from 'react'

import questionAreaStyle from '@/app/[lang]/indian/questionBox.module.scss'
import { Dictionary } from '@/i18n/dictionaries'
import { createNumbers } from './createRandomNumber'

type QuestionBoxProps = {
    dict: Dictionary
}

export function QuestionBox(questionBoxProps: QuestionBoxProps) {
    const { dict } = questionBoxProps
    const [questionCount, setQuestionCount] = useState<number>(1)
    const [d, setD] = useState(false)

    const clickD = () => {
        setD(!d)
    }

    const clickHandlerNext = () => {
        setQuestionCount((count) => count + 1)
    }

    return (
        <>
            <div className={questionAreaStyle.container}>
                <div>{d ? 'true' : 'false'}</div>
                <div className={questionAreaStyle.question}>
                    Q.{questionCount}
                </div>
                <QuestionArea
                    key={questionCount}
                    clickHandlerNext={clickHandlerNext}
                    createNumbers={createNumbers}
                    dict={dict}
                />
                <button onClick={clickD}>d切り替え</button>
            </div>
        </>
    )
}
